import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme/theme';
import { CssBaseline } from '@mui/material';
import { useUserPreferences } from './UserPreferencesContext';

export type ThemeContextValue = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preference, loading, updatePreference } = useUserPreferences();

  // Initialize from user preference or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (preference?.themeInfo?.mode) {
      return preference.themeInfo.mode === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update local state when preference changes (e.g., from server)
  useEffect(() => {
    if (!loading && preference?.themeInfo?.mode) {
      setIsDarkMode(preference.themeInfo.mode === 'dark');
    }
  }, [preference?.themeInfo?.mode, loading]);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Update preference on server
    try {
      await updatePreference({
        themeInfo: { mode: newMode ? 'dark' : 'light' }
      });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
      // Theme is already updated locally, so user sees immediate feedback
      // If server update fails, it will be out of sync until next page load
    }
  };

  const theme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 