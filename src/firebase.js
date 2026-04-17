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
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDwgUjE9izsyFwi4h1PQmegpOuxdTeMjRc',
  authDomain: 'food-project-363d1.firebaseapp.com',
  databaseURL: 'https://food-project-363d1-default-rtdb.firebaseio.com',
  projectId: 'food-project-363d1',
  storageBucket: 'food-project-363d1.firebasestorage.app',
  messagingSenderId: '1091966000382',
  appId: '1:1091966000382:web:159287042b5fc98ab659af',
  measurementId: 'G-XXXXXXXXXX'
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    throw err;
  }
};

const sendVerification = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      console.log("Verification email sent!");
      return true;
    } else {
      console.log("No user is logged in");
      return false;
    }
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export { 
  app, 
  auth, 
  db,
  googleProvider, 
  signInWithGoogle,
  sendVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
};
