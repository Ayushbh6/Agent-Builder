'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { DynamicClerkProvider } from '@/components/auth/dynamic-clerk-provider'

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
      <DynamicClerkProvider>
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
      </DynamicClerkProvider>
    </ThemeProvider>
  )
}