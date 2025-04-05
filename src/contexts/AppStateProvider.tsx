
import {
  AppStateContext,
  ConversationType,
  InteractionMode,
} from "@/contexts/AppStateContext";
import { useDeferredValue, useEffect, useState } from "react";

/**
 * AppStateProvider
 * 
 * IMPORTANT:
 * Make sure your .env file includes:
 * VITE_SERVER_URL=http://127.0.0.1:7860/api (or your server URL)
 */
interface Props {
  geminiApiKey?: string;
  websocketEnabled?: boolean;
  webrtcEnabled?: boolean;
  initialConversationId?: string;
  initialTwinData?: any;
}

export const AppStateProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  geminiApiKey = "",
  webrtcEnabled = false,
  websocketEnabled = false,
  initialConversationId = "",
  initialTwinData = null,
}) => {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("informational");
  const [conversationType, setConversationType] = useState<ConversationType>(
    initialConversationId ? "text-voice" : null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    setConversationType(conversationId ? "text-voice" : null);
  }, [conversationId]);

  // Check if server URL is set
  useEffect(() => {
    if (!import.meta.env.VITE_SERVER_URL) {
      console.error(
        "VITE_SERVER_URL environment variable is not set. " +
        "Make sure to add it to your .env file (e.g., VITE_SERVER_URL=http://127.0.0.1:7860/api)"
      );
    }
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        conversationId,
        setConversationId,
        conversationType,
        setConversationType,
        interactionMode,
        setInteractionMode,
        searchQuery: deferredSearchQuery,
        setSearchQuery,
        geminiApiKey,
        webrtcEnabled,
        websocketEnabled,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
