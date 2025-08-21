import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model?: string
  tools_used: string[]
  metadata: Record<string, unknown>
  parent_message_id?: string
  tokens_used?: number
  created_at: string
  updated_at: string
}

interface UseMessagesReturn {
  messages: Message[]
  loading: boolean
  error: string | null
  sendMessage: (conversationId: string, content: string, role: 'user' | 'assistant') => Promise<Message | null>
  refetch: (conversationId: string) => Promise<void>
}

export function useMessages(conversationId?: string): UseMessagesReturn {
  const { isLoaded, user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async (convId: string) => {
    if (!isLoaded || !user || !convId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/messages/${convId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (
    convId: string, 
    content: string, 
    role: 'user' | 'assistant' = 'user'
  ): Promise<Message | null> => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: convId,
          role,
          content,
          metadata: {
            timestamp: new Date().toISOString()
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      const newMessage = data.message

      // Add to local state
      setMessages(prev => [...prev, newMessage])
      
      return newMessage
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      console.error('Error sending message:', err)
      return null
    }
  }

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId)
    } else {
      setMessages([])
    }
  }, [conversationId, isLoaded, user])

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages,
  }
}