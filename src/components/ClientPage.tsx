import React, { useEffect, useState } from "react";
import { RTVIClient } from "@pipecat-ai/client-js";
import { RTVIClientProvider } from "@pipecat-ai/client-react";
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

export const ClientPage = () => {
  const { toast } = useToast();
  const {
    conversationId,
    conversationType,
    setConversationType,
    geminiApiKey,
    webrtcEnabled,
    websocketEnabled,
  } = useAppState();

  const [rtviClient, setRtviClient] = useState<RTVIClient | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!conversationId && rtviClient) {
      // If we're resetting conversation, clear the client
      rtviClient.disconnect();
      setRtviClient(null);
      return;
    }

    if (!conversationId) {
      return;
    }

    // If we already have a client for this conversation, don't create a new one
    if (rtviClient && rtviClient.options.id === conversationId) {
      return;
    }

    // Otherwise, create a new client
    let client: RTVIClient;

    if (rtviClient) {
      rtviClient.disconnect();
    }

    client = new RTVIClient({
      id: conversationId,
      serverURL: import.meta.env.VITE_SERVER_URL as string,
      apiKey: geminiApiKey,
    });

    setRtviClient(client);

    // Register event listeners
    const handleToggleSettings = () => {
      setShowSettings(!showSettings);
    };

    const handleUnhealthyConnection = () => {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "The connection to the server is unhealthy.",
      });
    };

    emitter.on("toggleSettings", handleToggleSettings);
    client.addListener("unhealthyConnection", handleUnhealthyConnection);

    return () => {
      emitter.off("toggleSettings", handleToggleSettings);
      client.removeListener("unhealthyConnection", handleUnhealthyConnection);
    };
  }, [
    conversationId,
    geminiApiKey,
    rtviClient,
    setConversationType,
    showSettings,
    toast,
  ]);

  if (!rtviClient && conversationId) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading client...</h2>
          <p className="text-muted-foreground">
            Connecting to conversation {conversationId}
          </p>
        </div>
      </div>
    );
  }

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
    <RTVIClientProvider client={rtviClient!}>
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
                <ChatMessages />
              </div>
              <ChatControls />
            </>
          )}
        </ErrorBoundary>
      </div>

      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent>
          <Settings onClose={() => setShowSettings(false)} />
        </SheetContent>
      </Sheet>

      <DeleteConversationModal />
    </RTVIClientProvider>
  );
};

export default ClientPage;
