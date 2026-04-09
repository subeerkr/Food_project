import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCw8zaRj2pTAYuSmlOS1DRbDD3QuF9RuE0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "today-12dec-2024.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://today-12dec-2024-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "today-12dec-2024",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "today-12dec-2024.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "530328497707",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:530328497707:web:5d1d2216c7a8b916d5c46e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MQLTXWXN6T",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    throw err;
  }
};

export { 
  app, 
  auth, 
  googleProvider, 
  signInWithGoogle,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
};
