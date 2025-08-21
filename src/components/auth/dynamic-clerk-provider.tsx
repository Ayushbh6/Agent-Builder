'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { dark, shadesOfPurple } from '@clerk/themes'
import React from 'react'

interface DynamicClerkProviderProps {
  children: React.ReactNode
}

export function DynamicClerkProvider({ children }: DynamicClerkProviderProps) {
  const { resolvedTheme } = useTheme()
  const clerkTheme = resolvedTheme === 'dark' ? dark : shadesOfPurple

  return (
    <ClerkProvider
      appearance={{
        baseTheme: clerkTheme,
        variables: {
          colorPrimary: 'hsl(var(--primary))',
          colorBackground: 'hsl(var(--background))',
          colorInputBackground: 'hsl(var(--input))',
          colorInputText: 'hsl(var(--foreground))',
          colorText: 'hsl(var(--foreground))',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-sans)',
        },
        elements: {
          card: { backgroundColor: 'transparent', border: 'none', boxShadow: 'none' },
          socialButtonsBlockButton: {
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            color: 'hsl(var(--foreground))',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: 'var(--elevated-1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'hsl(var(--accent))',
              borderColor: 'hsl(var(--ring))',
              transform: 'translateY(-1px)',
              boxShadow: 'var(--elevated-2)',
            },
            '&:focus': {
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--ring))',
              boxShadow: '0 0 0 2px hsl(var(--ring))',
            },
          },
          formButtonPrimary: {
            backgroundColor: 'hsl(var(--primary))',
            borderRadius: 'var(--radius)',
            color: 'hsl(var(--primary-foreground))',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 16px',
            border: 'none',
            boxShadow: 'var(--elevated-1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'hsl(var(--primary))',
              transform: 'translateY(-1px)',
              boxShadow: 'var(--elevated-2)',
            },
            '&:focus': {
              backgroundColor: 'hsl(var(--primary))',
              boxShadow: '0 0 0 2px hsl(var(--ring))',
            },
          },
          formFieldInput: {
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            color: 'hsl(var(--foreground))',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: 'var(--elevated-1)',
            transition: 'all 0.2s ease',
            '&:focus': {
              borderColor: 'hsl(var(--ring))',
              boxShadow: '0 0 0 2px hsl(var(--ring))',
              backgroundColor: 'hsl(var(--background))',
            },
            '&::placeholder': {
              color: 'hsl(var(--muted-foreground))',
            },
          },
          dividerRow: { alignItems: 'center' },
          dividerText: { color: 'hsl(var(--muted-foreground))', fontSize: '12px' },
          footerAction: { color: 'hsl(var(--primary))', fontWeight: 500 },
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
