import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCV8dzY1DtCevtFDh3wBgIbdYCxUUiuORA",
  authDomain: "gaddiyalipodcast.firebaseapp.com",
  projectId: "gaddiyalipodcast",
  storageBucket: "gaddiyalipodcast.firebasestorage.app",
  messagingSenderId: "871260101672",
  appId: "1:871260101672:web:28a85708555f585c66691d",
  measurementId: "G-X181M905GQ"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
