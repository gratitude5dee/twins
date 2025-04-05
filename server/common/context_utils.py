
from typing import Any, Dict, List, Optional, Tuple

from common.config import DEFAULT_LLM_CONTEXT
from common.models import Conversation, Message
from loguru import logger
from openai._types import NOT_GIVEN
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, Table, MetaData

from pipecat.services.ai_services import OpenAILLMContext


async def build_system_prompt(twin_data: Optional[Dict]) -> str:
    """Builds a system prompt based on twin personality data"""
    if not twin_data:
        # Fallback to default prompt if no twin data is available
        return DEFAULT_LLM_CONTEXT[0]['content']['content']
    
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
        return DEFAULT_LLM_CONTEXT[0]['content']['content']


async def fetch_twin_data(db: AsyncSession, twin_id: Optional[str] = None) -> Optional[Dict]:
    """Fetches twin data from the database"""
    if not twin_id:
        return None

    try:
        # Fetch the twin data from digital_twins table
        metadata = MetaData()
        digital_twins = Table('digital_twins', metadata, autoload_with=db.get_bind())
        
        twin_query = select(digital_twins).where(digital_twins.c.id == twin_id)
        twin_result = await db.execute(twin_query)
        twin_data = twin_result.mappings().first()
        
        logger.info(f"Fetched twin data for {twin_id}: {twin_data.keys() if twin_data else 'None'}")
        return dict(twin_data) if twin_data else None
    except Exception as e:
        logger.error(f"Error fetching twin personality data: {e}")
        return None


async def get_conversation_twin_id(db: AsyncSession, conversation_id: str) -> Optional[str]:
    """Gets the twin_id associated with a conversation"""
    try:
        conversation_query = select(Conversation).where(Conversation.conversation_id == conversation_id)
        conversation_result = await db.execute(conversation_query)
        conversation = conversation_result.scalars().first()
        return str(conversation.twin_id) if conversation and conversation.twin_id else None
    except Exception as e:
        logger.error(f"Error fetching twin_id for conversation {conversation_id}: {e}")
        return None


async def fetch_conversation_messages(db: AsyncSession, conversation_id: str) -> List[Dict]:
    """Fetches all messages for a conversation"""
    try:
        conversation = await Conversation.get_conversation_by_id(conversation_id, db)
        if not conversation:
            logger.warning(f"Conversation {conversation_id} not found")
            return []
        
        return [getattr(msg, "content") for msg in conversation.messages]
    except Exception as e:
        logger.error(f"Error fetching messages for conversation {conversation_id}: {e}")
        return []


async def initialize_chat_context(
    db: AsyncSession, 
    conversation_id: str, 
    twin_id: Optional[str] = None,
    tools: Any = NOT_GIVEN
) -> Tuple[OpenAILLMContext, Dict]:
    """
    Initializes an OpenAILLMContext with the appropriate messages and system prompt.
    
    Args:
        db: Database session
        conversation_id: ID of the conversation
        twin_id: Optional ID of the twin (will be fetched from conversation if not provided)
        tools: Optional tools configuration
        
    Returns:
        Tuple of (OpenAILLMContext, twin_data)
    """
    # If twin_id is not provided, get it from the conversation
    if not twin_id:
        twin_id = await get_conversation_twin_id(db, conversation_id)
    
    # Fetch twin data and conversation messages
    twin_data = await fetch_twin_data(db, twin_id)
    messages = await fetch_conversation_messages(db, conversation_id)
    
    # Build the system prompt based on twin data
    system_prompt = await build_system_prompt(twin_data)
    
    # Add system message if we don't already have one
    if system_prompt and (not messages or (messages and messages[0].get('content', {}).get('role') != "system")):
        messages.insert(0, {"content": {"role": "system", "content": system_prompt}})
    
    # Create and return the context
    context = OpenAILLMContext(messages, tools)
    return context, twin_data
