"use client";

import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserProfile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(() => router.push('/'));
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.firstName || user.fullName || "User";
  const email = user.primaryEmailAddress?.emailAddress;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "bg-gray-900 border border-gray-700",
              userButtonPopoverActions: "text-white",
              userButtonPopoverActionButton: "text-white hover:bg-gray-800",
              userButtonPopoverActionButtonText: "text-white",
              userButtonPopoverFooter: "hidden",
            }
          }}
        />
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{displayName}</p>
          {email && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{email}</p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}