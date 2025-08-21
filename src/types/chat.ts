export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface DifyResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
  metadata?: Record<string, unknown>;
}

export interface ChatConfig {
  apiKey: string;
  baseUrl: string;
  conversationId?: string;
  userId?: string;
}
