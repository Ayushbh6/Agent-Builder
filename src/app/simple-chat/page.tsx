'use client';

import { useChat } from '@ai-sdk/react';
import { useUser } from '@stackframe/stack';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SimpleChatPage() {
  const user = useUser({ or: 'redirect' });
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error } = useChat();

  if (!user) {
    return null; // Will redirect to sign in
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>AI Chat - Simple Version</CardTitle>
            <p className="text-sm text-muted-foreground">
              Hello {user.displayName}! This is using the proper Vercel AI SDK streaming.
            </p>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="space-y-4 mb-4 min-h-[400px] max-h-[400px] overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Start a conversation by typing a message below
                </div>
              )}
              
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.parts.map((part, partIndex) => {
                      if (part.type === 'text') {
                        return <div key={partIndex}>{part.text}</div>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
              
              {status === 'streaming' && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse">●</div>
                      <span>AI is typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4">
                Error: {error.message}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                    e.preventDefault();
                    sendMessage({
                      parts: [{ type: 'text', text: input }],
                    });
                    setInput('');
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-border rounded-md bg-background"
                disabled={status === 'streaming'}
              />
              <Button
                onClick={() => {
                  if (input.trim()) {
                    sendMessage({
                      parts: [{ type: 'text', text: input }],
                    });
                    setInput('');
                  }
                }}
                disabled={status === 'streaming' || !input.trim()}
              >
                Send
              </Button>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Status: {status} | Messages: {messages.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
