import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface Conversation {
  id: string
  title: string
  agent_id: string
  last_message_at: string | null
  created_at: string
  updated_at: string
  is_user_renamed: boolean
  agent_name: string | null
  agent_type: string | null
}

interface UseConversationsReturn {
  conversations: Conversation[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createConversation: (agentId: string, title?: string) => Promise<Conversation | null>
  deleteConversation: (id: string) => Promise<boolean>
  renameConversation: (id: string, newTitle: string) => Promise<boolean>
  autoUpdateTitle: (id: string, userMessage: string) => Promise<boolean>
}

export function useConversations(): UseConversationsReturn {
  const { isLoaded, user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = async () => {
    if (!isLoaded || !user) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/conversations')
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async (agentId: string, title?: string): Promise<Conversation | null> => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          title: title || 'New Conversation'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create conversation')
      }

      const data = await response.json()
      const newConversation = data.conversation

      // Add to local state
      setConversations(prev => [newConversation, ...prev])
      
      return newConversation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation')
      console.error('Error creating conversation:', err)
      return null
    }
  }

  const deleteConversation = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete conversation')
      }

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== id))
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete conversation')
      console.error('Error deleting conversation:', err)
      return false
    }
  }

  const renameConversation = async (id: string, newTitle: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      })

      if (!response.ok) {
        throw new Error('Failed to rename conversation')
      }

      const data = await response.json()
      const updatedConversation = data.conversation

      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === id ? { ...conv, ...updatedConversation } : conv
        )
      )
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename conversation')
      console.error('Error renaming conversation:', err)
      return false
    }
  }

  const autoUpdateTitle = async (id: string, userMessage: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/conversations/${id}/auto-title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
      })

      if (!response.ok) {
        throw new Error('Failed to auto-update title')
      }

      const data = await response.json()
      
      if (data.updated) {
        const updatedConversation = data.conversation
        
        // Update local state
        setConversations(prev => 
          prev.map(conv => 
            conv.id === id ? { ...conv, ...updatedConversation } : conv
          )
        )
      }
      
      return data.updated
    } catch (err) {
      console.error('Error auto-updating title:', err)
      return false
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [isLoaded, user]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
    createConversation,
    deleteConversation,
    renameConversation,
    autoUpdateTitle,
  }
}