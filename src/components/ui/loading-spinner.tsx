'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'default' | 'dots' | 'pulse' | 'apple'
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  variant = 'apple'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center gap-1', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'rounded-full bg-blue-500 dark:bg-blue-400',
              size === 'sm' ? 'w-1.5 h-1.5' : 
              size === 'md' ? 'w-2 h-2' :
              size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3'
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn(
          'rounded-full bg-blue-500 dark:bg-blue-400',
          sizeClasses[size],
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  }

  // Apple-style spinner (default)
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          background: `conic-gradient(from 0deg, transparent, transparent, transparent, rgb(59 130 246 / 0.8))`,
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner glow effect */}
      <motion.div
        className="absolute inset-1 rounded-full bg-blue-500/20"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rectangle' | 'button'
  lines?: number
}

export function LoadingSkeleton({ 
  className, 
  variant = 'text',
  lines = 1 
}: LoadingSkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-slate-200/60 via-slate-300/60 to-slate-200/60 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-800/60 rounded-lg"
  
  const shimmerAnimation = {
    backgroundPosition: ['-200% 0', '200% 0'],
  }

  const shimmerTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "linear" as const
  }

  if (variant === 'circle') {
    return (
      <motion.div
        className={cn(
          baseClasses,
          'rounded-full w-12 h-12',
          className
        )}
        animate={shimmerAnimation}
        transition={shimmerTransition}
        style={{
          backgroundSize: '400% 100%',
        }}
      />
    )
  }

  if (variant === 'button') {
    return (
      <motion.div
        className={cn(
          baseClasses,
          'h-11 w-24 rounded-xl',
          className
        )}
        animate={shimmerAnimation}
        transition={shimmerTransition}
        style={{
          backgroundSize: '400% 100%',
        }}
      />
    )
  }

  if (variant === 'rectangle') {
    return (
      <motion.div
        className={cn(
          baseClasses,
          'h-4 w-full',
          className
        )}
        animate={shimmerAnimation}
        transition={shimmerTransition}
        style={{
          backgroundSize: '400% 100%',
        }}
      />
    )
  }

  // Text variant (default)
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            baseClasses,
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full',
            className
          )}
          animate={shimmerAnimation}
          transition={{
            ...shimmerTransition,
            delay: i * 0.1
          }}
          style={{
            backgroundSize: '400% 100%',
          }}
        />
      ))}
    </div>
  )
}

interface LoadingStateProps {
  loading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LoadingState({ 
  loading, 
  children, 
  fallback,
  className 
}: LoadingStateProps) {
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        {fallback || <LoadingSpinner size="lg" />}
      </div>
    )
  }

  return <>{children}</>
}
