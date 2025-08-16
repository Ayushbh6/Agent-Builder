'use client';

import { useUser, useStackApp } from '@stackframe/stack';
import { useCallback } from 'react';

export interface AuthUser {
  id: string;
  displayName: string | null;
  email: string | null;
  profileImageUrl: string | null;
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

export function useStackAuth(): AuthState & AuthActions {
  const user = useUser();
  const app = useStackApp();

  const handleSignIn = useCallback(() => {
    app.redirectToSignIn();
  }, [app]);

  const handleSignOut = useCallback(async () => {
    await user?.signOut();
  }, [user]);

  return {
    user: user ? {
      id: user.id,
      displayName: user.displayName,
      email: user.primaryEmail,
      profileImageUrl: user.profileImageUrl,
    } : null,
    isLoading: false, // Stack Auth handles loading internally
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}