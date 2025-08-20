'use client'

import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { SkipToContent } from '@/components/ui/accessible-components'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SkipToContent />
      <div 
        className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden"
        role="main"
        aria-label="Authentication page"
      >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-100px,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(1000px_600px_at_50%_-100px,rgba(139,92,246,0.1),transparent)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <ThemeToggle />
        </motion.div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          className="relative"
        >
          {/* Premium Glass Card */}
          <div 
            id="main-content"
            className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 p-6 sm:p-8 mx-auto overflow-hidden"
            role="region"
            aria-label="Sign in form"
          >
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent dark:from-slate-700/20 dark:to-transparent rounded-2xl sm:rounded-3xl" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex flex-col items-center text-center mb-8"
              >
                <div className="mb-4">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-500 dark:to-blue-500 shadow-xl dark:shadow-purple-500/20 flex items-center justify-center mx-auto relative"
                  >
                    {/* Inner highlight */}
                    <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                    <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                </div>
                <h1 className="text-xl sm:text-[24px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text">
                  Agent Builder
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  Build production‑grade agents, securely.
                </p>
              </motion.div>

              {/* Auth content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="w-full space-y-4"
              >
                {children}
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6">
                  By continuing, you agree to our{' '}
                  <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    Privacy Policy
                  </a>
                  .
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2025 Agent Builder. Crafted with precision.
          </p>
        </motion.div>
      </div>
    </div>
    </>
  )
}