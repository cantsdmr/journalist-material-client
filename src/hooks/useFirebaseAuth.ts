import { useState, useEffect } from 'react';
import { 
  Auth, 
  AuthProvider, 
  User as FirebaseUser,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as signOutFromFirebase,
  onAuthStateChanged
} from 'firebase/auth';

export interface AuthState {
  user: FirebaseUser | null;
  isAuthenticated: boolean;
  getToken: () => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signInWithProvider: (provider: AuthProvider) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
}

export const useFirebaseAuth = (firebaseAuth: Auth): AuthState => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, [firebaseAuth]);

  const getToken = async (): Promise<string | null> => {
    return user ? user.getIdToken() : null;
  };

  const signIn = async (email: string, password: string): Promise<string | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return await userCredential.user.getIdToken();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithProvider = async (provider: AuthProvider): Promise<string | null> => {
    try {
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      return await userCredential.user.getIdToken();
    } catch (error) {
      console.error('Sign in with provider error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<FirebaseUser | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutFromFirebase(firebaseAuth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    getToken,
    signIn,
    signInWithProvider,
    signUp,
    signOut
  };
};