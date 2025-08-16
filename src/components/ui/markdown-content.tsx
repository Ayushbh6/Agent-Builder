'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        // Override prose styles to inherit colors from parent
        'prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit',
        'prose-em:text-inherit prose-code:text-inherit prose-pre:text-inherit',
        'prose-ul:text-inherit prose-ol:text-inherit prose-li:text-inherit',
        'prose-blockquote:text-inherit prose-a:text-inherit',
        // Remove default margins to fit chat bubble layout
        'prose-p:my-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-0',
        'prose-headings:my-2 prose-blockquote:my-2',
        // Code styling
        'prose-code:bg-black/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-code:before:content-none prose-code:after:content-none',
        // Pre/code block styling
        'prose-pre:bg-black/10 prose-pre:border prose-pre:rounded-md prose-pre:p-3',
        'prose-pre:overflow-x-auto prose-pre:text-sm',
        // List styling
        'prose-ul:pl-4 prose-ol:pl-4 prose-li:pl-0',
        // Blockquote styling
        'prose-blockquote:border-l-4 prose-blockquote:border-current prose-blockquote:pl-4',
        'prose-blockquote:italic prose-blockquote:opacity-80',
        // Preserve whitespace for line breaks
        'whitespace-pre-wrap',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      components={{
        // Custom code component for better styling
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="bg-black/10 px-1 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={cn('font-mono text-sm', className)} {...props}>
              {children}
            </code>
          );
        },
        // Custom pre component for code blocks
        pre: ({ children, ...props }) => (
          <pre
            className="bg-black/10 border rounded-md p-3 overflow-x-auto text-sm my-2"
            {...props}
          >
            {children}
          </pre>
        ),
        // Ensure paragraphs don't add extra spacing
        p: ({ children, ...props }) => (
          <p className="my-0 leading-relaxed" {...props}>
            {children}
          </p>
        ),
        // Style lists appropriately for chat
        ul: ({ children, ...props }) => (
          <ul className="my-2 pl-4 space-y-1" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="my-2 ml-4 list-decimal" style={{ paddingLeft: '1.5rem' }} {...props}>
            {children}
          </ol>
        ),
        // Style blockquotes for chat
        blockquote: ({ children, ...props }) => (
          <blockquote 
            className="border-l-4 border-current pl-4 my-2 italic opacity-80"
            {...props}
          >
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}