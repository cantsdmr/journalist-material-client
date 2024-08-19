import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthType, useAuth } from '../hooks/useAuth';
import { firebaseAuth } from '../util/firebase';

const AuthContext = createContext<AuthType | undefined>(undefined);
const useAuthContext = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth(firebaseAuth)
  const [value, setValue] = useState<AuthType | undefined>(undefined);

  useEffect(() => {
    if (auth?.user) {
      setValue(auth)
    }
  
  }, [auth?.user])
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider };
