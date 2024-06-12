import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const auth = useAuthContext();

  if (!auth) return null;

  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
