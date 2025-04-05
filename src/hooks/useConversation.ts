
import { getConversation } from "@/lib/conversations";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * useConversation hook
 * 
 * Fetches a single conversation from the pipecat-ai backend server.
 * Requires the VITE_SERVER_URL environment variable to be set.
 */
export const useConversation = (conversationId: string) => {
  const { data: conversation, ...query } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      return await getConversation(conversationId);
    },
    enabled: !!conversationId,
  });
  
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["conversation", conversationId],
    });
  
  return {
    conversation,
    ...query,
    invalidate,
  };
};
