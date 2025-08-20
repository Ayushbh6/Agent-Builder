'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { LogOut, Settings, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserMenu() {
  const { user } = useUser()
  const { signOut } = useClerk()

  if (!user) return null

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.fullName || user.emailAddresses[0]?.emailAddress

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-full justify-start space-x-2 px-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.imageUrl} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1 leading-none">
            <p className="text-sm font-medium truncate max-w-[120px]">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 glass-dark border-white/10" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          className="cursor-pointer text-red-400 focus:text-red-300"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}