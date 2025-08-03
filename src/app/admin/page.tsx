"use client";

import React, { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Music } from "lucide-react";
import useAdminDashboard from "@/store/useAdminDashboard";
import moment from "moment";

export default function AdminDashboard() {
  const {
    fetchDashboardData,
    totalStudents,
    totalInstructors,
    pendingLessons,
    approvedLessons,
    recentPayments,
    recentLessonRequests,
    fetchRecentPayments,
    fetchRecentLessonRequests,
  } = useAdminDashboard();

  useEffect(() => {
    fetchDashboardData();
    fetchRecentPayments();
    fetchRecentLessonRequests();
  }, [fetchDashboardData, fetchRecentPayments, fetchRecentLessonRequests]);

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      icon: Users,
      change: "All registered students",
    },
    {
      title: "Active Instructors",
      value: totalInstructors.toString(),
      icon: Music,
      change: "Currently teaching",
    },
    {
      title: "Pending Requests",
      value: pendingLessons.toString(),
      icon: FileText,
      change: "Needs review",
    },
    {
      title: "Scheduled Lessons",
      value: approvedLessons.toString(),
      icon: Calendar,
      change: "Already approved",
    },
  ];

  console.log("recentPayments: ", recentPayments);
  console.log("recentLessonRequests: ", recentLessonRequests);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome to Sernan's Music Clinic management platform
          </p>
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
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLessonRequests.length > 0 ? (
                  recentLessonRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New lesson request from{" "}
                          {request.studentName || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.instrument || "Lesson"} -{" "}
                          {moment(request.createdAt?.toDate?.()).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No recent lesson requests.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.length > 0 ? (
                  recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {payment.displayName || "Someone"} paid ₱
                          {payment.amount?.toLocaleString() || "0"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Ref: {payment.reference || "N/A"} •{" "}
                          {payment.createdAt
                            ? moment(
                                payment.createdAt instanceof Date
                                  ? payment.createdAt
                                  : payment.createdAt.toDate?.()
                              ).calendar()
                            : "Time not available"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No payment history found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium">Review Lesson Requests</p>
                  <p className="text-xs text-gray-500">12 pending requests</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-green-600" />
                <div>
                  <p className="font-medium">Manage Schedule</p>
                  <p className="text-xs text-gray-500">View all lessons</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-purple-600" />
                <div>
                  <p className="font-medium">Manage Users</p>
                  <p className="text-xs text-gray-500">
                    Students & instructors
                  </p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
