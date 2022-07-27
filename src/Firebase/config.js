import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCXo6IyTnQJyVfxrPBDaL0EQihkN7jjyy0",
  authDomain: "chat-app-c6807.firebaseapp.com",
  projectId: "chat-app-c6807",
  storageBucket: "chat-app-c6807.appspot.com",
  messagingSenderId: "307657669270",
  appId: "1:307657669270:web:ed7ccbbe263b69775120b7"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth, db}
export default firebase 