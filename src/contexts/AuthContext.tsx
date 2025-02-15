import React from 'react';
import { useFirebaseAuth, AuthState } from '@/hooks/useFirebaseAuth';
import { firebaseAuth } from '@/utils/firebase';
import { createCtx } from './BaseContext';

const [AuthContext, useAuth] = createCtx<AuthState>();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuth(firebaseAuth);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth };
