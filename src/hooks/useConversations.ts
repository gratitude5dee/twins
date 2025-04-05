
import { ConversationModel } from "@/lib/conversations";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface Props {
  searchQuery?: string;
}

export const useConversations = ({ searchQuery = "" }: Props = {}) => {
  const { data, ...query } = useInfiniteQuery<
    ConversationModel[],
    Error,
    InfiniteData<ConversationModel[], number>
  >({
    queryKey: ["conversations", searchQuery],
    initialData: {
      pages: [],
      pageParams: [],
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage = [], _allPages, lastPageParam) => {
      if (lastPage.length < 20) return undefined;
      return (lastPageParam as number) + 1;
    },
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      params.append("page", String(pageParam));
      params.append("per_page", "20");
      if (searchQuery) params.append("q", searchQuery.trim());
      
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/conversations?${params.toString()}`
        );
        if (response.ok) {
          return (await response.json()) as ConversationModel[];
        }
        return [];
      } catch (e) {
        console.error(e);
        return [];
      }
    },
  });

  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["conversations"],
    });

  const conversations = data.pages.reduce((arr, page) => [...arr, ...page], []);
  return {
    conversations,
    ...query,
    invalidate,
  };
};
