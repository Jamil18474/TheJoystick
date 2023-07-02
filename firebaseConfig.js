// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBsag8WD-XSv2kd51u8keTOipgX4fct_O8",
    authDomain: "the-joystick.firebaseapp.com",
    projectId: "the-joystick",
    storageBucket: "the-joystick.appspot.com",
    messagingSenderId: "749338624051",
    appId: "1:749338624051:web:3dc1979b2d982e9ac8a346",
    measurementId: "G-216WV9DH6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };
