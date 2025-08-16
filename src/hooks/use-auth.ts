'use client';

import { useUser } from '@stackframe/stack';
import { useStackAuth } from './use-stack-auth';

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
  signIn: () => void;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const user = useUser();
  const { signIn, signOut } = useStackAuth();

  return {
    user: user ? {
      id: user.id,
      name: user.displayName,
      email: user.primaryEmail,
      image: user.profileImageUrl,
    } : null,
    isLoading: false, // Stack handles loading internally
    isAuthenticated: !!user,
    signIn,
    signOut,
  };
}