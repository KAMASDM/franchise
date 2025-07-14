// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACYI_uGbDQg9dkVpkLNxmDtzVFeDTOA2Y",
  authDomain: "franchise-2d12e.firebaseapp.com",
  projectId: "franchise-2d12e",
  storageBucket: "franchise-2d12e.firebasestorage.app",
  messagingSenderId: "1003055150601",
  appId: "1:1003055150601:web:ba8251b99b0df8b2032ad8",
  measurementId: "G-YF4STK6DFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };