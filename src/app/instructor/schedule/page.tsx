// app/instructor/schedule/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { format, parseISO, isToday } from 'date-fns';

type Lesson = {
  id: string;
  student: string;
  instrument: string;
  time: string;
  date: string;
  status: 'upcoming' | 'completed';
};

export default function MySchedulePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');

  useEffect(() => {
    async function loadData() {
      const data = await fetchApprovedLessonsForInstructor(); // returns instructor-specific lessons
      setLessons(data);
    }
    loadData();
  }, []);

  const filteredLessons = lessons.filter((lesson) => {
    if (filter === 'today') return isToday(parseISO(lesson.date));
    if (filter === 'upcoming') return lesson.status === 'upcoming';
    return true;
  });

  const today = new Date();
  const thisMonth = format(today, 'MMMM yyyy');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Schedule — {thisMonth}</CardTitle>
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(val) => val && setFilter(val)}
              className="mt-2"
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="today">Today</ToggleGroupItem>
              <ToggleGroupItem value="upcoming">Upcoming</ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredLessons.length === 0 ? (
              <p className="text-muted-foreground">No lessons found.</p>
            ) : (
              filteredLessons.map((lesson) => (
                <Card key={lesson.id} className="p-4 border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        {format(parseISO(lesson.date), 'EEEE, MMM d')} — {lesson.time}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {lesson.instrument} lesson with {lesson.student}
                      </p>
                    </div>
                    <Badge variant={lesson.status === 'completed' ? 'default' : 'secondary'}>
                      {lesson.status}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
