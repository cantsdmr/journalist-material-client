import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { useApiContext } from './ApiContext';
import { useUserInfoContext } from './UserContext';

import { ApiContextValue } from './ApiContext';
import { UserContextValue } from './UserContext';

export interface AppState {
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  initialized: {
    api: boolean;
    user: boolean;
  };
}

export interface AppContextValue extends AppState {
  api: ApiContextValue | null;
  user: UserContextValue | null;
  error: Error | null;
  setAppState: (state: Partial<AppState>) => void;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: Error | null) => void;
  reset: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialState: AppState = {
  isReady: false,
  isLoading: false,
  error: null,
  initialized: {
    api: false,
    user: false
  }
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  const api = useApiContext();
  const user = useUserInfoContext();

  // Monitor dependencies initialization
  useEffect(() => {
    setState(prev => ({
      ...prev,
      initialized: {
        api: !!api?.isAuthenticated,
        user: !!user?.userInfo
      },
      isReady: !!api?.isAuthenticated && !!user?.userInfo
    }));
  }, [api?.isAuthenticated, user?.userInfo]);

  const setAppState = useCallback((newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const startLoading = useCallback(() => {
    setAppState({ isLoading: true, error: null });
  }, [setAppState]);

  const stopLoading = useCallback(() => {
    setAppState({ isLoading: false });
  }, [setAppState]);

  const setError = useCallback((error: Error | null) => {
    setAppState({ error, isLoading: false });
  }, [setAppState]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value = {
    ...state,
    api,
    user,
    setAppState,
    startLoading,
    stopLoading,
    setError,
    reset
  };

  return (
    <AppContext.Provider value={value as AppContextValue}>
      {children}
    </AppContext.Provider>
  );
}; 