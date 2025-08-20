'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)

  // Check if user has already completed onboarding
  useEffect(() => {
    if (!isLoaded || !user) return

    const checkOnboarding = async () => {
      try {
        const response = await fetch('/api/user/check-onboarding')
        if (response.ok) {
          const { completed } = await response.json()
          if (completed) {
            router.push('/dashboard')
            return
          }
        }
        
        // Set initial values from Clerk if available
        setFirstName(user?.firstName || '')
        setLastName(user?.lastName || '')
      } catch (error) {
        console.error('Error checking onboarding:', error)
        // Still set the initial values even if check fails
        setFirstName(user?.firstName || '')
        setLastName(user?.lastName || '')
      } finally {
        setIsCheckingOnboarding(false)
      }
    }

    checkOnboarding()
  }, [user, isLoaded, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!firstName.trim() || !lastName.trim()) {
      setError('Both first and last name are required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save your information')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded || isCheckingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50/80 to-blue-100/60 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-blue-700 dark:text-blue-300">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ocean blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50/80 to-blue-100/60 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950"></div>
      
      {/* Floating orbs with ocean theme */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-breathe"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-cyan-300/15 to-blue-400/15 rounded-full blur-3xl animate-breathe" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-bl from-blue-400/20 to-teal-400/20 rounded-full blur-2xl animate-breathe" style={{animationDelay: '6s'}}></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-in-up">
          {/* Glass card */}
          <div className="backdrop-blur-2xl bg-white/15 dark:bg-black/15 border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-black/25 p-10 relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
            
            {/* Header */}
            <div className="relative z-10 flex flex-col items-center mb-10">
              <div className="mb-6 relative">
                {/* Logo with ocean theme */}
                <div className="w-16 h-16 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-cyan-600/90 border border-white/30 shadow-2xl shadow-blue-500/25 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
                  <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-light bg-gradient-to-r from-blue-800 to-cyan-700 dark:from-blue-200 dark:to-cyan-300 bg-clip-text text-transparent tracking-tight text-center">
                Welcome to Agent Builder
              </h1>
              <p className="text-sm text-blue-700/80 dark:text-blue-300/80 mt-2 font-light text-center">
                Let&apos;s get to know you better
              </p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-12 backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/20 rounded-xl text-blue-900 dark:text-white placeholder:text-blue-600/60 dark:placeholder:text-blue-300/60 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ease-out px-4"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-12 backdrop-blur-xl bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/20 rounded-xl text-blue-900 dark:text-white placeholder:text-blue-600/60 dark:placeholder:text-blue-300/60 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ease-out px-4"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Continue to Dashboard'
                )}
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-blue-600/60 dark:text-blue-400/60 font-light">
              Your information is secure and private
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}