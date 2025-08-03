/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import moment from "moment";

interface AdminDashboardState {
  totalStudents: number;
  totalInstructors: number;
  pendingLessons: number;
  approvedLessons: number;
  recentPayments: any[];
  recentLessonRequests: any[];
  fetchDashboardData: () => Promise<void>;
  fetchRecentPayments: () => Promise<void>;
  fetchRecentLessonRequests: () => Promise<void>;
  fetchLessonsByDate: (date: Date) => Promise<any[]>;
}

const useAdminDashboard = create<AdminDashboardState>((set) => ({
  totalStudents: 0,
  totalInstructors: 0,
  pendingLessons: 0,
  approvedLessons: 0,
  recentPayments: [],
  recentLessonRequests: [],

  fetchDashboardData: async () => {
    const usersRef = collection(db, "users");
    const requestsRef = collection(db, "lessonRequests");

    const studentQuery = query(usersRef, where("userType", "==", "student"));
    const instructorQuery = query(
      usersRef,
      where("userType", "==", "instructor")
    );
    const pendingQuery = query(requestsRef, where("status", "==", "pending"));
    const approvedQuery = query(requestsRef, where("status", "==", "approved"));

    const [studentSnap, instructorSnap, pendingSnap, approvedSnap] =
      await Promise.all([
        getDocs(studentQuery),
        getDocs(instructorQuery),
        getDocs(pendingQuery),
        getDocs(approvedQuery),
      ]);

    set({
      totalStudents: studentSnap.size,
      totalInstructors: instructorSnap.size,
      pendingLessons: pendingSnap.size,
      approvedLessons: approvedSnap.size,
    });
  },

  fetchRecentPayments: async () => {
    const paymentsRef = collection(db, "payments");
    const snapshot = await getDocs(paymentsRef);

    const data = snapshot.docs
      .map((doc) => {
        const raw = doc.data();
        return {
          id: doc.id,
          ...raw,
          createdAt: raw.createdAt?.toDate?.() || null,
        };
      })
      .sort((a: any, b: any) => {
        const aTime = a.createdAt?.getTime?.() || 0;
        const bTime = b.createdAt?.getTime?.() || 0;
        return bTime - aTime;
      })
      .slice(0, 5);

    set({ recentPayments: data });
  },

  fetchRecentLessonRequests: async () => {
    const requestsRef = collection(db, "lessonRequests");
    const snapshot = await getDocs(requestsRef);

    const data = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item: any) => item.status === "pending")
      .sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      })
      .slice(0, 5);

    set({ recentLessonRequests: data });
  },

  fetchLessonsByDate: async (date: Date) => {
    const targetDate = moment(date).format("YYYY-MM-DD");

    const lessonsRef = collection(db, "lessonRequests");
    const snapshot = await getDocs(lessonsRef);

    const data = snapshot.docs
      .map((doc) => {
        const raw = doc.data();
        return {
          id: doc.id,
          ...raw,
          preferredDates:
            raw.preferredDates?.map((d: string) =>
              moment(d).format("YYYY-MM-DD")
            ) || [],
        };
      })
      .filter((lesson) => lesson.preferredDates.includes(targetDate));

    return data;
  },
}));

export default useAdminDashboard;
