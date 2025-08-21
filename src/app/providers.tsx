'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { ClerkProvider } from '@clerk/nextjs'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <ClerkProvider>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--popover-foreground))',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
      </ClerkProvider>
    </ThemeProvider>
  )
}