import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useProfile } from '@/contexts/ProfileContext';
import { PATHS } from '@/constants/paths';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoading: appLoading, isAuthenticated: appAuthenticated, actions: appActions } = useApp();
  const { isLoading: profileLoading, isInitialized: profileInitialized, hasServerError, actions } = useProfile();

  // Trigger profile fetch when entering private route if not already initialized
  useEffect(() => {
    if (appAuthenticated && !profileInitialized && !profileLoading && !hasServerError) {
      actions.refreshProfile();
    }
  }, [appAuthenticated, profileInitialized, profileLoading, hasServerError, actions]);

  // Sign out if backend server call fails to prevent issues
  useEffect(() => {
    if (hasServerError && appAuthenticated) {
      appActions.signOut();
    }
  }, [hasServerError, appAuthenticated, appActions]);

  // Still initializing (Firebase and API)
  if (appLoading) {
    return null;
  }

  // Profile loading or not yet initialized - show loading
  if (profileLoading || !profileInitialized) {
    return null;
  }

    // Not authenticated - redirect to login
  if (!appAuthenticated) {
    return <Navigate to={PATHS.LOGIN} />;
  }

  // Server error occurred - redirect to login (signOut effect will handle cleanup)
  if (hasServerError) {
    return <Navigate to={PATHS.LOGIN} />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default PrivateRoute;
