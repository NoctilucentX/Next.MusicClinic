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
  approvedRequests: LessonRequestWithId[];
  getApprovedLessonRequests: (id: string) => Promise<void>;
  getTodaysLessons: () => LessonRequestWithId[];
  getTotalStudents: () => number;
  getThisWeekLessonsCount: () => number;
  getTotalTeachingHoursThisWeek: () => string;
  getWeeklyOverview: () => Record<string, number>;
  getAllLessonsSorted: () => LessonRequestWithId[];
  getTodaysLessonsSorted: () => LessonRequestWithId[];
  getUpcomingLessonsSorted: () => LessonRequestWithId[];
}

const useInstructorDashboard = create<LessonRequestStore>((set, get) => ({
  approvedRequests: [],

  getApprovedLessonRequests: async (id) => {
    const q = query(
      collection(db, "lessonRequests"),
      where("status", "==", "approved"),
      where("instructorId", "==", id)
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

  getTodaysLessons: () => {
    const { approvedRequests } = get();
    const today = moment.tz("Asia/Manila").startOf("day");

    return approvedRequests.filter((lesson) =>
      lesson.preferredDates.some((dateStr) => {
        const localDate = moment.utc(dateStr).tz("Asia/Manila").startOf("day");
        return localDate.isSame(today, "day");
      })
    );
  },

  getTotalStudents: () => {
    const { approvedRequests } = get();

    const uniqueStudents = new Set(
      approvedRequests.map((lesson) => lesson.studentId)
    );

    return uniqueStudents.size;
  },

  getThisWeekLessonsCount: () => {
    const { approvedRequests } = get();
    const weekStart = moment.tz("Asia/Manila").startOf("isoWeek");
    const weekEnd = moment.tz("Asia/Manila").endOf("isoWeek");

    return approvedRequests.filter((lesson) =>
      lesson.preferredDates.some((dateStr) => {
        const localDate = moment.utc(dateStr).tz("Asia/Manila");
        return localDate.isBetween(weekStart, weekEnd, undefined, "[]");
      })
    ).length;
  },

  getTotalTeachingHoursThisWeek: () => {
    const { approvedRequests } = get();
    const weekStart = moment.tz("Asia/Manila").startOf("isoWeek");
    const weekEnd = moment.tz("Asia/Manila").endOf("isoWeek");

    const thisWeekLessons = approvedRequests.filter((lesson) =>
      lesson.preferredDates.some((dateStr) => {
        const localDate = moment.utc(dateStr).tz("Asia/Manila");
        return localDate.isBetween(weekStart, weekEnd, undefined, "[]");
      })
    );

    const totalMinutes = thisWeekLessons.reduce(
      (sum, lesson) => sum + (lesson.duration || 0),
      0
    );

    return (totalMinutes / 60).toFixed(2); // returns as string
  },

  getWeeklyOverview: () => {
    const { approvedRequests } = get();
    const weekStart = moment.tz("Asia/Manila").startOf("isoWeek"); // Monday
    const weekEnd = moment.tz("Asia/Manila").endOf("isoWeek"); // Sunday

    const overview: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    approvedRequests.forEach((lesson) => {
      lesson.preferredDates.forEach((dateStr) => {
        const localDate = moment.utc(dateStr).tz("Asia/Manila");

        if (localDate.isBetween(weekStart, weekEnd, undefined, "[]")) {
          const day = localDate.format("dddd");
          if (overview[day] !== undefined) {
            overview[day] += 1;
          }
        }
      });
    });

    return overview;
  },

  getAllLessonsSorted: () => {
    const { approvedRequests } = get();

    return [...approvedRequests].sort((a, b) => {
      const aDate = moment.utc(a.preferredDates[0] + " " + a.preferredTimes[0]);
      const bDate = moment.utc(b.preferredDates[0] + " " + b.preferredTimes[0]);
      return bDate.diff(aDate); // latest to oldest
    });
  },

  getTodaysLessonsSorted: () => {
    const { approvedRequests } = get();
    const today = moment.tz("Asia/Manila").format("YYYY-MM-DD");

    const filtered = approvedRequests.filter((lesson) =>
      lesson.preferredDates.some(
        (dateStr) =>
          moment(dateStr).tz("Asia/Manila").format("YYYY-MM-DD") === today
      )
    );

    return [...filtered].sort((a, b) => {
      const aTime = moment.utc(today + " " + a.preferredTimes[0]);
      const bTime = moment.utc(today + " " + b.preferredTimes[0]);
      return bTime.diff(aTime);
    });
  },

  getUpcomingLessonsSorted: () => {
    const { approvedRequests } = get();
    const now = moment.tz("Asia/Manila");

    const upcoming = approvedRequests.filter((lesson) =>
      lesson.preferredDates.some((dateStr) =>
        lesson.preferredTimes.some((timeStr) => {
          const lessonDateTime = moment
            .utc(dateStr)
            .tz("Asia/Manila")
            .set({
              hour: moment(timeStr, ["h:mm A"]).hour(),
              minute: moment(timeStr, ["h:mm A"]).minute(),
            });

          return lessonDateTime.isAfter(now);
        })
      )
    );

    // Sort by soonest valid lesson datetime
    return [...upcoming].sort((a, b) => {
      const aDateTime = getSoonestDateTime(a.preferredDates, a.preferredTimes);
      const bDateTime = getSoonestDateTime(b.preferredDates, b.preferredTimes);
      return aDateTime.diff(bDateTime);
    });
  },
}));

// Helper to get the soonest valid datetime from a lesson
function getSoonestDateTime(dates: any, times: any) {
  return dates
    .flatMap((dateStr: any) =>
      times.map((timeStr: any) =>
        moment
          .utc(dateStr)
          .tz("Asia/Manila")
          .set({
            hour: moment(timeStr, ["h:mm A"]).hour(),
            minute: moment(timeStr, ["h:mm A"]).minute(),
          })
      )
    )
    .sort((a: any, b: any) => a.diff(b))[0]; // Return earliest
}

export default useInstructorDashboard;
