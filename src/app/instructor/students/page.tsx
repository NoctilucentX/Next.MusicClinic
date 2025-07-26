'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MySchedulePage() {
  const lessons = [
    {
      id: 1,
      title: 'Drum Lessons',
      time: '10:00 AM',
      duration: '60 min',
      status: 'approved',
    },
    {
      id: 2,
      title: 'Guitar Lessons',
      time: '2:00 PM',
      duration: '45 min',
      status: 'pending',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600">See today's lessons and their details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No lessons scheduled for today
              </div>
            ) : (
              <ul className="space-y-4">
                {lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="p-4 rounded-md border bg-white flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-gray-600">{lesson.duration} • Status: <span className={lesson.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}>{lesson.status}</span></p>
                    </div>
                    <p className="text-sm font-medium">{lesson.time}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
