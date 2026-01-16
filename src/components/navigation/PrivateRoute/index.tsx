import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApiContext } from '@/contexts/ApiContext';
import { useProfile } from '@/contexts/ProfileContext';
import { PATHS } from '@/constants/paths';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const auth = useAuth();
  const { isAuthenticated: apiAuthenticated, isLoading: apiLoading } = useApiContext();
  const { isLoading: profileLoading, isInitialized: profileInitialized, hasServerError, actions } = useProfile();

  // Trigger profile fetch when entering private route if not already initialized
  useEffect(() => {
    if (apiAuthenticated && !profileInitialized && !profileLoading && !hasServerError) {
      actions.refreshProfile();
    }
  }, [apiAuthenticated, profileInitialized, profileLoading, hasServerError, actions]);

  // Sign out if backend server call fails to prevent issues
  useEffect(() => {
    if (hasServerError && auth?.user) {
      auth.signOut();
    }
  }, [hasServerError, auth]);

  // Still initializing Firebase or API
  if (auth.isLoading || apiLoading) {
    return null;
  }

  // Not authenticated with Firebase - redirect to login
  if (!auth.user) {
    return <Navigate to={PATHS.LOGIN} />;
  }

  // Firebase authenticated but API not ready yet
  if (!apiAuthenticated) {
    return null;
  }

  // Profile loading or not yet initialized - show loading
  if (profileLoading || !profileInitialized) {
    return null;
  }

  // Server error occurred - redirect to login (signOut effect will handle cleanup)
  if (hasServerError) {
    return <Navigate to={PATHS.LOGIN} />;
  }

  // All checks passed - render children
  return <>{children}</>;
};

export default PrivateRoute;
