// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQezEJMtOp3KP39C3rOUjav3V8hhdY0mA",
  authDomain: "ignisguardian.firebaseapp.com",
  projectId: "ignisguardian",
  storageBucket: "ignisguardian.firebasestorage.app",
  messagingSenderId: "961945869832",
  appId: "1:961945869832:web:f9a933ecb92967fc08bbbd",
  measurementId: "G-Q30LDJ8T3W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
