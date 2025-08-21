'use client'

import { motion } from 'framer-motion'
import { Brain, Sparkles, Zap } from 'lucide-react'

interface AriaAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  isActive?: boolean
  isThinking?: boolean
  className?: string
}

export function AriaAvatar({ 
  size = 'md', 
  isActive = false, 
  isThinking = false,
  className = '' 
}: AriaAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar Container */}
      <motion.div
        className={`${sizeClasses[size]} rounded-2xl relative overflow-hidden`}
        animate={isActive ? {
          boxShadow: [
            "0 0 20px rgba(147, 51, 234, 0.4)",
            "0 0 30px rgba(59, 130, 246, 0.5)",
            "0 0 20px rgba(147, 51, 234, 0.4)"
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-sm" />
        
        {/* Border */}
        <div className="absolute inset-0 rounded-2xl border border-white/20" />
        
        {/* Neural Network Pattern */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            {/* Neural connections */}
            <g stroke="url(#neural-gradient)" strokeWidth="0.5" fill="none">
              <path d="M20,20 Q50,10 80,20 Q90,50 80,80 Q50,90 20,80 Q10,50 20,20" />
              <path d="M30,30 Q50,25 70,30 Q75,50 70,70 Q50,75 30,70 Q25,50 30,30" />
              <circle cx="20" cy="20" r="2" fill="url(#neural-gradient)" />
              <circle cx="80" cy="20" r="2" fill="url(#neural-gradient)" />
              <circle cx="80" cy="80" r="2" fill="url(#neural-gradient)" />
              <circle cx="20" cy="80" r="2" fill="url(#neural-gradient)" />
              <circle cx="50" cy="50" r="3" fill="url(#neural-gradient)" />
            </g>
          </svg>
        </motion.div>

        {/* Central Brain Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isThinking ? { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0 }}
          >
            <Brain className={`${iconSizes[size]} text-white/90`} />
          </motion.div>
        </div>

        {/* Thinking Particles */}
        {isThinking && (
          <>
            <motion.div
              className="absolute top-1 right-1"
              animate={{
                y: [-2, -6, -2],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            >
              <Sparkles className="w-2 h-2 text-purple-300" />
            </motion.div>
            <motion.div
              className="absolute top-2 left-1"
              animate={{
                y: [-2, -6, -2],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            >
              <Zap className="w-2 h-2 text-blue-300" />
            </motion.div>
            <motion.div
              className="absolute bottom-1 right-2"
              animate={{
                y: [2, -2, 2],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            >
              <Sparkles className="w-2 h-2 text-indigo-300" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Status Indicator */}
      {isActive && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  )
}
