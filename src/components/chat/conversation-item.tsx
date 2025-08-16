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

  const formatTimestamp = (date: Date | string | undefined) => {
    if (!date) return 'Unknown';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg transition-colors duration-200 cursor-pointer mx-2 overflow-hidden w-[calc(100%-1rem)]",
        isActive 
          ? "bg-accent border border-accent-foreground/20" 
          : "hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start p-3 pr-14 w-full">
        <MessageSquare 
          className={cn(
            "w-4 h-4 mt-0.5 mr-3 flex-shrink-0",
            isActive ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <div className="flex-1 min-w-0 pr-4">
          <div 
            className={cn(
              "font-medium text-sm truncate block max-w-[calc(100%-3.5rem)]",
              isActive ? "text-foreground" : "text-foreground"
            )}
          >
            {conversation.title}
          </div>
        </div>
      </div>

      {/* Action Menu */}
      <div className={cn(
        "absolute top-2 right-2 transition-opacity z-10",
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-accent-foreground/10"
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
                variant="destructive"
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