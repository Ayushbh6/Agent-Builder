'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';

interface AppHeaderProps {
  children?: React.ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="fixed top-0 right-0 z-50 flex items-center justify-end p-4">
      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
