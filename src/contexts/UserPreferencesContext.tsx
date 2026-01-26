import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserPreference } from '@/types/index';
import { useApiContext } from './ApiContext';
import { useAuth } from './AuthContext';
import { useApp } from './AppContext';

export interface UserPreferencesContextValue {
  preference: UserPreference | null;
  loading: boolean;
  error: string | null;
  updatePreference: (data: { themeInfo?: { mode: 'light' | 'dark' } }) => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreference] = useState<UserPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { api } = useApiContext();
  const { isAuthenticated } = useApp();
  const { user } = useAuth();

  const fetchPreferences = useCallback(async () => {
    if (!user || !isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.app.account.getUserPreference();
      setPreference(data);
    } catch (err: any) {
      console.error('Error fetching user preferences:', err);
      setError(err.message || 'Failed to load preferences');
      // Set default preference on error
      setPreference({
        id: null,
        userId: user.uid,
        themeInfo: { mode: 'light' },
        createdAt: null,
        updatedAt: null
      });
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, api]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = useCallback(async (data: { themeInfo?: { mode: 'light' | 'dark' } }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      const updated = await api.app.account.updateUserPreference(data);
      setPreference(updated);
    } catch (err: any) {
      console.error('Error updating user preference:', err);
      setError(err.message || 'Failed to update preference');
      throw err;
    }
  }, [user, api]);

  const refreshPreferences = useCallback(async () => {
    await fetchPreferences();
  }, [fetchPreferences]);

  return (
    <UserPreferencesContext.Provider
      value={{
        preference,
        loading,
        error,
        updatePreference,
        refreshPreferences
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
};
