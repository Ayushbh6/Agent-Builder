'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export function TypingIndicator() {
  return (
    <Card className="p-4 bg-white text-gray-900 shadow-sm border-0 w-fit">
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
          />
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
          />
          <div 
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
          />
        </div>
        <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
      </div>
    </Card>
  );
}