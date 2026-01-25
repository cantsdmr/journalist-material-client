import React, { useState, useEffect, useCallback } from 'react';
import { useApiContext } from './ApiContext';
import { useAuth } from './AuthContext';
import { createCtx } from './BaseContext';
import { useFCM } from '@/hooks/useFCM';

export interface AppState {
  // Loading state - true until Firebase and API are ready
  isLoading: boolean;
  // Authentication state - true when Firebase user exists and API is authenticated
  isAuthenticated: boolean;
  // Actions
  actions: {
    signOut: () => Promise<void>;
  };
}

export const [AppContext, useApp] = createCtx<AppState>();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const { isLoading: apiLoading, isAuthenticated: apiAuthenticated } = useApiContext();
  const { requestPermission } = useFCM();

  const [state, setState] = useState<Omit<AppState, 'actions'>>({
    isLoading: true,
    isAuthenticated: false,
  });

  // Unified sign out - clears Firebase auth which cascades to clear API and Profile
  const signOut = useCallback(async () => {
    await auth.signOut();
  }, [auth]);

  useEffect(() => {
    const firebaseReady = !auth.isLoading;
    const apiReady = !apiLoading;

    // Still loading if Firebase or API is not ready
    if (!firebaseReady || !apiReady) {
      setState({
        isLoading: true,
        isAuthenticated: false,
      });
      return;
    }

    // Firebase and API are ready
    const isAuthenticated = !!auth.user && apiAuthenticated;
    setState({
      isLoading: false,
      isAuthenticated,
    });

    // Auto-request FCM permission when user is authenticated
    if (isAuthenticated) {
      requestPermission();
    }
  }, [
    auth.isLoading,
    auth.user,
    apiLoading,
    apiAuthenticated,
    requestPermission,
  ]);

  const value: AppState = {
    ...state,
    actions: {
      signOut,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};