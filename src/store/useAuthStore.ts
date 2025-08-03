/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: undefined,
  isChanged: false,
  initializeAuth: () => {
    onAuthStateChanged(auth, async (u) => {
      if (u?.uid) {
        try {
          const q = query(collection(db, "users"), where("uid", "==", u.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const userData = docSnap.data();
            set({ user: { id: u.uid, ...userData } });
          } else {
            console.warn("No user document found for UID:", u.uid);
            set({ user: null });
          }
        } catch (error) {
          console.error("Failed to fetch user document:", error);
          set({ user: null });
        }
      } else {
        set({ user: null });
      }
    });
  },
  signOut: async () => {
    await signOut(auth);
    set({ user: null });
  },
  setCurrentUser: (value: any) => {
    set({ user: value });
  },
  setChanged: (value: any) => {
    set({ isChanged: value });
  },
}));

export default useAuthStore;
