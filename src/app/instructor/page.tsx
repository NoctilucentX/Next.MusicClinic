/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, BookOpen, Clock } from "lucide-react";
import useInstructorDashboard from "@/store/useInstructorDashboard";
import useAuthStore from "@/store/useAuthStore";
import moment from "moment";
import { daysOfWeekLookUp } from "@/lib/helper";

export default function InstructorDashboard() {
  const { user }: any = useAuthStore();
  const {
    getTodaysLessons,
    getTotalStudents,
    getThisWeekLessonsCount,
    getTotalTeachingHoursThisWeek,
    getWeeklyOverview,
    getApprovedLessonRequests,
  } = useInstructorDashboard();

  const todaysLessons = getTodaysLessons();
  const totalStudents = getTotalStudents();
  const lessonsThisWeek = getThisWeekLessonsCount();
  const hoursThisWeek = getTotalTeachingHoursThisWeek();
  const weeklyOverview = getWeeklyOverview();

  const stats = [
    {
      title: "Lessons Scheduled Today",
      value: todaysLessons.length.toString(),
      icon: BookOpen,
      change: "scheduled for today",
    },
    {
      title: "Total Active Students",
      value: totalStudents,
      icon: Users,
      change: "currently enrolled",
    },
    {
      title: "Lessons Scheduled",
      value: lessonsThisWeek,
      icon: Calendar,
      change: "lessons this week",
    },
    {
      title: "Total Teaching Hours",
      value: hoursThisWeek,
      icon: Clock,
      change: "hours taught this week",
    },
  ];

  useEffect(() => {
    if (user) {
      getApprovedLessonRequests(user?.uid);
    }
  }, [user, getApprovedLessonRequests]);

  console.log("weeklyOverview: ", weeklyOverview);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600">Manage your lessons and students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen size={20} />
                <span>Today's Lessons</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysLessons.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    No lessons scheduled for today
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaysLessons.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{lesson.studentName}</p>
                          <p className="text-sm text-gray-600">
                            {lesson.instrument} • {lesson.level}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {lesson.preferredTimes?.length
                            ? lesson.preferredTimes
                                .slice()
                                .sort(
                                  (a: any, b: any) =>
                                    moment(a, "h:mm A").toDate().getTime() -
                                    moment(b, "h:mm A").toDate().getTime()
                                )[0]
                            : "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lesson.duration} min
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Weekly Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeekLookUp.map((day, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center p-2 ${
                      idx < 6 ? "border-b" : ""
                    }`}
                  >
                    <span className="text-sm font-medium">{day}</span>
                    <span className="text-sm text-gray-600">
                      {weeklyOverview?.[day] || 0} lessons
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium">View Schedule</p>
                  <p className="text-xs text-gray-500">
                    Check upcoming lessons
                  </p>
                </div>
              </div>
            </button>
            <button className="text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-green-600" />
                <div>
                  <p className="font-medium">My Students</p>
                  <p className="text-xs text-gray-500">View student profiles</p>
                </div>
              </div>
            </button>
            <button className="text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <BookOpen size={20} className="text-purple-600" />
                <div>
                  <p className="font-medium">Lesson History</p>
                  <p className="text-xs text-gray-500">View past lessons</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
