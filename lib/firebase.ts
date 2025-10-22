import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAj0fT8WPta9qR1UFvXcBhbGT1BEUG7Qtw",
  authDomain: "celebrityhub-d2bae.firebaseapp.com",
  projectId: "celebrityhub-d2bae",
  storageBucket: "celebrityhub-d2bae.firebasestorage.app",
  messagingSenderId: "339067873691",
  appId: "1:339067873691:web:4b17580816a8056d06d93e",
  measurementId: "G-WPJ93V7HKQ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
