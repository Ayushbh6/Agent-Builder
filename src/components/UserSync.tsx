"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !user) return;

      try {
        const response = await fetch('/api/user-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            fullName: user.fullName || '',
          }),
        });

        if (response.ok) {
          console.log('User synced successfully');
        }
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    }

    syncUser();
  }, [user, isLoaded]);

  return null; // This component doesn't render anything
}