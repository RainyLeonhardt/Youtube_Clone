// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, signInWithPopup, GoogleAuthProvider, User, onAuthStateChanged} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqssCeo1fr1GYUf14NCNJF5XFCmHukXbE",
  authDomain: "jc-yt-d5558.firebaseapp.com",
  projectId: "jc-yt-d5558",
  appId: "1:156447504202:web:b9e9ae610476dcfa7e33b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs the use in with google popup.
 * @returns A promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the use out.
 * @returns A promise that resolves with the user's credentials
 */
export function signOutWithGoogle() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubsribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}