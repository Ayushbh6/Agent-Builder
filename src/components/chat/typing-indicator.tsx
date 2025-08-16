'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export function TypingIndicator() {
  return (
    <Card className="p-4 bg-card text-card-foreground shadow-sm border border-border w-fit">
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          <div 
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
          />
          <div 
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
          />
          <div 
            className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
            style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
          />
        </div>
        <span className="text-sm text-muted-foreground ml-2">AI is typing...</span>
      </div>
    </Card>
  );
}