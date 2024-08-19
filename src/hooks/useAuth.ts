import { useEffect, useState } from "react";
import { Auth, AuthProvider, User, signInWithEmailAndPassword, signInWithPopup, signOut as signOutFromFirebase } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export interface AuthType {
    user: User | null;
    signIn: (email: string, password: string) => void;
    signInWithProvider: (provider: AuthProvider) => void;
    signOut: () => void;
}

export const useAuth = (firebaseAuth : Auth) => {
    const [user, setUser] = useState<User | null>(null)

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
    };

    const signInWithProvider = async (provider: AuthProvider) => {
        await signInWithPopup(firebaseAuth, provider);
    };

    // const signUp = async (data) => {
    //     try {
    //         let authresult = await axios.post('/api/auth/signup', data);
    //         let userObj = { ...authresult.data?.createdUser };
    //         userObj.token = authresult.data?.encodedToken;
    //         setUser(userObj);
    //         toastsuccess("Sign Up Successfull")
    //     } catch (err) {
    //         console.error(err);
    //         toasterror("An Error Occuered")
    //     }
    // };

    const signOut = async () => {
        await signOutFromFirebase(firebaseAuth);
        setUser(null);
    };


    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (firebaseUser) => {
            // implement signup mechanism
            if (firebaseUser) {
                setUser(firebaseUser)
            }
        });
    }, [])
    
    return { user, signIn, signInWithProvider, signOut } ;
};