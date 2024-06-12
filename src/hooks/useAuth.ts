import { useState } from "react";
import { Auth, UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export const useAuth = (firebaseAuth : Auth) => {
    const [user, setUser] = useState<any>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        if (firebaseUser) {
            setUser(firebaseUser as any)
        }
    });

    const signIn = async () => {
        const user = firebaseAuth.currentUser;

        signInWithEmailAndPassword(firebaseAuth, 'userNew@example.com', 'your_password')
        .then((user: UserCredential) => {
            setUser(user as any);
            setIsAuthenticated(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
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

    const signOut = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return { user, isAuthenticated, signIn, signOut };
};