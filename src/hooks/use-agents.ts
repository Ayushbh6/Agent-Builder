import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface Agent {
  id: string
  name: string
  type: 'react' | 'plan_act'
  description?: string
  system_prompt?: string
  tools: string[]
  agent_config: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

interface UseAgentsReturn {
  agents: Agent[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createAgent: (agent: Partial<Agent>) => Promise<Agent | null>
  getDefaultAgent: () => Agent | null
}

export function useAgents(): UseAgentsReturn {
  const { isLoaded, user } = useUser()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = async () => {
    if (!isLoaded || !user) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/agents')
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }

      const data = await response.json()
      setAgents(data.agents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching agents:', err)
    } finally {
      setLoading(false)
    }
  }

  const createAgent = async (agentData: Partial<Agent>): Promise<Agent | null> => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: agentData.name,
          type: agentData.type || 'react',
          description: agentData.description,
          systemPrompt: agentData.system_prompt,
          tools: agentData.tools || [],
          agentConfig: agentData.agent_config || {}
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create agent')
      }

      const data = await response.json()
      const newAgent = data.agent

      // Add to local state
      setAgents(prev => [newAgent, ...prev])
      
      return newAgent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent')
      console.error('Error creating agent:', err)
      return null
    }
  }

  const getDefaultAgent = (): Agent | null => {
    // Find ARIA agent or return the first agent
    const ariaAgent = agents.find(agent => 
      agent.name.toLowerCase().includes('aria') || 
      agent.name.toLowerCase().includes('assistant')
    )
    return ariaAgent || agents[0] || null
  }

  useEffect(() => {
    fetchAgents()
  }, [isLoaded, user]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
    createAgent,
    getDefaultAgent,
  }
}