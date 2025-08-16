'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConversationItem } from './conversation-item';
import { ChatSidebarProps } from '@/types/chat';
import { Plus, MoreVertical, LogOut, User, PanelLeftClose, PanelLeft } from 'lucide-react';

export function ChatSidebar({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  userName,
  userEmail,
  onSignOut,
  isCollapsed,
  onToggleCollapse
}: ChatSidebarProps) {
  const userInitials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (isCollapsed) {
    return (
      <div className="w-16 bg-card border-r border-border flex flex-col h-full">
        {/* Collapsed header */}
        <div className="p-3 border-b border-border flex justify-center">
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="p-2"
            title="Expand sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* New chat button - collapsed */}
        <div className="p-3">
          <Button
            onClick={onNewConversation}
            variant="ghost"
            size="sm"
            className="w-full p-2 bg-primary/10 hover:bg-primary/20"
            title="New chat"
          >
            <Plus className="w-4 h-4 text-primary" />
          </Button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User profile - collapsed */}
        <div className="p-3 border-t border-border flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                title={userName}
              >
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignOut} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header with New Chat button and Collapse toggle */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Conversations</h2>
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="p-1"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={onNewConversation}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="default"
        >
          <Plus className="w-4 h-4 mr-2" />
          New chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onClick={() => onConversationSelect(conversation.id)}
              onDelete={() => onDeleteConversation(conversation.id)}
            />
          ))}
          {conversations.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat to begin</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
            >
              <Avatar className="w-8 h-8 mr-3">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-sm truncate text-foreground">{userName}</div>
                <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
              </div>
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSignOut} variant="destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}