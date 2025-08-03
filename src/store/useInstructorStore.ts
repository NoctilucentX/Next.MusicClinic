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

interface InstructorStore {
  instructors: [];
  createInstructor: (instructor: any, user: any) => Promise<void>;
  fetchInstructor: (uid: string) => Promise<any>;
  fetchAllInstructor: () => Promise<void>;
}

const useInstructorStore = create<InstructorStore>((set) => ({
  instructors: [],

  createInstructor: async (instructor, user) => {
    const generatedPassword = "demo123";
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        instructor.email,
        generatedPassword
      );

      const uid = userCredential.user.uid;

      const userData = {
        uid,
        password: generatedPassword,
        email: userCredential.user.email || "",
        displayName: instructor.displayName,
        alternateDisplayName: instructor.displayName.toLowerCase(),
        emailVerified: userCredential.user.emailVerified,
        photoUrl: userCredential.user.photoURL || "",
        refreshToken: userCredential.user.refreshToken,
        userType: instructor.userType,
        isDeleted: false,
        contactNumber: null,
        instruments: instructor.instruments,
        experience: instructor.experience,
        certifications: instructor.certifications,
        students: 0,
        dateEnrolled: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "users"), userData);

      console.log("TEST 123: userrrr", user);
      await signInWithEmailAndPassword(auth, user.email, user.password);
    } catch (error) {
      console.error("Error creating instructor:", error);
    }
  },

  fetchInstructor: async (uid) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        return { id: docData.id, ...docData.data() };
      }

      return null;
    } catch (error) {
      console.error("Error fetching instructor:", error);
      return null;
    }
  },

  fetchAllInstructor: async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("userType", "==", "instructor")
      );
      const snapshot = await getDocs(q);
      const allStudents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any;

      set({ instructors: allStudents });
    } catch (error) {
      console.error("Error fetching all instructors:", error);
    }
  },
}));

export default useInstructorStore;
