'use client';

import React from 'react';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { EmptyState } from './empty-state';
import { ChatContainerProps } from '@/types/chat';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

export function ChatContainer({
  conversation,
  onSendMessage,
  isLoading = false,
  isTyping = false,
  isSidebarCollapsed = false,
  onToggleSidebar
}: ChatContainerProps) {
  const handleStartConversation = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          {isSidebarCollapsed && onToggleSidebar && (
            <Button
              onClick={onToggleSidebar}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100"
              title="Show sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              {conversation?.title || 'Agent Builder'}
            </h1>
            {conversation && conversation.messages.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {conversation.messages.length} {conversation.messages.length === 1 ? 'message' : 'messages'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {conversation && conversation.messages.length > 0 ? (
          <ChatMessages 
            messages={conversation.messages} 
            isTyping={isTyping}
          />
        ) : (
          <EmptyState 
            onStartConversation={handleStartConversation}
            userName="there" // Will be updated when we have proper user context
          />
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            disabled={isLoading}
            placeholder={
              conversation?.messages.length === 0 
                ? "Start a conversation..." 
                : "Type your message..."
            }
          />
        </div>
      </div>
    </div>
  );
}