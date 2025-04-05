
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAppState } from "@/hooks/useAppState";

const ChatControls = () => {
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { conversationId, conversationType } = useAppState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !conversationId || isProcessing) return;

    setIsProcessing(true);
    const message = inputValue;
    setInputValue("");

    try {
      // In a real implementation, this would send the message to the AI
      console.log("Sending message:", message);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
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
