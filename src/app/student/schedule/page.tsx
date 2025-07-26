'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const lessons = [
  {
    id: '1',
    date: '2025-07-08T10:00:00',
    instructor: 'Ms. Clara',
    instrument: 'Guitar',
    topic: 'Fingerpicking Basics',
    status: 'completed',
    notes: 'Practice alternating thumb and index finger with "Blackbird" intro.',
  },
  {
    id: '2',
    date: '2025-07-15T10:00:00',
    instructor: 'Mr. Allen',
    instrument: 'Piano',
    topic: 'Chord Progressions',
    status: 'rescheduled',
  },
];

export default function LessonHistoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lesson History</h1>
          <p className="text-gray-600">View and reflect on your past music lessons</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 border rounded-md hover:bg-gray-50 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {format(new Date(lesson.date), 'PPP p')} – {lesson.instrument}
                  </span>
                  <Badge
                    variant="outline"
                    className={`${
                      lesson.status === 'completed'
                        ? 'text-green-600 border-green-600'
                        : lesson.status === 'missed'
                        ? 'text-red-600 border-red-600'
                        : 'text-yellow-600 border-yellow-600'
                    }`}
                  >
                    {lesson.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Instructor:</strong> {lesson.instructor}</p>
                  <p><strong>Topic:</strong> {lesson.topic}</p>
                  {lesson.notes && <p><strong>Notes:</strong> {lesson.notes}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
