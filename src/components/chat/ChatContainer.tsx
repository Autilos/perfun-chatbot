'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateId(),
      content: `Cześć! 👋 Jestem Twoim asystentem Perfun.pl. 

Mogę pomóc Ci:
- Znaleźć idealne perfumy
- Porównać opcje i ceny
- Sprawdzić promocje
- Odpowiedzieć na pytania o produkty

W czym mogę Ci dziś pomóc?`,
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: generateId(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const userId = localStorage.getItem('chat_user_id') || (() => {
        const id = generateId();
        localStorage.setItem('chat_user_id', id);
        return id;
      })();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? {
          ...msg,
          content: data.answer,
          isLoading: false,
        } : msg
      ));

    } catch (error) {
      console.error('Chat error:', error);
      
      setMessages(prev => prev.map(msg => 
        msg.isLoading ? {
          ...msg,
          content: 'Przepraszam, wystąpił błąd. Spróbuj ponownie za chwilę.',
          isLoading: false,
        } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            P
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Asystent Perfun.pl</h1>
            <p className="text-xs text-gray-500">Online • Gotowy do pomocy</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Zapytaj o perfumy, promocje, zamówienia..."
      />
    </div>
  );
}
