'use client';

import { Message } from '@/types/chat';
import { User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[85%] gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
          isUser 
            ? "bg-blue-500 text-white" 
            : "bg-gradient-to-br from-purple-500 to-blue-600 text-white"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-sm",
          isUser 
            ? "bg-blue-500 text-white rounded-br-md" 
            : "bg-white border rounded-bl-md"
        )}>
          {message.isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Myślę...</span>
            </div>
          ) : (
            <div className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap",
              isUser ? "text-white" : "text-gray-800"
            )}>
              {message.content}
            </div>
          )}
          
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-blue-100" : "text-gray-500"
          )}>
            {message.timestamp.toLocaleTimeString('pl-PL', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
