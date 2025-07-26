'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen, Music, Plus } from 'lucide-react';

export default function StudentDashboard() {
  const upcomingLessons = [
    {
      id: 1,
      instrument: 'Piano',
      instructor: 'Ms. Johnson',
      date: '2025-01-28',
      time: '2:00 PM',
      duration: '60 min'
    },
    {
      id: 2,
      instrument: 'Guitar',
      instructor: 'Mr. Smith',
      date: '2025-01-30',
      time: '4:00 PM',
      duration: '45 min'
    }
  ];

  const recentRequests = [
    {
      id: 1,
      instrument: 'Piano',
      status: 'scheduled',
      date: '2025-01-26'
    },
    {
      id: 2,
      instrument: 'Guitar',
      status: 'pending',
      date: '2025-01-25'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Manage your music lessons and schedule</p>
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
              <div className="text-2xl font-bold">{upcomingLessons.length}</div>
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
              <div className="text-2xl font-bold">24</div>
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
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-gray-500 mt-1">Piano, Guitar</p>
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
              {upcomingLessons.length === 0 ? (
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
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Music size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{lesson.instrument}</p>
                          <p className="text-sm text-gray-600">with {lesson.instructor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(lesson.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{lesson.time} • {lesson.duration}</p>
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
              {recentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No recent requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <BookOpen size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{request.instrument} Lesson</p>
                          <p className="text-sm text-gray-600">Requested on {new Date(request.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'scheduled'
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
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
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <Plus size={20} className="text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium">Request Lesson</p>
                      <p className="text-xs text-gray-500">Schedule new lesson</p>
                    </div>
                  </div>
                </Button>
              </Link>
              <Link href="/student/my-lessons">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <BookOpen size={20} className="text-green-600" />
                    <div className="text-left">
                      <p className="font-medium">My Lessons</p>
                      <p className="text-xs text-gray-500">View lesson history</p>
                    </div>
                  </div>
                </Button>
              </Link>
              <Link href="/student/schedule">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium">My Schedule</p>
                      <p className="text-xs text-gray-500">View calendar</p>
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
