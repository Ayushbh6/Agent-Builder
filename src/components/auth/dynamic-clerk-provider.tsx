'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface DynamicClerkProviderProps {
  children: React.ReactNode
}

export function DynamicClerkProvider({ children }: DynamicClerkProviderProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ClerkProvider
        appearance={{
          variables: {
            colorPrimary: '#6366f1',
            colorBackground: '#ffffff',
            colorInputBackground: '#ffffff',
            colorInputText: '#1f2937',
            colorText: '#1f2937',
            borderRadius: '0.75rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          },
          elements: {
            card: {
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
            },
          },
        }}
      >
        {children}
      </ClerkProvider>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: isDark ? '#9f7aea' : '#6366f1',
          colorBackground: isDark ? '#1a202c' : '#ffffff',
          colorInputBackground: isDark ? '#2d3748' : '#ffffff',
          colorInputText: isDark ? '#e2e8f0' : '#1f2937',
          colorText: isDark ? '#e2e8f0' : '#1f2937',
          borderRadius: '0.75rem',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        },
        elements: {
          card: {
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
          },
          // Social buttons (Google button)
          socialButtonsBlockButton: {
            backgroundColor: isDark ? '#2d3748' : '#ffffff',
            border: isDark ? '1px solid #4a5568' : '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            color: isDark ? '#e2e8f0' : '#374151',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: isDark 
              ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
              : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: isDark ? '#4a5568' : '#f9fafb',
              borderColor: isDark ? '#718096' : '#d1d5db',
              transform: 'translateY(-1px)',
              boxShadow: isDark 
                ? '0 2px 8px 0 rgba(0, 0, 0, 0.4)' 
                : '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
            },
            '&:focus': {
              backgroundColor: isDark ? '#2d3748' : '#ffffff',
              borderColor: isDark ? '#9f7aea' : '#6366f1',
              boxShadow: isDark 
                ? '0 0 0 3px rgba(159, 122, 234, 0.2)' 
                : '0 0 0 3px rgba(99, 102, 241, 0.1)',
            },
          },
          // Primary button (Continue button)
          formButtonPrimary: {
            backgroundColor: `${isDark ? '#9f7aea' : '#6366f1'} !important`,
            borderRadius: '0.75rem',
            color: '#ffffff !important',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 16px',
            border: 'none !important',
            boxShadow: isDark 
              ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
              : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: `${isDark ? '#805ad5' : '#5855eb'} !important`,
              color: '#ffffff !important',
              transform: 'translateY(-1px) !important',
              boxShadow: isDark 
                ? '0 4px 12px 0 rgba(159, 122, 234, 0.3)' 
                : '0 4px 12px 0 rgba(99, 102, 241, 0.3)',
            },
            '&:focus': {
              backgroundColor: `${isDark ? '#9f7aea' : '#6366f1'} !important`,
              color: '#ffffff !important',
              boxShadow: isDark 
                ? '0 0 0 3px rgba(159, 122, 234, 0.2)' 
                : '0 0 0 3px rgba(99, 102, 241, 0.1)',
            },
            '&:active': {
              backgroundColor: `${isDark ? '#6b46c1' : '#4f46e5'} !important`,
              color: '#ffffff !important',
              transform: 'translateY(0px) !important',
            },
          },
          // Input fields
          formFieldInput: {
            backgroundColor: isDark ? '#2d3748' : '#ffffff',
            border: isDark ? '1px solid #4a5568' : '1px solid #d1d5db',
            borderRadius: '0.75rem',
            color: isDark ? '#e2e8f0' : '#1f2937',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: isDark 
              ? '0 1px 2px 0 rgba(0, 0, 0, 0.3)' 
              : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '&:focus': {
              borderColor: isDark ? '#9f7aea' : '#6366f1',
              boxShadow: isDark 
                ? '0 0 0 3px rgba(159, 122, 234, 0.2)' 
                : '0 0 0 3px rgba(99, 102, 241, 0.1)',
              backgroundColor: isDark ? '#2d3748' : '#ffffff',
            },
            '&::placeholder': {
              color: isDark ? '#a0aec0' : '#9ca3af',
            },
          },
          dividerRow: {
            alignItems: 'center',
          },
          dividerText: {
            color: isDark ? '#a0aec0' : '#6b7280',
            fontSize: '12px',
          },
          footerAction: {
            color: isDark ? '#9f7aea' : '#4f46e5',
            fontWeight: 500,
            '&:hover': {
              color: isDark ? '#b794f6' : '#6366f1',
            },
          },
          // Header styling
          headerTitle: {
            color: isDark ? '#e2e8f0' : '#1f2937',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '8px',
          },
          headerSubtitle: {
            color: isDark ? '#a0aec0' : '#6b7280',
            fontSize: '14px',
          },
          // Form field labels
          formFieldLabel: {
            color: isDark ? '#e2e8f0' : '#374151',
            fontSize: '14px',
            fontWeight: '500',
          },
          // Error messages
          formFieldErrorText: {
            color: isDark ? '#fc8181' : '#ef4444',
            fontSize: '12px',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
