
import {
  AppStateContext,
  ConversationType,
  InteractionMode,
} from "@/contexts/AppStateContext";
import { useDeferredValue, useEffect, useState } from "react";

interface Props {
  geminiApiKey: string;
  websocketEnabled: boolean;
  webrtcEnabled: boolean;
  initialConversationId?: string;
  initialTwinData?: any;
}

export const AppStateProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  geminiApiKey,
  webrtcEnabled,
  websocketEnabled,
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
