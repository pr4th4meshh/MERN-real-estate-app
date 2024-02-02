// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCneeLg3PPsvjJiYonqGfsXRTXhf7Ns5vg",
  authDomain: "mern-real-estate-fe424.firebaseapp.com",
  projectId: "mern-real-estate-fe424",
  storageBucket: "mern-real-estate-fe424.appspot.com",
  messagingSenderId: "690928942039",
  appId: "1:690928942039:web:0df99276cf8f72f2312992"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);