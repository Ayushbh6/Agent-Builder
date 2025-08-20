'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Bot, Zap, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    title: 'Chats',
    href: '/dashboard',
    icon: MessageCircle,
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Bot,
  },
  {
    title: 'Workflows',
    href: '/workflows',
    icon: Zap,
  },
  {
    title: 'Knowledge',
    href: '/knowledge',
    icon: FolderOpen,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || 
          (item.href !== '/dashboard' && pathname?.startsWith(item.href))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'clay-nav-item flex items-center space-x-3 text-sm font-medium group',
              isActive
                ? 'active text-purple-700'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className={cn(
              'h-4 w-4 transition-smooth',
              isActive 
                ? 'text-purple-600' 
                : 'group-hover:text-purple-500'
            )} />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </div>
  )
}