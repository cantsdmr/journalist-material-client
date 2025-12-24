import { useState, useEffect, useRef } from 'react';
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
  isLoading: boolean;
  getToken: (forceRefresh?: boolean) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signInWithProvider: (provider: AuthProvider) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
  onTokenRefresh: (callback: () => void) => () => void;
}

// Firebase tokens expire after 1 hour
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // Refresh 10 minutes before expiry (50 minutes)

export const useFirebaseAuth = (firebaseAuth: Auth): AuthState => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRefreshInterval = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshCallbacks = useRef<Set<() => void>>(new Set());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firebaseAuth]);

  // Set up automatic token refresh
  useEffect(() => {
    // Clear existing interval
    if (tokenRefreshInterval.current) {
      clearInterval(tokenRefreshInterval.current);
      tokenRefreshInterval.current = null;
    }

    if (user) {
      // Immediately refresh token to ensure it's valid
      user.getIdToken(true).catch(err => {
        console.error('Error refreshing token on mount:', err);
      });

      // Set up periodic refresh (every 50 minutes)
      tokenRefreshInterval.current = setInterval(async () => {
        try {
          await user.getIdToken(true); // Force refresh
          console.log('Token refreshed automatically');

          // Notify all subscribers about token refresh
          tokenRefreshCallbacks.current.forEach(callback => {
            try {
              callback();
            } catch (error) {
              console.error('Error in token refresh callback:', error);
            }
          });
        } catch (error) {
          console.error('Error during automatic token refresh:', error);
        }
      }, TOKEN_REFRESH_INTERVAL);
    }

    return () => {
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
        tokenRefreshInterval.current = null;
      }
    };
  }, [user]);

  const getToken = async (forceRefresh = false): Promise<string | null> => {
    if (!user) return null;

    try {
      // Force refresh if requested or if token might be expired
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
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

  const onTokenRefresh = (callback: () => void): (() => void) => {
    tokenRefreshCallbacks.current.add(callback);

    // Return unsubscribe function
    return () => {
      tokenRefreshCallbacks.current.delete(callback);
    };
  };

  return {
    user,
    isAuthenticated: user != null,
    isLoading,
    getToken,
    signIn,
    signInWithProvider,
    signUp,
    signOut,
    onTokenRefresh
  };
};