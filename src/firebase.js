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
  apiKey: "AIzaSyCw8zaRj2pTAYuSmlOS1DRbDD3QuF9RuE0",
  authDomain: "today-12dec-2024.firebaseapp.com",
  databaseURL: "https://today-12dec-2024-default-rtdb.firebaseio.com",
  projectId: "today-12dec-2024",
  storageBucket: "today-12dec-2024.firebasestorage.app",
  messagingSenderId: "530328497707",
  appId: "1:530328497707:web:5d1d2216c7a8b916d5c46e",
  measurementId: "G-MQLTXWXN6T",
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
