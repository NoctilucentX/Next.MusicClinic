// app/instructors/page.tsx
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([
    {
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      instrument: 'Guitar',
      experience: 5,
      certifications: 'ABRSM Grade 8',
      students: 12,
      available: true,
      dateJoined: '2025-06-15'
    }
  ]);

  const [newInstructor, setNewInstructor] = useState({
    name: '',
    email: '',
    instrument: '',
    experience: '',
    certifications: '',
    students: 0,
    available: true,
    dateJoined: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInstructor({ ...newInstructor, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await fetch('/api/instructors');
        const data = await res.json();
        if (data.success) {
          setInstructors(data.instructors);
        } else {
          console.error('Failed to fetch instructors:', data.error);
        }
      } catch (err) {
        console.error('Error fetching instructors:', err);
      }
    };

    fetchInstructors();
  }, []);

  // const addInstructor = () => {
  //   setInstructors([...instructors, newInstructor]);
  //   setNewInstructor({
  //     name: '',
  //     email: '',
  //     instrument: '',
  //     experience: '',
  //     certifications: '',
  //     students: 0,
  //     available: true,
  //     dateJoined: ''
  //   });
  // };

  const addInstructor = async () => {
    try {
      const res = await fetch('/api/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstructor),
      });

      const data = await res.json();

      if (data.success) {
        setInstructors([...instructors, newInstructor]);
        setNewInstructor({
          name: '',
          email: '',
          instrument: '',
          experience: '',
          certifications: '',
          students: 0,
          available: true,
          dateJoined: ''
        });
      } else {
        alert('Failed to add instructor: ' + data.error);
      }
    } catch (error: any) {
      alert('Error adding instructor: ' + error.message);
    }
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Instructor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input name="name" placeholder="Name" value={newInstructor.name} onChange={handleChange} />
              <Input name="email" placeholder="Email" value={newInstructor.email} onChange={handleChange} />
              <Input name="instrument" placeholder="Instrument" value={newInstructor.instrument} onChange={handleChange} />
              <Input name="experience" placeholder="Experience (Years)" value={newInstructor.experience} onChange={handleChange} />
              <Input name="certifications" placeholder="Certifications" value={newInstructor.certifications} onChange={handleChange} />
              <Input
                  type="date"
                  name="dateJoined"
                  placeholder="Date Joined"
                  value={newInstructor.dateJoined}
                  onChange={handleChange}
                />

            </div>
            <Button onClick={addInstructor}>Add Instructor</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructor List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Instrument</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Certifications</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Date Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.map((instructor, index) => (
                  <TableRow key={index}>
                    <TableCell>{instructor.name}</TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>{instructor.instrument}</TableCell>
                    <TableCell>{instructor.experience} yrs</TableCell>
                    <TableCell>{instructor.certifications}</TableCell>
                    <TableCell>{instructor.students}</TableCell>
                    <TableCell>
                      <Switch checked={instructor.available} />
                    </TableCell>
                    <TableCell>{instructor.dateJoined}</TableCell>
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
