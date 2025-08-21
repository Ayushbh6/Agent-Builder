'use client'

import { motion } from 'framer-motion'
import { Bot, Zap, Activity, Plus, Settings, Pause } from 'lucide-react'
import { PremiumButton } from '@/components/ui/premium-button'
import { Badge } from '@/components/ui/badge'

interface Agent {
  id: string
  name: string
  type: string
  status: 'active' | 'idle' | 'training' | 'offline'
  tasksCompleted: number
  efficiency: number
}

interface Workflow {
  id: string
  name: string
  status: 'running' | 'paused' | 'completed' | 'error'
  progress: number
  lastRun: string
}

interface AgentHubProps {
  className?: string
}

// Mock data
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Customer Support Pro',
    type: 'Support',
    status: 'active',
    tasksCompleted: 47,
    efficiency: 94
  },
  {
    id: '2',
    name: 'Content Creator',
    type: 'Creative',
    status: 'idle',
    tasksCompleted: 23,
    efficiency: 87
  },
  {
    id: '3',
    name: 'Data Analyst',
    type: 'Analytics',
    status: 'training',
    tasksCompleted: 12,
    efficiency: 76
  }
]

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Email Automation',
    status: 'running',
    progress: 67,
    lastRun: '2 min ago'
  },
  {
    id: '2',
    name: 'Lead Generation',
    status: 'paused',
    progress: 45,
    lastRun: '1 hour ago'
  }
]

export function AgentHub({ className }: AgentHubProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'idle':
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'training':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return <Activity className="w-3 h-3" />
      case 'paused':
        return <Pause className="w-3 h-3" />
      case 'training':
        return <Zap className="w-3 h-3" />
      default:
        return <Bot className="w-3 h-3" />
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-apple-title font-semibold text-white">Agent Hub</h2>
          <PremiumButton size="sm" variant="ghost" className="w-8 h-8 p-0">
            <Plus className="w-4 h-4" />
          </PremiumButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Active Agents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-apple-body font-medium text-white/90">Active Agents</h3>
            <Badge variant="secondary" className="text-xs">
              {mockAgents.filter(a => a.status === 'active').length} running
            </Badge>
          </div>
          
          <div className="space-y-3">
            {mockAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-subtle p-3 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-white/90">
                      {agent.name}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(agent.status)}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(agent.status)}
                      <span>{agent.status}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{agent.type}</span>
                  <span>{agent.tasksCompleted} tasks</span>
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/60">Efficiency</span>
                    <span className="text-white/80">{agent.efficiency}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.efficiency}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Running Workflows Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-apple-body font-medium text-white/90">Workflows</h3>
            <Badge variant="secondary" className="text-xs">
              {mockWorkflows.filter(w => w.status === 'running').length} active
            </Badge>
          </div>
          
          <div className="space-y-3">
            {mockWorkflows.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-subtle p-3 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white/90">
                      {workflow.name}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(workflow.status)}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(workflow.status)}
                      <span>{workflow.status}</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="text-xs text-white/60 mb-2">
                  Last run: {workflow.lastRun}
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/60">Progress</span>
                    <span className="text-white/80">{workflow.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${workflow.progress}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-apple-body font-medium text-white/90 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <PremiumButton 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Agent
            </PremiumButton>
            <PremiumButton 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
            >
              <Zap className="w-4 h-4 mr-2" />
              Build Workflow
            </PremiumButton>
            <PremiumButton 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Settings
            </PremiumButton>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
