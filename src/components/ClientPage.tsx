
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/useAppState";
import DeleteConversationModal from "@/components/DeleteConversationModal";
import ChatMessages from "@/components/ChatMessages";
import ChatControls from "@/components/ChatControls";
import WebSocketVoiceChat from "@/components/WebSocketVoiceChat";
import ErrorBoundary from "@/components/ErrorBoundary";
import Settings from "@/components/Settings";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import emitter from "@/lib/eventEmitter";
import { Message } from "@/lib/messages";
import { useConversation } from "@/hooks/useConversation";

/**
 * ClientPage Component
 * 
 * IMPORTANT:
 * 1. The Python backend server from the `pipecat-ai` repository's `/server` directory 
 *    must be running for chat functionality to work.
 * 2. Make sure your .env file contains VITE_SERVER_URL pointing to the backend
 *    (e.g., http://127.0.0.1:7860/api)
 * 3. If you're using authentication, you may need to integrate it with the API calls.
 */
export const ClientPage = () => {
  const { toast } = useToast();
  const { conversationId, conversationType, setConversationType } = useAppState();
  const [showSettings, setShowSettings] = useState(false);
  
  // Fetch conversation messages when conversationId changes
  const { conversation } = useConversation(conversationId);
  const messages = conversation?.messages || [];

  useEffect(() => {
    // Register event listeners
    const handleToggleSettings = () => {
      setShowSettings(!showSettings);
    };

    emitter.on("toggleSettings", handleToggleSettings);

    return () => {
      emitter.off("toggleSettings", handleToggleSettings);
    };
  }, [showSettings]);

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No conversation selected</h2>
          <p className="text-muted-foreground">
            Please select or create a conversation to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ErrorBoundary
        fallback={
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-destructive/10 text-destructive rounded-lg p-4 my-4">
                <h2 className="text-lg font-semibold mb-2">Error</h2>
                <p>
                  An error occurred while rendering the chat. Please try
                  refreshing the page.
                </p>
              </div>
            </div>
          </div>
        }
      >
        {conversationType === "voice-to-voice" ? (
          <div className="flex-1 overflow-auto">
            <WebSocketVoiceChat />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto px-4 py-6">
              <div className="max-w-3xl mx-auto">
                <ChatMessages messages={messages} />
              </div>
            </div>
            <ChatControls />
          </>
        )}
      </ErrorBoundary>

      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent>
          <Settings onClose={() => setShowSettings(false)} />
        </SheetContent>
      </Sheet>

      <DeleteConversationModal />
    </div>
  );
};

export default ClientPage;
