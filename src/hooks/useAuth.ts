import { useState, useEffect } from 'react';
import { 
  Auth, 
  AuthProvider, 
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as signOutFromFirebase,
  onAuthStateChanged
} from 'firebase/auth';

interface UseAuthReturn {
  user: FirebaseUser | null;
  signIn: (email: string, password: string) => Promise<string>;
  signInWithProvider: (provider: AuthProvider) => Promise<string>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signUpWithProvider: (provider: AuthProvider) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

export const useAuth = (firebaseAuth: Auth): UseAuthReturn | undefined => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [firebaseAuth]);

  const signIn = async (email: string, password: string): Promise<string> => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return await userCredential.user.getIdToken();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithProvider = async (provider: AuthProvider): Promise<string> => {
    try {
      const userCredential = await signInWithPopup(firebaseAuth, provider);
      return await userCredential.user.getIdToken();
    } catch (error) {
      console.error('Sign in with provider error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<UserCredential> => {
    try {
      return await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signUpWithProvider = async (provider: AuthProvider): Promise<UserCredential> => {
    try {
      return await signInWithPopup(firebaseAuth, provider);
    } catch (error) {
      console.error('Sign up with provider error:', error);
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

  // Don't return anything until auth is initialized
  if (!isInitialized) {
    return undefined;
  }

  return {
    user,
    signIn,
    signInWithProvider,
    signUp,
    signUpWithProvider,
    signOut
  };
};