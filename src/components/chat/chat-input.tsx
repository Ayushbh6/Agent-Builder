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
              "border-border focus:border-primary focus:ring-primary",
              "text-sm leading-6"
            )}
            rows={1}
          />
          
          {/* Character counter */}
          {message.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
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
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Keyboard shortcut hint */}
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, 
          <kbd className="px-1 py-0.5 bg-muted rounded text-xs ml-1">Shift + Enter</kbd> for new line
        </span>
        {message.length > 500 && (
          <span className={cn(
            message.length > 1000 ? "text-destructive" : "text-yellow-600 dark:text-yellow-400"
          )}>
            {message.length > 1000 ? "Message too long" : "Long message"}
          </span>
        )}
      </div>
    </div>
  );
}