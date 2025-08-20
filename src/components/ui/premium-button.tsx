'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const premiumButtonVariants = cva(
  [
    // Base styles
    'relative inline-flex items-center justify-center gap-2',
    'text-apple-body font-medium',
    'rounded-xl border transition-apple',
    'focus-ring-apple disabled:pointer-events-none',
    'overflow-hidden',
    // Typography
    'tracking-tight leading-none',
    // Disabled state
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        // Primary iOS-style button
        primary: [
          'bg-gradient-to-b from-blue-500 to-blue-600',
          'hover:from-blue-600 hover:to-blue-700',
          'active:from-blue-700 active:to-blue-700',
          'dark:from-blue-400 dark:to-blue-500',
          'dark:hover:from-blue-500 dark:hover:to-blue-600',
          'text-white border-blue-600 dark:border-blue-400',
          'shadow-lg shadow-blue-500/25 dark:shadow-blue-400/20',
          'hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-400/25',
        ],
        // Glass morphism button
        glass: [
          'bg-white/10 backdrop-blur-xl border-white/20',
          'hover:bg-white/20 hover:border-white/30',
          'active:bg-white/30',
          'dark:bg-slate-900/20 dark:border-slate-700/30',
          'dark:hover:bg-slate-900/30 dark:hover:border-slate-600/40',
          'text-slate-900 dark:text-slate-100',
          'shadow-lg shadow-black/5 dark:shadow-black/20',
        ],
        // Soft secondary button
        secondary: [
          'bg-slate-100/80 backdrop-blur-sm border-slate-200',
          'hover:bg-slate-200/80 hover:border-slate-300',
          'active:bg-slate-300/80',
          'dark:bg-slate-800/80 dark:border-slate-700',
          'dark:hover:bg-slate-700/80 dark:hover:border-slate-600',
          'text-slate-700 dark:text-slate-300',
          'shadow-sm shadow-black/5 dark:shadow-black/20',
        ],
        // Destructive button
        destructive: [
          'bg-gradient-to-b from-red-500 to-red-600',
          'hover:from-red-600 hover:to-red-700',
          'active:from-red-700 active:to-red-700',
          'text-white border-red-600',
          'shadow-lg shadow-red-500/25',
          'hover:shadow-xl hover:shadow-red-500/30',
        ],
        // Ghost button
        ghost: [
          'bg-transparent border-transparent',
          'hover:bg-slate-100/50 dark:hover:bg-slate-800/50',
          'active:bg-slate-200/50 dark:active:bg-slate-700/50',
          'text-slate-700 dark:text-slate-300',
        ],
        // Outline button
        outline: [
          'bg-transparent border-slate-200 dark:border-slate-700',
          'hover:bg-slate-50 dark:hover:bg-slate-800/50',
          'active:bg-slate-100 dark:active:bg-slate-800',
          'text-slate-700 dark:text-slate-300',
          'shadow-sm shadow-black/5 dark:shadow-black/20',
        ],
      },
      size: {
        sm: 'h-9 px-3 text-apple-caption',
        default: 'h-11 px-6 text-apple-body',
        lg: 'h-13 px-8 text-apple-body',
        xl: 'h-16 px-10 text-apple-title',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface PremiumButtonProps
  extends VariantProps<typeof premiumButtonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
  disabled?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  id?: string
  'aria-label'?: string
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    onClick,
    type = 'button',
    id,
    'aria-label': ariaLabel,
  }, ref) => {
    const isDisabled = disabled || loading

    const buttonContent = (
      <>
        {/* Background gradient overlay for premium effect */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent rounded-xl" />
        )}
        
        {/* Loading spinner */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}

        {/* Content wrapper */}
        <div className={cn(
          'relative flex items-center gap-2 z-10',
          loading && 'opacity-0'
        )}>
          {leftIcon && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-shrink-0"
            >
              {leftIcon}
            </motion.span>
          )}
          {children}
          {rightIcon && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-shrink-0"
            >
              {rightIcon}
            </motion.span>
          )}
        </div>
      </>
    )

    if (asChild) {
      return (
        <Slot
          className={cn(premiumButtonVariants({ variant, size, className }))}
          ref={ref}
        >
          {children}
        </Slot>
      )
    }

    return (
      <motion.button
        className={cn(premiumButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        onClick={onClick}
        type={type}
        id={id}
        aria-label={ariaLabel}
        whileHover={!isDisabled ? { 
          scale: 1.02,
          y: -1,
        } : undefined}
        whileTap={!isDisabled ? { 
          scale: 0.98,
          y: 0,
        } : undefined}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          mass: 0.8
        }}
      >
        {buttonContent}
      </motion.button>
    )
  }
)

PremiumButton.displayName = 'PremiumButton'

export { PremiumButton, premiumButtonVariants }
