import { DifyResponse, ChatConfig } from '@/types/chat';

export class DifyAPI {
  private config: ChatConfig;
  
  constructor(config: ChatConfig) {
    this.config = config;
  }

  async sendMessage(
    message: string, 
    conversationId?: string,
    userId: string = 'anonymous'
  ): Promise<DifyResponse> {
    try {
      console.log('API Config:', {
        baseUrl: this.config.baseUrl,
        hasApiKey: !!this.config.apiKey,
        apiKeyPrefix: this.config.apiKey.substring(0, 8) + '...'
      });

      const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          response_mode: 'blocking',
          conversation_id: conversationId || undefined,
          user: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        answer: data.answer,
        conversation_id: data.conversation_id,
        message_id: data.message_id,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Dify API Error:', error);
      throw new Error('Nie mogę połączyć się z asystentem. Spróbuj ponownie.');
    }
  }
}

export const difyAPI = new DifyAPI({
  apiKey: process.env.DIFY_API_KEY || '',
  baseUrl: process.env.DIFY_API_BASE || 'https://api.dify.ai/v1',
});
