// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCF5kG9Xmo1F50Ai5Aw8nyTk5wZmwVrJNA",
  authDomain: "portfolio-cms-5d984.firebaseapp.com",
  projectId: "portfolio-cms-5d984",
  storageBucket: "portfolio-cms-5d984.firebasestorage.app",
  messagingSenderId: "507753815350",
  appId: "1:507753815350:web:24ce40a414cbf8c3f76797"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
