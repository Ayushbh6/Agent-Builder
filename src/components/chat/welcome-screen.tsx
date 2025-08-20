'use client'

import { useUser } from '@clerk/nextjs'
import { Code, FileText, GraduationCap, Heart, Sparkles } from 'lucide-react'

const quickActions = [
  {
    icon: FileText,
    label: 'Write',
    description: 'Create documents, emails, and content',
    clayClass: 'clay-btn-blue',
    bgColor: 'var(--clay-blue)',
  },
  {
    icon: GraduationCap,
    label: 'Learn',
    description: 'Research topics and answer questions',
    clayClass: 'clay-btn-mint',
    bgColor: 'var(--clay-mint)',
  },
  {
    icon: Code,
    label: 'Code',
    description: 'Build applications and solve problems',
    clayClass: 'clay-btn-lavender',
    bgColor: 'var(--clay-lavender)',
  },
  {
    icon: Heart,
    label: 'Life stuff',
    description: 'Personal advice and daily tasks',
    clayClass: 'clay-btn-peach',
    bgColor: 'var(--clay-peach)',
  },
]

interface WelcomeScreenProps {
  onQuickAction?: (action: string) => void
}

export function WelcomeScreen({ onQuickAction }: WelcomeScreenProps) {
  const { user } = useUser()
  
  const firstName = user?.firstName || 'there'
  const timeOfDay = getTimeOfDay()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
      {/* Greeting */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-orange-400 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">{timeOfDay}, {firstName}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          I&apos;m your AI assistant for building intelligent agents. Let&apos;s create something amazing together.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full max-w-4xl">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <div
              key={action.label}
              className="clay-card cursor-pointer group"
              onClick={() => onQuickAction?.(action.label.toLowerCase())}
            >
              <div className="text-center space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: action.bgColor,
                    boxShadow: `
                      4px 4px 12px rgba(163, 177, 198, 0.2),
                      -4px -4px 12px rgba(255, 255, 255, 0.9),
                      inset 2px 2px 6px rgba(255, 255, 255, 0.4),
                      inset -2px -2px 6px rgba(163, 177, 198, 0.1)
                    `
                  }}
                >
                  <Icon className="w-7 h-7 opacity-80" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-gradient transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Suggestions */}
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-medium mb-4 text-center text-muted-foreground">
          Try asking me to:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Create a customer support agent',
            'Build a knowledge base from my docs',
            'Set up an email automation workflow',
            'Design a research assistant agent',
          ].map((suggestion, index) => (
            <button
              key={index}
              className="clay-input text-left p-4 text-sm text-foreground hover:scale-[1.02] transition-transform duration-200"
              onClick={() => onQuickAction?.(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}