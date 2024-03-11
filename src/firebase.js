import { initializeApp } from 'firebase/app';

import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  FacebookAuthProvider,
  browserSessionPersistence,
  setPersistence,
  sendPasswordResetEmail,
  inMemoryPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

let firebase_apikey = import.meta.env.VITE_FIREBASE_API_KEY;
let firebase_authdomain = import.meta.env.VITE_AUTHDOMAIN;
let firebase_projectid = import.meta.env.VITE_PROJECTID;
let firebase_storagebucket = import.meta.env.VITE_STORAGEBUCKET;
let firebase_messagingsenderid = import.meta.env.VITE_MESSAGINGSENDERID;
let firebase_appid = import.meta.env.VITE_APPID;

// Firebase Setup
const firebaseConfig = {
  apiKey: firebase_apikey,
  authDomain: firebase_authdomain,
  projectId: firebase_projectid,
  storageBucket: firebase_storagebucket,
  messagingSenderId: firebase_messagingsenderid,
  appId: firebase_appid,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// This is the logout function.
export const logOut = () => {
  signOut(auth)
    .then(() => {
      // console.log('loggedout');
    })
    .catch((error) => {
      // console.log('error');
    });
};
