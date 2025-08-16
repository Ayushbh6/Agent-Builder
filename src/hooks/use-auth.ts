'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback } from 'react';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthActions {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const { data: session, status } = useSession();

  const handleSignIn = useCallback(async () => {
    await signIn('google', { callbackUrl: '/' });
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  }, []);

  return {
    user: session?.user ? {
      id: session.user.id!,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    } : null,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}