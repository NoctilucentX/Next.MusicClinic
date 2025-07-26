// app/admin/lesson-requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Request = {
  id: string;
  studentName: string;
  instrument: string;
  duration: string;
  level: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'declined';
};

export default function LessonRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);

  // Simulated data fetch
  useEffect(() => {
    const mockData: Request[] = [
      {
        id: '1',
        studentName: 'Jane Cruz',
        instrument: 'Violin',
        duration: '45',
        level: 'Intermediate',
        date: '2025-07-30',
        time: '14:00',
        status: 'pending'
      },
      {
        id: '2',
        studentName: 'Mark Tan',
        instrument: 'Guitar',
        duration: '30',
        level: 'Beginner',
        date: '2025-08-01',
        time: '10:30',
        status: 'approved'
      }
    ];
    setRequests(mockData);
  }, []);

  const updateStatus = (id: string, newStatus: Request['status']) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Incoming Lesson Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Instrument</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>{req.studentName}</TableCell>
                    <TableCell>{req.instrument}</TableCell>
                    <TableCell>{req.duration} min</TableCell>
                    <TableCell>{req.level}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>{req.time}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === 'approved'
                            ? 'success'
                            : req.status === 'declined'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        variant="outline"
                        onClick={() => updateStatus(req.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => updateStatus(req.id, 'declined')}
                      >
                        Decline
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
