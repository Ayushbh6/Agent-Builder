'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { AriaAvatar } from './aria-avatar'
import { useConversations } from '@/hooks/use-conversations'
import { useMessages } from '@/hooks/use-messages'
import { useAgents } from '@/hooks/use-agents'
import { useRouter, useSearchParams } from 'next/navigation'

interface DisplayMessage {
  id: string
  content: string
  sender: 'user' | 'aria'
  timestamp: Date
  isThinking?: boolean
}

interface MasterChatProps {
  className?: string
}

export function MasterChat({ className }: MasterChatProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('conversation')
  
  const { createConversation, autoUpdateTitle } = useConversations()
  const { getDefaultAgent } = useAgents()
  const { messages: dbMessages, sendMessage } = useMessages(conversationId || undefined)
  
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Convert database messages to display format
  useEffect(() => {
    const convertedMessages: DisplayMessage[] = dbMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === 'user' ? 'user' : 'aria',
      timestamp: new Date(msg.created_at)
    }))
    
    // If no messages and no conversation, show welcome message
    if (convertedMessages.length === 0 && !currentConversationId) {
      setDisplayMessages([{
        id: 'welcome',
        content: "Hello! I'm ARIA, your Autonomous Reasoning & Intelligence Assistant. I'm here to help you build and manage your AI agent workforce. What would you like to create today?",
        sender: 'aria',
        timestamp: new Date()
      }])
    } else {
      setDisplayMessages(convertedMessages)
    }
  }, [dbMessages, currentConversationId])

  useEffect(() => {
    scrollToBottom()
  }, [displayMessages])

  useEffect(() => {
    setCurrentConversationId(conversationId)
  }, [conversationId])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const messageContent = inputValue
    setInputValue('')
    
    let convId = currentConversationId
    
    // Create new conversation if none exists
    if (!convId) {
      const defaultAgent = getDefaultAgent()
      if (!defaultAgent) {
        console.error('No default agent available')
        return
      }
      
      const newConversation = await createConversation(defaultAgent.id, 'New Conversation')
      if (!newConversation) {
        console.error('Failed to create conversation')
        return
      }
      
      convId = newConversation.id
      setCurrentConversationId(convId)
      
      // Update URL to include conversation ID
      router.push(`/?conversation=${convId}`)
    }
    
    if (!convId) return
    
    // Send user message
    const userMessage = await sendMessage(convId, messageContent, 'user')
    if (!userMessage) return
    
    // Auto-update conversation title if this is the first user message
    if (convId) {
      await autoUpdateTitle(convId, messageContent)
    }
    
    setIsThinking(true)
    
    // Simulate AI response (replace with actual API call later)
    setTimeout(async () => {
      const aiResponse = `I understand you want to "${messageContent}". Let me help you create the perfect agent for this task. I'll need a few more details to optimize the configuration. What specific outcomes are you looking for?`
      
      await sendMessage(convId!, aiResponse, 'assistant')
      setIsThinking(false)
    }, 2000)
  }


  const quickActions = [
    "Create a customer support agent",
    "Build an email automation workflow", 
    "Set up a research assistant",
    "Design a content creation agent"
  ]
  
  const showQuickActions = displayMessages.length <= 1 && displayMessages[0]?.id === 'welcome'

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <div className="glass-subtle p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <AriaAvatar size="md" isActive={true} isThinking={isThinking} />
          <div>
            <h3 className="text-apple-title font-semibold text-white">ARIA</h3>
            <p className="text-apple-caption text-white/60">
              {isThinking ? 'Thinking...' : 'Ready to assist'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {displayMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                  : 'glass-subtle border border-white/10'
              } rounded-2xl p-4`}>
                {message.sender === 'aria' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <AriaAvatar size="sm" />
                    <span className="text-xs text-white/60 font-medium">ARIA</span>
                  </div>
                )}
                <p className="text-apple-body text-white/90 leading-relaxed">
                  {message.content}
                </p>
                <div className="mt-2 text-xs text-white/40">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking Indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass-subtle border border-white/10 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AriaAvatar size="sm" isThinking={true} />
                <span className="text-xs text-white/60 font-medium">ARIA</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-indigo-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <span className="text-sm text-white/60">Analyzing your request...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-white/10"
        >
          <p className="text-sm text-white/60 mb-3">Quick actions to get started:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => setInputValue(action)}
                className="text-left p-3 rounded-xl glass-subtle border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center">
                  <span className="text-sm text-white/80 group-hover:text-white">
                    {action}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              placeholder="Message ARIA..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="w-full min-h-[48px] max-h-[120px] px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 text-white placeholder-white/40 resize-none transition-all text-[15px] overflow-hidden"
              style={{ 
                height: '48px',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = '48px'
                const newHeight = Math.min(target.scrollHeight, 120)
                target.style.height = newHeight + 'px'
                // Enable scrolling only when max height is reached
                if (target.scrollHeight > 120) {
                  target.style.overflowY = 'auto'
                } else {
                  target.style.overflowY = 'hidden'
                }
              }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isThinking}
            className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/15 disabled:bg-white/5 border border-white/10 hover:border-white/20 disabled:border-white/5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white/80" />
          </button>
        </div>
        <p className="text-xs text-white/30 mt-2 ml-1">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
