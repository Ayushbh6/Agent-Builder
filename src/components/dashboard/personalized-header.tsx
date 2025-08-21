'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme/theme-toggle'

interface UserProfile {
  displayName: string
  firstName?: string
  lastName?: string
  email?: string
}

interface PersonalizedHeaderProps {
  className?: string
}

export function PersonalizedHeader({ className }: PersonalizedHeaderProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  // Get time-based greeting
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const profile = await response.json()
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className={`glass-premium p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-white/5 rounded w-48"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`glass-premium p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Greeting Text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-2xl font-semibold text-white"
            >
              {greeting}, {userProfile?.displayName || 'there'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm text-white/60 mt-1"
            >
              Ready to build something amazing with your AI workforce
            </motion.p>
          </div>
        </div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <ThemeToggle />
        </motion.div>
      </div>
    </motion.div>
  )
}
