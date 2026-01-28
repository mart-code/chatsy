
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1v_FkNjhRWSnjDyzrUUaZzF8HNZ0oixs",
  authDomain: "chatsy-c412a.firebaseapp.com",
  projectId: "chatsy-c412a",
  storageBucket: "chatsy-c412a.firebasestorage.app",
  messagingSenderId: "136127891928",
  appId: "1:136127891928:web:58d2c6ca126dc517828aad",
  measurementId: "G-2H13WPXMM9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app, analytics, auth};

