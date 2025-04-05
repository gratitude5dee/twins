
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
import { RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClient, useRTVIClientEvent } from "@pipecat-ai/client-react";

const ChatControls = () => {
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { conversationId, conversationType } = useAppState();
  const rtviClient = useRTVIClient();

  // Reset processing state when bot stops thinking
  useRTVIClientEvent(
    RTVIEvent.BotFinishedThinking,
    () => {
      setIsProcessing(false);
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !rtviClient || !conversationId || isProcessing) return;

    setIsProcessing(true);
    const message = inputValue;
    setInputValue("");

    try {
      // Send the text message to the AI
      await rtviClient.action({
        service: "llm",
        action: "append_to_messages",
        arguments: [
          {
            name: "messages",
            value: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: message,
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={isProcessing || !conversationId || conversationType === "voice-to-voice"}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!inputValue.trim() || isProcessing || !conversationId || conversationType === "voice-to-voice"}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatControls;
