// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBW_OsEoa0vkiVs3qbZsFmDX2Q2NN2Qih8",
    authDomain: "plugin-13a90.firebaseapp.com",
    projectId: "plugin-13a90",
    storageBucket: "plugin-13a90.firebasestorage.app",
    messagingSenderId: "526233722013",
    appId: "1:526233722013:web:6258c58d668f16fb468874"
};

const app = initializeApp(firebaseConfig);  // Initialize Firebase
const auth = getAuth(app);  // Initialize Firebase Authentication

export { auth };
