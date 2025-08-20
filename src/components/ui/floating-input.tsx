'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  showPasswordToggle?: boolean
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type, label, error, showPasswordToggle = false, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      props.onBlur?.(e)
    }

    const isLabelFloating = focused || hasValue || props.value || props.defaultValue

    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type

    return (
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type={inputType}
            className={cn(
              // Base styles
              'peer w-full px-4 pb-2 pt-6 text-apple-body',
              'bg-white/80 dark:bg-slate-800/80',
              'border border-slate-200 dark:border-slate-700',
              'rounded-xl backdrop-blur-sm',
              'transition-apple focus-ring-apple',
              'placeholder-transparent',
              // Focus states
              'focus:border-blue-500 dark:focus:border-blue-400',
              'focus:bg-white dark:focus:bg-slate-800',
              // Error states
              error && 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400',
              className
            )}
            placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            {...props}
          />

          {/* Floating Label */}
          <motion.label
            htmlFor={props.id}
            className={cn(
              'absolute left-4 pointer-events-none text-apple-body',
              'transition-apple origin-left',
              'text-slate-500 dark:text-slate-400',
              focused && 'text-blue-500 dark:text-blue-400',
              error && 'text-red-500 dark:text-red-400'
            )}
            animate={{
              y: isLabelFloating ? -8 : 12,
              scale: isLabelFloating ? 0.85 : 1,
              x: isLabelFloating ? 0 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.8
            }}
          >
            {label}
          </motion.label>

          {/* Password Toggle */}
          {showPasswordToggle && type === 'password' && (
            <motion.button
              type="button"
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'p-2 rounded-lg text-slate-400 hover:text-slate-600',
                'dark:text-slate-500 dark:hover:text-slate-300',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'transition-apple'
              )}
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <AnimatePresence mode="wait">
                {showPassword ? (
                  <motion.div
                    key="eye-off"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EyeOff className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Eye className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 px-1"
            >
              <p className="text-apple-caption text-red-500 dark:text-red-400 flex items-center gap-1">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 30 }}
                  className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"
                />
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

FloatingInput.displayName = 'FloatingInput'

export { FloatingInput }
