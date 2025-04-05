
import React, { useState } from "react";
import AutoScrollToBottom from "@/components/AutoScrollToBottom";
import ChatMessage from "@/components/ChatMessage";
import { useAppState } from "@/hooks/useAppState";
import { Message, normalizeMessageText } from "@/lib/messages";

interface Props {
  autoscroll?: boolean;
  messages: Message[];
}

export default function ChatMessages({ autoscroll = true, messages = [] }: Props) {
  const { conversationId } = useAppState();
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {messages
        .filter((m) => m.content.role !== "system")
        .filter((m) => normalizeMessageText(m).trim() !== "")
        .map((message, index) => (
          <ChatMessage
            key={index}
            isSpeaking={
              message.content.role === "assistant" &&
              index === messages.length - 1 &&
              isBotSpeaking
            }
            message={message}
          />
        ))}
      <AutoScrollToBottom />
    </div>
  );
}
