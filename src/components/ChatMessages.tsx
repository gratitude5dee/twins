
import React from "react";
import { useAppState } from "@/hooks/useAppState";
import { useConversation } from "@/hooks/useConversation";
import { Message } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import AutoScrollToBottom from "@/components/AutoScrollToBottom";

const ChatMessages = () => {
  const { conversationId } = useAppState();
  const { conversation } = useConversation(conversationId);

  const messages = conversation?.messages || [];

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">No conversation selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
      {messages.length === 0 ? (
        <div className="text-center my-12">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted mb-3">
            <Bot className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
          <p className="text-muted-foreground">
            Send a message to begin chatting with the AI assistant.
          </p>
        </div>
      ) : (
        messages
          .filter((m: Message) => m.content.role !== "system")
          .filter((m: Message) => m.content.content.trim() !== "")
          .map((message: Message, index: number) => (
            <div
              key={message.message_id || index}
              className={`flex items-start space-x-2 ${
                message.content.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.content.role !== "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div 
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.content.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}
              >
                <p>{message.content.content}</p>
              </div>
              
              {message.content.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
      )}
      
      <AutoScrollToBottom />
    </div>
  );
};

export default ChatMessages;
