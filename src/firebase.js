// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjHfs9_nrHLyuQxMnpAlw1_bWAy3TzXak",
  authDomain: "pnvcapp.firebaseapp.com",
  databaseURL: "https://pnvcapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pnvcapp",
  storageBucket: "pnvcapp.firebasestorage.app",
  messagingSenderId: "414993170178",
  appId: "1:414993170178:web:82877f842405a2a6034c1b",
  measurementId: "G-R7YYNDNX7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getDatabase(app);
export default app;