import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { firebaseConfig } from "../config/firebase.config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { firebaseAuth, googleProvider, twitterProvider, facebookProvider, appleProvider };
