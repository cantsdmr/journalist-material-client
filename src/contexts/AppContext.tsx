import React, { useState, useEffect } from 'react';
import { useApiContext } from './ApiContext';
import { PATHS } from '@/constants/paths';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import { createCtx } from './BaseContext';

export interface AppState {
  isLoading: boolean;
  error: Error | null;
}

export const [AppContext, useApp] = createCtx<AppState>();

// Define public routes that don't need full initialization
const PUBLIC_ROUTES = [
  PATHS.HOME,        // landing page
  PATHS.LOGIN,       // login page
  PATHS.SIGNUP,      // signup page
] as const;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname as typeof PUBLIC_ROUTES[number]);
  const { isLoading: apiLoading } = useApiContext();
  const { user, isLoading: authLoading } = useAuth();
  const { isLoading: userLoading } = useProfile();
  const [state, setState] = useState<AppState>({
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // If it's a public route, we don't need to wait for auth loading
    if (isPublicRoute) {
      setState(prev => ({
        ...prev,
        isLoading: apiLoading,
      }));
    } else {
      // For private routes, we need auth, API, and user info to be ready
      if(!authLoading && !apiLoading && !userLoading){
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    }
  }, [apiLoading, user, authLoading, userLoading, isPublicRoute]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}; 