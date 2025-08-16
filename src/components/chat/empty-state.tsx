'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyStateProps } from '@/types/chat';
import { Sparkles, Zap, Code, FileText } from 'lucide-react';

export function EmptyState({ onStartConversation, userName }: EmptyStateProps) {
  const suggestedPrompts = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Create an AI Agent",
      prompt: "Help me create an AI agent that can automate my email responses"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Workflow Automation",
      prompt: "Show me how to set up automated workflows for my business"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Technical Integration",
      prompt: "How can I integrate AI agents with my existing tools and APIs?"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Knowledge Base",
      prompt: "Help me upload documents to create a custom knowledge base for my agent"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl mb-6 shadow-lg">
          <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to Agent Builder
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Build intelligent AI agents that automate your workflows and enhance your productivity
        </p>
      </div>

      {/* Suggested Prompts */}
      <div className="w-full max-w-2xl">
        <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
          Get started with these suggestions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedPrompts.map((suggestion, index) => (
            <Card 
              key={index}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer border hover:border-primary/50"
              onClick={() => onStartConversation(suggestion.prompt)}
            >
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1">
                  {suggestion.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {suggestion.prompt}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground max-w-lg">
          You can create AI agents with custom knowledge bases, automate email responses, 
          integrate with calendars, and much more. Start by typing a message or selecting 
          one of the suggestions above.
        </p>
      </div>
    </div>
  );
}