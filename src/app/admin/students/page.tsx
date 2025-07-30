// app/students/page.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function StudentsPage() {
  const [students, setStudents] = useState([
    {
      name: 'John Doe',
      email: 'john@example.com',
      instrument: 'Piano',
      instructor: 'Sarah Smith',
      dateEnrolled: '2025-07-20'
    }
  ]);

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    instrument: '',
    instructor: '',
    dateEnrolled: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // const addStudent = () => {
  //   setStudents([...students, newStudent]);
  //   setNewStudent({ name: '', email: '', instrument: '', instructor: '', dateEnrolled: '' });
  // };

  const addStudent = async () => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      const data = await res.json();

      if (data.success) {
        // Optionally add the new student with the inserted ID
        setStudents([...students, newStudent]);
        setNewStudent({ name: '', email: '', instrument: '', instructor: '', dateEnrolled: '' });
      } else {
        alert('Failed to add student: ' + data.error);
      }
    } catch (error) {
      alert('Error adding student: ' + error.message);
    }
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input name="name" placeholder="Name" value={newStudent.name} onChange={handleChange} />
              <Input name="email" placeholder="Email" value={newStudent.email} onChange={handleChange} />
              <Input name="instrument" placeholder="Instrument" value={newStudent.instrument} onChange={handleChange} />
              <Input name="instructor" placeholder="Instructor" value={newStudent.instructor} onChange={handleChange} />
              <Input
                  type="date"
                  name="dateEnrolled"
                  placeholder="Date Enrolled"
                  value={newStudent.dateEnrolled}
                  onChange={handleChange}
                />
            </div>
            <Button onClick={addStudent}>Add Student</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Instrument</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Date Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.instrument}</TableCell>
                    <TableCell>{student.instructor}</TableCell>
                    <TableCell>{student.dateEnrolled}</TableCell>
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
