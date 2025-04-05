
import { Message } from "@/lib/messages";

export interface ConversationModel {
  conversation_id: string;
  title?: string | null;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

interface GetConversationsParams {
  page: number;
  searchQuery?: string;
}

const PAGE_SIZE = 20;

/**
 * getConversations
 * 
 * Fetches a list of conversations from the backend API.
 * Requires VITE_SERVER_URL environment variable to be set.
 */
export async function getConversations({
  page,
  searchQuery = "",
}: GetConversationsParams) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!serverUrl) {
    console.error("VITE_SERVER_URL environment variable is not set");
    return [];
  }

  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("per_page", String(PAGE_SIZE));
  if (searchQuery) params.append("q", searchQuery.trim());
  
  try {
    const response = await fetch(
      `${serverUrl}/conversations?${params.toString()}`,
    );
    if (response.ok) {
      return (await response.json()) as ConversationModel[];
    }
    console.error("Failed to fetch conversations:", response.statusText);
    return [];
  } catch (e) {
    console.error("Error fetching conversations:", e);
    return [];
  }
}

interface GetConversationAndMessagesResponse {
  conversation: ConversationModel;
  messages: Message[];
}

/**
 * getConversation
 * 
 * Fetches a single conversation with its messages from the backend API.
 * Requires VITE_SERVER_URL environment variable to be set.
 */
export async function getConversation(conversationId: string) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!serverUrl) {
    console.error("VITE_SERVER_URL environment variable is not set");
    return null;
  }

  try {
    const response = await fetch(
      `${serverUrl}/conversations/${conversationId}/messages`,
    );
    if (response.ok) {
      const json = (await response.json()) as GetConversationAndMessagesResponse;
      const conversation: ConversationModel = {
        ...json.conversation,
        messages: json.messages,
      };
      return conversation;
    }
    console.error("Failed to fetch conversation:", response.statusText);
    return null;
  } catch (e) {
    console.error("Error fetching conversation:", e);
    return null;
  }
}
