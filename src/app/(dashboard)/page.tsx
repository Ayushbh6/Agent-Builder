'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { WelcomeScreen } from '@/components/chat/welcome-screen'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)

  useEffect(() => {
    if (!isLoaded || !user) return

    const checkOnboarding = async () => {
      try {
        const response = await fetch('/api/user/check-onboarding')
        if (response.ok) {
          const { completed } = await response.json()
          if (!completed) {
            router.push('/onboarding')
            return
          }
        }
      } catch (error) {
        console.error('Error checking onboarding:', error)
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [user, isLoaded, router])

  const handleQuickAction = (action: string) => {
    // TODO: Handle quick actions
    console.log('Quick action:', action)
  }

  if (!isLoaded || isCheckingOnboarding) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-slate-600 dark:text-slate-400">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <WelcomeScreen onQuickAction={handleQuickAction} />
    </div>
  )
}