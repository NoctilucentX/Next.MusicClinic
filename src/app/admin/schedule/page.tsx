// app/admin/schedule/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar'; // if you have one or use a placeholder
import { format } from 'date-fns';

type Lesson = {
  id: string;
  date: string;
  time: string;
  studentName: string;
  instructorName: string;
  instrument: string;
  status: 'completed' | 'upcoming';
};

export default function SchedulePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Simulated fetch
  useEffect(() => {
    const mockLessons: Lesson[] = [
      {
        id: 'a1',
        date: '2025-07-06',
        time: '10:00',
        studentName: 'Ella Mendoza',
        instructorName: 'Coach Ria',
        instrument: 'Piano',
        status: 'completed'
      },
      {
        id: 'a2',
        date: '2025-07-12',
        time: '14:00',
        studentName: 'Leo Santos',
        instructorName: 'Coach Mike',
        instrument: 'Guitar',
        status: 'upcoming'
      },
      {
        id: 'a3',
        date: '2025-07-15',
        time: '16:30',
        studentName: 'Bianca Yu',
        instructorName: 'Coach Ria',
        instrument: 'Violin',
        status: 'upcoming'
      }
    ];
    setLessons(mockLessons);
  }, []);

  const lessonsOnSelectedDate = lessons.filter(
    lesson => format(new Date(lesson.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Lesson Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={date => setSelectedDate(date ?? new Date())}
              className="rounded-md border"
              month={new Date('2025-07-01')} // You could allow dynamic month switching later
            />
            <div className="mt-6 space-y-4">
              {lessonsOnSelectedDate.length > 0 ? (
                lessonsOnSelectedDate.map(lesson => (
                  <Card key={lesson.id} className="border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">{lesson.instrument} Lesson</p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.studentName} with {lesson.instructorName}
                        </p>
                        <p className="text-sm text-muted-foreground">{lesson.time}</p>
                      </div>
                      <Badge variant={lesson.status === 'completed' ? 'default' : 'secondary'}>
                        {lesson.status}
                      </Badge>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No lessons scheduled for this day.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
