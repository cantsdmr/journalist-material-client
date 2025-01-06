import { useEffect, useState } from "react";
import { Auth, AuthProvider, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut as signOutFromFirebase } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export interface AuthType {
    user: User | null;
    signIn: (email: string, password: string) => Promise<string>;
    signInWithProvider: (provider: AuthProvider) => Promise<string>;
    signUp: (email: string, password: string) => Promise<UserCredential>;
    signUpWithProvider: (provider: AuthProvider) => Promise<UserCredential>;
    signOut: () => void;
}

export const useAuth = (firebaseAuth : Auth) => {
    const [user, setUser] = useState<User | null>(null)
    const [registerHandled, setRegisterHandled] = useState<boolean>(false)

    const signIn = async (email: string, password: string) => {
        try {
            // 1. Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            
            // 2. Get ID token
            const idToken = await userCredential.user.getIdToken();

            return idToken;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    };

    const signInWithProvider = async (provider: AuthProvider) => {
        try {
            const userCredential = await signInWithPopup(firebaseAuth, provider);
            
            const idToken = await userCredential.user.getIdToken();

            return idToken;
        } catch (error) {
            console.error('Sign in with provider error:', error);
            throw error;
        }
    };

    const signUpWithProvider = async (provider: AuthProvider) => {
        try {
            const userCredential = await signInWithPopup(firebaseAuth, provider);
            
            return userCredential;
        } catch (error) {
            console.error('Sign in with provider error:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            
            return userCredential;
          } catch (error) {
            console.error('Sign up error:', error);
            throw error;
          }
    };

    const signOut = async () => {
        await signOutFromFirebase(firebaseAuth);
        setUser(null);
    };


    useEffect(() => {
        if (registerHandled) {
            return;
        }

        onAuthStateChanged(firebaseAuth, (firebaseUser) => {
            // implement signup mechanism
            if (firebaseUser) {
                setUser(firebaseUser)
            }
        });
        setRegisterHandled(true);
    }, [registerHandled])
    
    return { user, signUp, signIn, signInWithProvider, signUpWithProvider, signOut } ;
};