'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Loader2, TrendingUp, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Napisz wiadomość..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    {
      icon: <TrendingUp className="w-3 h-3" />,
      text: "Pokaż bestsellery",
      message: "Pokaż mi najpopularniejsze perfumy i bestsellery"
    },
    {
      icon: <Package className="w-3 h-3" />,
      text: "Status zamówienia",
      message: "Chcę sprawdzić status mojego zamówienia"
    }
  ];

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full resize-none border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-sm leading-relaxed min-h-[44px] max-h-[120px] transition-all duration-200"
            rows={1}
            disabled={isLoading}
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className={cn(
            "p-3 rounded-2xl transition-all duration-200 shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            message.trim() && !isLoading
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => !isLoading && onSendMessage(action.message)}
            disabled={isLoading}
            className="group flex items-center gap-2 px-3 py-2 text-xs bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transform hover:scale-105"
          >
            <span className="text-gray-500 group-hover:text-blue-600 transition-colors">
              {action.icon}
            </span>
            <span className="text-gray-700 group-hover:text-blue-700 font-medium transition-colors">
              {action.text}
            </span>
          </button>
        ))}
      </div>
      
      {/* Info */}
      <div className="text-xs text-gray-400 mt-2 text-center">
        💡 Tip: Opisz dokładnie czego szukasz - im więcej szczegółów, tym lepsze rekomendacje!
      </div>
    </div>
  );
}
