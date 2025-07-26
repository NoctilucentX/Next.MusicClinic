'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Clock, Music, User } from 'lucide-react';

export default function MyLessonsPage() {
  const lessons = [
    {
      id: 1,
      instrument: 'Piano',
      instructor: 'Ms. Johnson',
      date: '2025-01-28',
      time: '2:00 PM',
      duration: '60 min',
      status: 'upcoming',
      notes: 'Practice scales and arpeggios'
    },
    {
      id: 2,
      instrument: 'Guitar',
      instructor: 'Mr. Smith',
      date: '2025-01-25',
      time: '4:00 PM',
      duration: '45 min',
      status: 'completed',
      notes: 'Worked on chord progressions'
    },
    {
      id: 3,
      instrument: 'Piano',
      instructor: 'Ms. Johnson',
      date: '2025-01-23',
      time: '2:00 PM',
      duration: '60 min',
      status: 'completed',
      notes: 'Introduction to classical pieces'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      upcoming: 'default',
      completed: 'secondary',
      cancelled: 'destructive'
    };

    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Lessons</h1>
          <p className="text-gray-600">View your lesson history and upcoming sessions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Lessons
              </CardTitle>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Upcoming
              </CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lessons.filter(l => l.status === 'upcoming').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completed
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lessons.filter(l => l.status === 'completed').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Music size={20} />
                    <span>{lesson.instrument} Lesson</span>
                  </CardTitle>
                  {getStatusBadge(lesson.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Instructor:</strong> {lesson.instructor}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Date:</strong> {new Date(lesson.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Time:</strong> {lesson.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen size={16} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Duration:</strong> {lesson.duration}
                    </span>
                  </div>
                </div>

                {lesson.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong className="text-sm">Lesson Notes:</strong>
                    <p className="text-sm text-gray-600 mt-1">{lesson.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {lessons.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
              <p className="text-gray-600">Your lesson history will appear here once you start taking lessons.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
