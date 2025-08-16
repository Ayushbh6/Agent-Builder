'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConversationItemProps } from '@/types/chat';
import { MessageSquare, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
  onRename
}: ConversationItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newTitle = prompt('Enter new conversation title:', conversation.title);
    if (newTitle && newTitle.trim()) {
      onRename?.(newTitle.trim());
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg mx-2 transition-colors duration-200 cursor-pointer",
        isActive 
          ? "bg-blue-50 border border-blue-200" 
          : "hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start p-3 pr-8">
        <MessageSquare 
          className={cn(
            "w-4 h-4 mt-0.5 mr-3 flex-shrink-0",
            isActive ? "text-blue-600" : "text-gray-400"
          )} 
        />
        <div className="flex-1 min-w-0">
          <div 
            className={cn(
              "font-medium text-sm truncate",
              isActive ? "text-blue-900" : "text-gray-900"
            )}
          >
            {conversation.title}
          </div>
          {conversation.lastMessagePreview && (
            <div className="text-xs text-gray-500 truncate mt-1">
              {conversation.lastMessagePreview}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {formatTimestamp(conversation.updatedAt)}
          </div>
        </div>
      </div>

      {/* Action Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {onRename && (
              <DropdownMenuItem onClick={handleRename}>
                <Edit3 className="w-3 h-3 mr-2" />
                Rename
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}