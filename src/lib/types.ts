
export type LLMMessageRole = "system" | "user" | "assistant";

export interface Message {
  message_id?: string;
  created_at?: string;
  content: {
    role: LLMMessageRole;
    content: string;
  };
  conversation_id?: string;
}
