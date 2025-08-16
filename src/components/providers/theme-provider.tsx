'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'agent-builder-theme',
  attribute = 'class',
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const root = window.document.documentElement;

    // Function to apply theme
    const applyTheme = (theme: 'dark' | 'light') => {
      root.classList.remove('light', 'dark');
      if (attribute === 'class') {
        root.classList.add(theme);
      } else {
        root.setAttribute(attribute, theme);
      }
      setResolvedTheme(theme);
    };

    // Function to get system theme
    const getSystemTheme = (): 'dark' | 'light' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Load theme from localStorage
    const stored = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = stored || defaultTheme;
    setTheme(initialTheme);

    // Apply initial theme
    if (initialTheme === 'system') {
      applyTheme(getSystemTheme());
    } else {
      applyTheme(initialTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, attribute, defaultTheme, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);

      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        if (attribute === 'class') {
          root.classList.add(systemTheme);
        } else {
          root.setAttribute(attribute, systemTheme);
        }
        setResolvedTheme(systemTheme);
      } else {
        if (attribute === 'class') {
          root.classList.add(newTheme);
        } else {
          root.setAttribute(attribute, newTheme);
        }
        setResolvedTheme(newTheme);
      }
    },
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
