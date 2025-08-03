import { create } from "zustand";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LessonRequestData {
  studentId: string;
  studentName: string;
  studentEmail: string;
  instrument: string;
  level: string;
  duration: number;
  instructorId?: string;
  preferredDates: string[];
  preferredTimes: string[];
  additionalNotes?: string;
}

interface LessonRequestWithId extends LessonRequestData {
  id: string;
  status: string;
  room?: string;
  instructorName?: string;
  instructorInstrument?: string;
}

interface LessonRequestStore {
  pendingRequests: LessonRequestWithId[];
  addLessonRequest: (data: LessonRequestData) => Promise<void>;
  getPendingLessonRequests: () => Promise<void>;
  updateStatus: (
    id: string,
    status: LessonRequestWithId["status"]
  ) => Promise<void>;
  updateRoom: (id: string, room: LessonRequestWithId["room"]) => Promise<void>;
}

const useLessonRequestStore = create<LessonRequestStore>((set, get) => ({
  pendingRequests: [],

  addLessonRequest: async (data) => {
    await addDoc(collection(db, "lessonRequests"), {
      ...data,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },

  getPendingLessonRequests: async () => {
    const q = query(
      collection(db, "lessonRequests"),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(q);

    const pending = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const instructorId = data.instructorId;
        let instructorName = "";
        let instructorInstrument = "";

        if (instructorId) {
          const instructorQuery = query(
            collection(db, "users"),
            where("uid", "==", instructorId)
          );
          const instructorSnap = await getDocs(instructorQuery);

          if (!instructorSnap.empty) {
            const instructorData = instructorSnap.docs[0].data();
            instructorName = instructorData.displayName || "";
            instructorInstrument = instructorData.instruments || "";
          }
        }

        return {
          id: docSnap.id,
          ...data,
          instructorName,
          instructorInstrument,
        } as LessonRequestWithId;
      })
    );

    set({ pendingRequests: pending });
  },

  updateStatus: async (id, status) => {
    // Update Firestore
    await updateDoc(doc(db, "lessonRequests", id), {
      status,
      updatedAt: new Date(),
    });

    // Update Zustand state
    const { pendingRequests } = get();
    const updatedRequests = pendingRequests.map((req) =>
      req.id === id ? { ...req, status } : req
    );
    set({ pendingRequests: updatedRequests });
  },

  updateRoom: async (id, room) => {
    // Update Firestore
    await updateDoc(doc(db, "lessonRequests", id), {
      room,
      updatedAt: new Date(),
    });

    // Update Zustand state
    const { pendingRequests } = get();
    const updatedRequests = pendingRequests.map((req) =>
      req.id === id ? { ...req, room } : req
    );
    set({ pendingRequests: updatedRequests });
  },
}));

export default useLessonRequestStore;
