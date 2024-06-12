import React, { createContext, ReactNode, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { firebaseAuth } from '../util/firebase';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const useAuthContext = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth(firebaseAuth)

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider };
