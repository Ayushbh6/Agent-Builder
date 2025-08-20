'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Skip to main content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={cn(
        'absolute top-4 left-4 z-[9999]',
        'bg-blue-600 text-white px-4 py-2 rounded-lg',
        'text-apple-body font-medium',
        'transform -translate-y-16 opacity-0',
        'focus:translate-y-0 focus:opacity-100',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      )}
    >
      Skip to main content
    </a>
  )
}

// Focus trap for modals and dropdowns
interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
}

export function FocusTrap({ children, active = true }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [active])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}

// Accessible button with proper ARIA attributes
interface AccessibleButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  disabled?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  id?: string
  'aria-label'?: string
  'aria-describedby'?: string
}

export function AccessibleButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className,
  onClick,
  type = 'button',
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: AccessibleButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center gap-2',
        'font-medium rounded-xl transition-apple',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Size variants
        size === 'sm' && 'px-3 py-2 text-apple-caption',
        size === 'md' && 'px-4 py-3 text-apple-body',
        size === 'lg' && 'px-6 py-4 text-apple-body',
        
        // Color variants
        variant === 'primary' && [
          'bg-blue-600 hover:bg-blue-700 text-white',
          'shadow-lg shadow-blue-500/25'
        ],
        variant === 'secondary' && [
          'bg-slate-200 hover:bg-slate-300 text-slate-800',
          'dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200'
        ],
        variant === 'ghost' && [
          'bg-transparent hover:bg-slate-100 text-slate-700',
          'dark:hover:bg-slate-800 dark:text-slate-300'
        ],
        
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onClick={onClick}
      type={type}
      id={id}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
      </span>
    </motion.button>
  )
}

// Screen reader only text
interface ScreenReaderOnlyProps {
  children: React.ReactNode
}

export function ScreenReaderOnly({ children }: ScreenReaderOnlyProps) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Accessible form field wrapper
interface AccessibleFieldProps {
  children: React.ReactNode
  label: string
  error?: string
  hint?: string
  required?: boolean
  id: string
}

export function AccessibleField({
  children,
  label,
  error,
  hint,
  required = false,
  id
}: AccessibleFieldProps) {
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-apple-body font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {hint && (
        <p id={hintId} className="text-apple-caption text-slate-600 dark:text-slate-400">
          {hint}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>, {
          id,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': [errorId, hintId].filter(Boolean).join(' ') || undefined,
          'aria-required': required,
        })}
      </div>
      
      {error && (
        <motion.p
          id={errorId}
          className="text-apple-caption text-red-500 dark:text-red-400"
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: React.RefObject<HTMLElement>[],
  orientation: 'horizontal' | 'vertical' = 'vertical'
) {
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    const isHorizontal = orientation === 'horizontal'
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
    
    switch (e.key) {
      case nextKey:
        e.preventDefault()
        setActiveIndex(prev => prev < items.length - 1 ? prev + 1 : 0)
        break
      case prevKey:
        e.preventDefault()
        setActiveIndex(prev => prev > 0 ? prev - 1 : items.length - 1)
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(items.length - 1)
        break
    }
  }, [items.length, orientation])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  React.useEffect(() => {
    if (activeIndex >= 0 && items[activeIndex]?.current) {
      items[activeIndex].current?.focus()
    }
  }, [activeIndex, items])

  return { activeIndex, setActiveIndex }
}
