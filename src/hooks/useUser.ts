import { useUser as useClerkUser } from '@clerk/nextjs';
import { useUserStore } from '@/stores/user';
import { useEffect } from 'react';

export function useUser() {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const { user, setUser, setLoading } = useUserStore();

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
      
      if (clerkUser) {
        const userData = {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          displayName: clerkUser.firstName || clerkUser.fullName || 'User',
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    }
  }, [clerkUser, isLoaded, setUser, setLoading]);

  return {
    user,
    isLoading: !isLoaded,
    clerkUser,
  };
}