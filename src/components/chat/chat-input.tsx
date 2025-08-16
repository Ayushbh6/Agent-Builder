'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatInputProps } from '@/types/chat';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = "Type your message..."
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isMessageEmpty = !message.trim();
  const showSendButton = !isMessageEmpty && !disabled;

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "resize-none pr-12 min-h-[44px] max-h-32",
              "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
              "text-sm leading-6"
            )}
            rows={1}
          />
          
          {/* Character counter */}
          {message.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {message.length}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!showSendButton || isLoading}
          size="default"
          className={cn(
            "px-4 h-[44px]",
            showSendButton
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Keyboard shortcut hint */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to send, 
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">Shift + Enter</kbd> for new line
        </span>
        {message.length > 500 && (
          <span className={cn(
            message.length > 1000 ? "text-red-500" : "text-yellow-600"
          )}>
            {message.length > 1000 ? "Message too long" : "Long message"}
          </span>
        )}
      </div>
    </div>
  );
}