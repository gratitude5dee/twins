
from typing import Any

from bots.persistent_context import PersistentContext
from bots.rtvi import create_rtvi_processor
from bots.types import BotCallbacks, BotConfig, BotParams
from common.config import SERVICE_API_KEYS
from common.models import Conversation, Message
from loguru import logger
from openai._types import NOT_GIVEN
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, Table, MetaData

from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.audio.vad.vad_analyzer import VADParams
from pipecat.pipeline.pipeline import Pipeline
from pipecat.processors.frame_processor import FrameDirection
from pipecat.processors.frameworks.rtvi import (
    RTVIBotLLMProcessor,
    RTVIBotTranscriptionProcessor,
    RTVIBotTTSProcessor,
    RTVISpeakingProcessor,
    RTVIUserTranscriptionProcessor,
)
from pipecat.services.ai_services import OpenAILLMContext
from pipecat.services.gemini_multimodal_live.gemini import (
    GeminiMultimodalLiveLLMService,
)
from pipecat.transports.services.daily import DailyParams, DailyTransport


async def build_system_prompt(twin_data):
    """Builds a system prompt based on twin personality data"""
    if not twin_data:
        # If no twin data, return empty string and let default prompt be used
        return ""
    
    try:
        name = twin_data.get('name', 'WZRD')
        description = twin_data.get('description', '')
        
        # Extract personality data from features and model_data
        features = twin_data.get('features', {}) or {}
        model_data = twin_data.get('model_data', {}) or {}
        
        bio = features.get('bio', '') if features else ''
        lore = features.get('lore', '') if features else ''
        knowledge = features.get('knowledge', '') if features else ''
        
        # Construct the system prompt with the personality data
        system_prompt = f"""You are {name}, a digital twin with the following traits:

Description: {description}

Bio: {bio}

Lore: {lore}

Knowledge: {knowledge}

Always stay in character as {name} during this conversation. Keep your responses brief when possible. Avoid bold and italic text formatting in your responses. You may reference your background knowledge when answering questions."""

        logger.debug(f"Generated system prompt for {name}: {system_prompt[:100]}...")
        return system_prompt
        
    except Exception as e:
        logger.error(f"Error building system prompt from twin data: {e}")
        return ""


async def bot_pipeline(
    params: BotParams,
    config: BotConfig,
    callbacks: BotCallbacks,
    room_url: str,
    room_token: str,
    db: AsyncSession,
) -> Pipeline:
    transport = DailyTransport(
        room_url,
        room_token,
        "Gemini Bot",
        DailyParams(
            audio_in_sample_rate=16000,
            audio_out_enabled=True,
            audio_out_sample_rate=24000,
            transcription_enabled=False,
            vad_enabled=True,
            vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.5)),
            vad_audio_passthrough=True,
        ),
    )

    conversation = await Conversation.get_conversation_by_id(params.conversation_id, db)
    if not conversation:
        raise Exception(f"Conversation {params.conversation_id} not found")
    
    # Fetch the twin's personality data
    twin_data = None
    try:
        # Fetch the twin data from digital_twins table
        metadata = MetaData()
        digital_twins = Table('digital_twins', metadata, autoload_with=db.get_bind())
        
        twin_query = select(digital_twins).where(digital_twins.c.id == conversation.twin_id)
        twin_result = await db.execute(twin_query)
        twin_data = twin_result.mappings().first()
        
        logger.info(f"Fetched twin data for {conversation.twin_id}: {twin_data.keys() if twin_data else 'None'}")
    except Exception as e:
        logger.error(f"Error fetching twin personality data: {e}")
        twin_data = None
    
    messages = [getattr(msg, "content") for msg in conversation.messages]
    
    # Build system prompt based on twin data
    system_prompt = await build_system_prompt(twin_data)
    
    # Add system message if we have a custom one and there isn't already one
    if system_prompt and (not messages or (messages and messages[0].get('role') != "system")):
        messages.insert(0, {"role": "system", "content": system_prompt})

    #
    # RTVI
    #

    llm_rt = GeminiMultimodalLiveLLMService(
        api_key=str(SERVICE_API_KEYS["gemini"]),
        voice_id="Aoede",  # Puck, Charon, Kore, Fenrir, Aoede
        # system_instruction="Talk like a pirate."
        transcribe_user_audio=True,
        transcribe_model_audio=True,
        inference_on_context_initialization=False,
    )

    tools = NOT_GIVEN  # todo: implement tools in and set here
    context_rt = OpenAILLMContext(messages, tools)
    context_aggregator_rt = llm_rt.create_context_aggregator(context_rt)
    user_aggregator = context_aggregator_rt.user()
    assistant_aggregator = context_aggregator_rt.assistant()
    await llm_rt.set_context(context_rt)
    storage = PersistentContext(context=context_rt)

    rtvi = await create_rtvi_processor(config, user_aggregator)

    # This will send `user-*-speaking` and `bot-*-speaking` messages.
    rtvi_speaking = RTVISpeakingProcessor()

    # This will send `user-transcription` messages.
    rtvi_user_transcription = RTVIUserTranscriptionProcessor()

    # This will send `bot-transcription` messages.
    rtvi_bot_transcription = RTVIBotTranscriptionProcessor()

    # This will send `bot-llm-*` messages.
    rtvi_bot_llm = RTVIBotLLMProcessor()

    # This will send `bot-tts-*` messages.
    rtvi_bot_tts = RTVIBotTTSProcessor(direction=FrameDirection.UPSTREAM)

    processors = [
        transport.input(),
        rtvi,
        user_aggregator,
        llm_rt,
        rtvi_speaking,
        rtvi_user_transcription,
        rtvi_bot_llm,
        rtvi_bot_transcription,
        transport.output(),
        rtvi_bot_tts,
        assistant_aggregator,
        storage.create_processor(exit_on_endframe=True),
    ]

    pipeline = Pipeline(processors)

    @storage.on_context_message
    async def on_context_message(messages: list[Any]):
        logger.debug(f"{len(messages)} message(s) received for storage")
        try:
            await Message.create_messages(
                db_session=db, conversation_id=params.conversation_id, messages=messages
            )
        except Exception as e:
            logger.error(f"Error storing messages: {e}")
            raise e

    @rtvi.event_handler("on_client_ready")
    async def on_client_ready(rtvi):
        await rtvi.set_bot_ready()
        for message in params.actions:
            await rtvi.handle_message(message)

    @transport.event_handler("on_first_participant_joined")
    async def on_first_participant_joined(transport, participant):
        # Enable both camera and screenshare. From the client side
        # send just one.
        await transport.capture_participant_video(
            participant["id"], framerate=1, video_source="camera"
        )
        await transport.capture_participant_video(
            participant["id"], framerate=1, video_source="screenVideo"
        )
        await callbacks.on_first_participant_joined(participant)

    @transport.event_handler("on_participant_joined")
    async def on_participant_joined(transport, participant):
        await callbacks.on_participant_joined(participant)

    @transport.event_handler("on_participant_left")
    async def on_participant_left(transport, participant, reason):
        await callbacks.on_participant_left(participant, reason)

    @transport.event_handler("on_call_state_updated")
    async def on_call_state_updated(transport, state):
        await callbacks.on_call_state_updated(state)

    return pipeline
