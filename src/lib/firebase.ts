import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const config = {
  ...firebaseConfig,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
};

export const app = initializeApp(config);
export const auth = getAuth(app);

// Initialize Firestore with databaseId from config if present
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

export const googleProvider = new GoogleAuthProvider();
export type { User };
