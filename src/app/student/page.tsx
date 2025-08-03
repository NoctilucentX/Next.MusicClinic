/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Music, Plus } from "lucide-react";
import { useEffect } from "react";
import useStudentDashboard from "@/store/useStudentDashboard";
import useAuthStore from "@/store/useAuthStore";
import moment from "moment-timezone";

export default function StudentDashboard() {
  const { user }: any = useAuthStore();
  const {
    pendingRequests,
    declinedRequests,
    approvedRequests,
    getApprovedLessonRequests,
    getDeclineLessonRequests,
    getPendingLessonRequests,
    getApprovedLessonsCountThisMonth,
    getUpcomingLessonsThisWeek,
  } = useStudentDashboard();
  const totalThisMonth = getApprovedLessonsCountThisMonth();
  const upcomingThisWeek = getUpcomingLessonsThisWeek();

  useEffect(() => {
    if (user) {
      getApprovedLessonRequests(user?.uid);
      getDeclineLessonRequests(user?.uid);
      getPendingLessonRequests(user?.uid);
    }
  }, [
    user,
    getApprovedLessonRequests,
    getDeclineLessonRequests,
    getPendingLessonRequests,
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your music lessons and schedule
            </p>
          </div>
          <Link href="/student/request-schedule">
            <Button className="mt-4 sm:mt-0">
              <Plus size={16} className="mr-2" />
              Request New Lesson
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Upcoming Lessons
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingThisWeek.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Lessons
              </CardTitle>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalThisMonth}</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Instruments
              </CardTitle>
              <Music className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.instruments?.length | 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Array.isArray(user?.instruments)
                  ? user?.instruments.map((inst: any) => inst.name).join(", ")
                  : "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Upcoming Lessons</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingThisWeek.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No upcoming lessons</p>
                  <Link href="/student/request-schedule">
                    <Button size="sm" className="mt-2">
                      Schedule a lesson
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingThisWeek.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Music size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {lesson.instrument} Lesson{" "}
                            {lesson?.room ? `(${lesson?.room})` : ""}
                          </p>
                          <p className="text-sm text-gray-600">
                            with {lesson.instructorName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {(() => {
                          const weekStart = moment().startOf("isoWeek"); // Monday
                          const weekEnd = moment().endOf("isoWeek"); // Sunday

                          const upcomingDate = lesson.preferredDates
                            .map((dateStr: any) => moment(dateStr))
                            .filter((date: any) =>
                              date.isBetween(
                                weekStart,
                                weekEnd,
                                undefined,
                                "[]"
                              )
                            )
                            .sort((a: any, b: any) => a.diff(b))[0];

                          const index = lesson.preferredDates.findIndex(
                            (d: any) => moment(d).isSame(upcomingDate)
                          );

                          const time = lesson.preferredTimes?.[index] || "-";

                          return upcomingDate ? (
                            <>
                              <p className="text-sm font-medium">
                                {upcomingDate.format("MMM D, YYYY")}
                              </p>
                              <p className="text-xs text-gray-500">
                                {time} • {lesson.duration} min
                              </p>
                            </>
                          ) : (
                            <p className="text-sm font-medium text-gray-400">
                              No date this week
                            </p>
                          );
                        })()}
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
                <Clock size={20} />
                <span>Recent Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No recent requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request: any) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <BookOpen size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {request.instrument} Lesson{" "}
                            {request?.room ? `(${request?.room})` : ""}
                          </p>
                          <p className="text-sm text-gray-600">
                            Requested on{" "}
                            {moment(
                              request.createdAt?.seconds
                                ? request.createdAt.seconds * 1000
                                : request.createdAt
                            ).format("MMM D, YYYY")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/student/request-schedule">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Plus size={20} className="text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium">Request Lesson</p>
                      <p className="text-xs text-gray-500">
                        Schedule new lesson
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
              <Link href="/student/my-lessons">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen size={20} className="text-green-600" />
                    <div className="text-left">
                      <p className="font-medium">My Lessons</p>
                      <p className="text-xs text-gray-500">
                        View lesson history and Schedule
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
              <Link href="/student/schedule">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium">Payment</p>
                      <p className="text-xs text-gray-500">through Gcash</p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
