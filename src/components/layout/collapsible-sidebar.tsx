'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, MessageCircle, Bot, Zap, Loader2, Edit2, Trash2, Check, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { UserMenu } from './user-menu'
import { useConversations } from '@/hooks/use-conversations'

const navigationItems = [
  {
    title: 'Chats',
    href: '/',
    icon: MessageCircle,
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Bot,
  },
  {
    title: 'Workflows',
    href: '/workflows',
    icon: Zap,
  },
]

// Helper function to format relative time
const formatRelativeTime = (date: string) => {
  const now = new Date()
  const messageDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 604800)}w ago`
}

export function CollapsibleSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { conversations, loading, error, renameConversation, deleteConversation } = useConversations()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const handleNewChat = async () => {
    // Navigate to root without conversation ID to trigger new conversation creation
    window.location.href = '/'
  }

  const handleStartEdit = (conversation: typeof conversations[0]) => {
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editingTitle.trim()) return
    
    const success = await renameConversation(editingId, editingTitle.trim())
    if (success) {
      setEditingId(null)
      setEditingTitle('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const handleDelete = async (conversationId: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation(conversationId)
    }
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 60 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex h-full flex-col bg-black/40 backdrop-blur-xl border-r border-white/10 z-40"
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-[100] flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-xl border border-white/20 hover:bg-black/80 transition-all shadow-lg"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-white/60" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-white/60" />
        )}
      </button>

      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-semibold text-white"
            >
              Agent Builder
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-semibold text-white"
            >
              AB
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* New Chat Button */}
      <div className={cn("p-4", isCollapsed && "px-2")}>
        <Button 
          onClick={handleNewChat}
          className={cn(
            "w-full justify-start bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white transition-all",
            isCollapsed && "justify-center px-0"
          )} 
          size="sm"
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">New chat</span>}
        </Button>
      </div>

      {/* Navigation */}
      <div className={cn("px-4 space-y-2", isCollapsed && "px-2")}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center text-sm font-medium group rounded-xl px-3 py-2 transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className={cn(
                'h-4 w-4 transition-all duration-200',
                isActive 
                  ? 'text-white' 
                  : 'text-white/60 group-hover:text-white'
              )} />
              {!isCollapsed && (
                <span className="ml-3">{item.title}</span>
              )}
            </Link>
          )
        })}
      </div>

      <Separator className="my-4 bg-white/10" />

      {/* Recent Conversations - Only show when expanded */}
      {!isCollapsed && (
        <div className="flex-1 px-4 overflow-hidden">
          <div className="mb-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
              Recents
            </h3>
          </div>
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-1">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-white/60" />
                </div>
              ) : error ? (
                <div className="text-xs text-red-400 px-3 py-2">
                  Failed to load conversations
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-xs text-white/40 px-3 py-2">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="group relative"
                    onMouseEnter={() => setHoveredId(conversation.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {editingId === conversation.id ? (
                      // Edit mode
                      <div className="px-3 py-2 bg-white/5 rounded-lg">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit()
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          className="w-full bg-transparent text-sm text-white border-none outline-none focus:ring-0"
                          placeholder="Enter conversation title"
                          autoFocus
                        />
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Check className="h-3 w-3 text-green-400" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <X className="h-3 w-3 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Normal mode
                      <div className="flex items-center">
                        <Link
                          href={`/?conversation=${conversation.id}`}
                          className="flex-1 rounded-lg px-3 py-2 text-sm transition-all hover:bg-white/5"
                        >
                          <div className="truncate font-medium text-white/80 group-hover:text-white">
                            {conversation.title}
                          </div>
                          <div className="text-xs text-white/40">
                            {conversation.last_message_at 
                              ? formatRelativeTime(conversation.last_message_at)
                              : formatRelativeTime(conversation.created_at)
                            }
                          </div>
                        </Link>
                        
                        {/* Action buttons - only show on hover */}
                        {hoveredId === conversation.id && (
                          <div className="flex items-center gap-1 mr-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleStartEdit(conversation)
                              }}
                              className="p-1.5 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Rename conversation"
                            >
                              <Edit2 className="h-3 w-3 text-white/60" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleDelete(conversation.id)
                              }}
                              className="p-1.5 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete conversation"
                            >
                              <Trash2 className="h-3 w-3 text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Spacer for collapsed state */}
      {isCollapsed && <div className="flex-1" />}

      <Separator className="bg-white/10" />

      {/* User Menu */}
      <div className={cn("p-4", isCollapsed && "px-2")}>
        {isCollapsed ? (
          <div className="flex justify-center">
            <UserMenu />
          </div>
        ) : (
          <UserMenu />
        )}
      </div>
    </motion.div>
  )
}