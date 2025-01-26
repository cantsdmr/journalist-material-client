import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { firebaseAuth } from '@/utils/firebase';
import { 
  UserCredential, 
  AuthProvider as FirebaseAuthProvider,
  User as FirebaseUser 
} from 'firebase/auth';

interface AuthContextValue {
  // Current user state
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<string>;
  signInWithProvider: (provider: FirebaseAuthProvider) => Promise<string>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signUpWithProvider: (provider: FirebaseAuthProvider) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth(firebaseAuth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth !== undefined) {
      setIsLoading(false);
    }
  }, [auth]);

  const value = auth ? {
    ...auth,
    isAuthenticated: !!auth.user,
    isLoading
  } : null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
