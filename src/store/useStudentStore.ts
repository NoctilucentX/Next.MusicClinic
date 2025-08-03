/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { create } from "zustand";

interface StudentStore {
  students: [];
  createStudent: (student: any, user: any) => Promise<void>;
  fetchStudent: (uid: string) => Promise<any>;
  fetchAllStudents: () => Promise<void>;
}

const useStudentStore = create<StudentStore>((set) => ({
  students: [],

  createStudent: async (student, user) => {
    const generatedPassword = "demo123";
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        student.email,
        generatedPassword
      );

      const uid = userCredential.user.uid;

      const userData = {
        uid,
        password: generatedPassword,
        email: userCredential.user.email || "",
        displayName: student.displayName,
        alternateDisplayName: student.displayName.toLowerCase(),
        emailVerified: userCredential.user.emailVerified,
        photoUrl: userCredential.user.photoURL || "",
        refreshToken: userCredential.user.refreshToken,
        userType: student.userType,
        isDeleted: false,
        contactNumber: null,
        dateEnrolled: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "users"), userData);

      console.log("TEST 123: userrrr", user);
      await signInWithEmailAndPassword(auth, user.email, user.password);
    } catch (error) {
      console.error("Error creating student:", error);
    }
  },

  fetchStudent: async (uid) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        return { id: docData.id, ...docData.data() };
      }

      return null;
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  },

  fetchAllStudents: async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("userType", "==", "student")
      );
      const snapshot = await getDocs(q);
      const allStudents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;

      set({ students: allStudents });
    } catch (error) {
      console.error("Error fetching all students:", error);
    }
  },
}));

export default useStudentStore;
