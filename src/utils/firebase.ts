import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { getMessaging, Messaging } from "firebase/messaging";
import { firebaseConfig } from "../config/firebase.config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Initialize Firebase Cloud Messaging
let messaging: Messaging | null = null;

// Check if browser supports service workers and messaging
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('[Firebase] FCM initialization failed:', error);
  }
}

export { firebaseAuth, messaging, googleProvider, twitterProvider, facebookProvider, appleProvider };
