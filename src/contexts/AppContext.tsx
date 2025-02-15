import React, { useState, useEffect } from 'react';
import { useApiContext } from './ApiContext';
// import { PATHS } from '@/constants/paths';
// import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { createCtx } from './BaseContext';

export interface AppState {
  isLoading: boolean;
  error: Error | null;
}

export const [AppContext, useApp] = createCtx<AppState>();

// Define public routes that don't need full initialization
// const PUBLIC_ROUTES = [
//   PATHS.HOME,        // landing page
//   PATHS.LOGIN,       // login page
//   PATHS.SIGNUP,      // signup page
//   // add other public routes as needed
// ];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const location = useLocation();
  // const isPublicRoute = (PUBLIC_ROUTES as string[]).includes(location.pathname);
  const { isLoading: apiLoading } = useApiContext();
  const { user, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<AppState>({
    isLoading: true,
    error: null
  });

  useEffect(() => {
    setState(prev => ({
      ...prev,
      isLoading: authLoading || apiLoading,
    }));
  }, [apiLoading, user, authLoading]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}; 