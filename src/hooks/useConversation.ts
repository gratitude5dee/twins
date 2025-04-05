
import { useQuery } from "@tanstack/react-query";

export const useConversation = (conversationId: string) => {
  const { data: conversation, ...query } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      
      // This is a placeholder implementation
      // In a real app, you would fetch this from your API
      return {
        conversation_id: conversationId,
        title: "Conversation",
        messages: []
      };
    },
    enabled: !!conversationId,
  });

  return {
    conversation,
    ...query,
  };
};
