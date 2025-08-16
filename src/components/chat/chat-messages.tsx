'use client';

import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessagesProps } from '@/types/chat';
import { TypingIndicator } from './typing-indicator';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatMessages({ messages, isTyping = false }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-4",
              message.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback 
                className={cn(
                  message.role === 'user' 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-600 text-white"
                )}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </AvatarFallback>
            </Avatar>

            {/* Message Content */}
            <div
              className={cn(
                "max-w-[70%] flex flex-col",
                message.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <Card
                className={cn(
                  "p-4 shadow-sm border-0",
                  message.role === 'user'
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900"
                )}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </Card>
              <div
                className={cn(
                  "text-xs text-gray-500 mt-1 px-2",
                  message.role === 'user' ? "text-right" : "text-left"
                )}
              >
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-4">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-gray-600 text-white">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-[70%]">
              <TypingIndicator />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}