'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="glass-subtle">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            size="icon" 
            className="glass-premium hover:glass-intense transition-apple relative overflow-hidden"
          >
            {/* Background shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear"
              }}
            />
            
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    duration: 0.3 
                  }}
                  className="relative z-10"
                >
                  <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-300" />
                </motion.div>
              ) : theme === 'light' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    duration: 0.3 
                  }}
                  className="relative z-10"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="monitor"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    duration: 0.3 
                  }}
                  className="relative z-10"
                >
                  <Monitor className="h-[1.2rem] w-[1.2rem] text-slate-600 dark:text-slate-400" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="glass-premium border-white/20 dark:border-slate-700/30 min-w-[140px]"
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuItem 
            onClick={() => setTheme('light')}
            className="flex items-center gap-3 px-3 py-2 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-apple cursor-pointer"
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span className="text-apple-body">Light</span>
            {theme === 'light' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setTheme('dark')}
            className="flex items-center gap-3 px-3 py-2 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-apple cursor-pointer"
          >
            <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <span className="text-apple-body">Dark</span>
            {theme === 'dark' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setTheme('system')}
            className="flex items-center gap-3 px-3 py-2 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-apple cursor-pointer"
          >
            <Monitor className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-apple-body">System</span>
            {theme === 'system' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}