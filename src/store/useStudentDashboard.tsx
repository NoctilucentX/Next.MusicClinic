/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import moment from "moment-timezone";

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
  createdAt: any;
  id: string;
  status: string;
  instructorName?: string;
  instructorInstrument?: string;
}

interface LessonRequestStore {
  pendingRequests: LessonRequestWithId[];
  declinedRequests: LessonRequestWithId[];
  approvedRequests: LessonRequestWithId[];
  getPendingLessonRequests: (id: string) => Promise<void>;
  getDeclineLessonRequests: (id: string) => Promise<void>;
  getApprovedLessonRequests: (id: string) => Promise<void>;
  getApprovedLessonsCountThisMonth: () => number;
  getUpcomingLessonsThisWeek: () => LessonRequestWithId[];
}

const useStudentDashboard = create<LessonRequestStore>((set, get) => ({
  pendingRequests: [],
  declinedRequests: [],
  approvedRequests: [],

  getPendingLessonRequests: async (id) => {
    const q = query(
      collection(db, "lessonRequests"),
      where("status", "==", "pending"),
      where("studentId", "==", id)
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

  getDeclineLessonRequests: async (id) => {
    const q = query(
      collection(db, "lessonRequests"),
      where("status", "==", "declined"),
      where("studentId", "==", id)
    );
    const snapshot = await getDocs(q);

    const declined = await Promise.all(
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

    set({ declinedRequests: declined });
  },

  getApprovedLessonRequests: async (id) => {
    const q = query(
      collection(db, "lessonRequests"),
      where("status", "==", "approved"),
      where("studentId", "==", id)
    );
    const snapshot = await getDocs(q);

    const approved = await Promise.all(
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

    set({ approvedRequests: approved });
  },

  getApprovedLessonsCountThisMonth: () => {
    const { approvedRequests } = get();
    const now = moment();

    return approvedRequests.filter((lesson) => {
      const createdAt = lesson.createdAt?.seconds
        ? moment.unix(lesson.createdAt.seconds)
        : null;

      return createdAt && createdAt.isSame(now, "month");
    }).length;
  },

  getUpcomingLessonsThisWeek: () => {
    const { approvedRequests } = get();

    // Manila week range
    const weekStart = moment.tz("Asia/Manila").startOf("isoWeek");
    const weekEnd = moment.tz("Asia/Manila").endOf("isoWeek");

    return approvedRequests.filter((lesson) => {
      return lesson.preferredDates.some((dateStr) => {
        // Parse UTC date and convert to Manila time
        const localDate = moment.utc(dateStr).tz("Asia/Manila");
        return localDate.isBetween(weekStart, weekEnd, undefined, "[]"); // inclusive
      });
    });
  },
}));

export default useStudentDashboard;
