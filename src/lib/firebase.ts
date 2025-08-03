import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC81Ew72DXWEwYI9oZf91nk3IzuM2mDNG8",
  authDomain: "smc-mngt-system-1.firebaseapp.com",
  projectId: "smc-mngt-system-1",
  storageBucket: "smc-mngt-system-1.firebasestorage.app",
  messagingSenderId: "1045324121453",
  appId: "1:1045324121453:web:66ed158f2be23f13c4c664",
  measurementId: "G-PYCEHCFLDS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
