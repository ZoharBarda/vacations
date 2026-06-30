export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
}

export interface ChatState {
  loading: boolean;
  error: string | null;
  messages: ChatMessage[];
}
