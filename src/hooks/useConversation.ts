
import { getConversation } from "@/lib/conversations";
import { useQuery } from "@tanstack/react-query";

export const useConversation = (conversationId: string) => {
  const { data: conversation, ...query } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      // This is a placeholder - in a real application, you would call your API
      // to fetch conversation details
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
