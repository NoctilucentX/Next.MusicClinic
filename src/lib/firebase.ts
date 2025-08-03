import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWZu1Y_c3MdLHhiUtawnu6yvFmbBz69C8",
  authDomain: "sernan-music.firebaseapp.com",
  projectId: "sernan-music",
  storageBucket: "sernan-music.firebasestorage.app",
  messagingSenderId: "1063108047597",
  appId: "1:1063108047597:web:0fe8da4ee1a7e60f9312e4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
