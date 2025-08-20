'use client'

import { Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Navigation } from './navigation'
import { UserMenu } from './user-menu'

// Mock data for recent conversations
const recentChats = [
  { id: '1', title: 'Customer Support Agent Setup', lastMessage: '2 hours ago' },
  { id: '2', title: 'Technical Documentation Bot', lastMessage: '1 day ago' },
  { id: '3', title: 'Sales Assistant Configuration', lastMessage: '3 days ago' },
  { id: '4', title: 'Research Agent Planning', lastMessage: '1 week ago' },
  { id: '5', title: 'Email Automation Workflow', lastMessage: '1 week ago' },
]

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col clay-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex h-16 items-center space-x-2 px-6 border-b border-sidebar-border">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{
            background: 'var(--clay-lavender)',
            boxShadow: `
              3px 3px 8px rgba(167, 139, 250, 0.3),
              -3px -3px 8px rgba(255, 255, 255, 0.8),
              inset 2px 2px 4px rgba(255, 255, 255, 0.4),
              inset -2px -2px 4px rgba(167, 139, 250, 0.2)
            `
          }}
        >
          <Sparkles className="w-5 h-5 text-purple-700" />
        </div>
        <span className="text-lg font-bold text-gradient">Agent Builder</span>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button className="btn-gradient w-full justify-start space-x-2" size="sm">
          <Plus className="h-4 w-4" />
          <span>New chat</span>
        </Button>
      </div>

      {/* Navigation */}
      <div className="px-4">
        <Navigation />
      </div>

      <Separator className="my-4 bg-sidebar-border" />

      {/* Recent Conversations */}
      <div className="flex-1 px-4">
        <div className="mb-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recents
          </h3>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-1">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="block rounded-lg px-3 py-2 text-sm transition-smooth hover:bg-white/5 group"
              >
                <div className="truncate font-medium text-sidebar-foreground group-hover:text-white">
                  {chat.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {chat.lastMessage}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* User Menu */}
      <div className="p-4">
        <UserMenu />
      </div>
    </div>
  )
}