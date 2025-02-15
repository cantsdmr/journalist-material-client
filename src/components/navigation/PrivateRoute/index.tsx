import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PATHS } from '@/constants/paths';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const auth = useAuth();

  if (!auth) return null;

  return auth.user != null ? <>{children}</> : <Navigate to={PATHS.LOGIN} />;
};

export default PrivateRoute;
