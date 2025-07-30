'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Request = {
  id: string;
  studentId: string;
  studentName: string;
  instructorId: string;
  instrument: string;
  duration: string;
  level: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'declined';
};

type Student = {
  id: string;
  name: string;
};

type Instructor = {
  id: string;
  name: string;
  instrument: string;
};

export default function LessonRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const [form, setForm] = useState({
    studentId: '',
    instructorId: '',
    duration: '',
    level: '',
    date: '',
    time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  useEffect(() => {
    const fetchStudentsAndInstructors = async () => {
      try {
        const [sRes, iRes] = await Promise.all([
          fetch('/api/students'),
          fetch('/api/instructors'),
        ]);

        const studentsData = await sRes.json();
        const instructorsData = await iRes.json();

        if (studentsData.success) setStudents(studentsData.students);
        if (instructorsData.success) setInstructors(instructorsData.instructors);
      } catch (err) {
        console.error('Failed to load data', err);
      }
    };

    fetchStudentsAndInstructors();
  }, []);

  const submitRequest = () => {
    const student = students.find(s => s.id === form.studentId);
    const instructor = instructors.find(i => i.id === form.instructorId);

    if (!student || !instructor) return alert('Please select valid student and instructor');

    const newRequest: Request = {
      id: String(Date.now()),
      studentId: student.id,
      studentName: student.name,
      instructorId: instructor.id,
      instrument: instructor.instrument,
      duration: form.duration,
      level: form.level,
      date: form.date,
      time: form.time,
      status: 'pending',
    };

    setRequests(prev => [...prev, newRequest]);

    // Reset form
    setForm({
      studentId: '',
      instructorId: '',
      duration: '',
      level: '',
      date: '',
      time: '',
    });
  };

  const updateStatus = (id: string, newStatus: Request['status']) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Add Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>New Lesson Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select onValueChange={(val) => handleSelectChange('studentId', val)} value={form.studentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(val) => handleSelectChange('instructorId', val)} value={form.instructorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name} ({instructor.instrument})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input name="duration" placeholder="Duration (mins)" value={form.duration} onChange={handleChange} />
              <Input name="level" placeholder="Level (e.g. Beginner)" value={form.level} onChange={handleChange} />
              <Input type="date" name="date" value={form.date} onChange={handleChange} />
              <Input type="time" name="time" value={form.time} onChange={handleChange} />
            </div>
            <Button onClick={submitRequest}>Submit Request</Button>
          </CardContent>
        </Card>

        {/* Requests List */}
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
