// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAvXschPCLYgl9Ar-oYxbFum-2Fx6Be9io",
    authDomain: "server-less-9070c.firebaseapp.com",
    projectId: "server-less-9070c",
    storageBucket: "server-less-9070c.firebasestorage.app",
    messagingSenderId: "964089953871",
    appId: "1:964089953871:web:e4be0d262fc09b7d22743a",
    measurementId: "G-8E5F5H41WB"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export { auth, provider, db };
