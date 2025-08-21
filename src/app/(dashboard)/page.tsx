'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PersonalizedHeader } from '@/components/dashboard/personalized-header'
import { MasterChat } from '@/components/dashboard/master-chat'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

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

  if (!isLoaded || isCheckingOnboarding) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner variant="apple" size="lg" />
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full flex flex-col"
    >
      {/* Personalized Header */}
      <PersonalizedHeader className="flex-shrink-0" />
      
      {/* Main Content - Clean Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Master Chat - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 flex flex-col min-w-0"
        >
          <MasterChat className="h-full" />
        </motion.div>
      </div>
    </motion.div>
  )
}