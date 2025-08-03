/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import useStudentStore from "@/store/useStudentStore";
import useAuthStore from "@/store/useAuthStore";

type StudentForm = {
  displayName: string;
  email: string;
  dateEnrolled: string;
};

export default function StudentsPage() {
  const { user }: any = useAuthStore();
  const { register, handleSubmit, reset } = useForm<StudentForm>();
  const { createStudent, fetchAllStudents, students } = useStudentStore();

  // Fetch students on mount
  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  const onSubmit = async (data: StudentForm) => {
    if (data) {
      const studentInfo = {
        ...data,
        userType: "student",
      };
      console.log("TESt 123: ", user);
      await createStudent(studentInfo, user);
      await fetchAllStudents();
      reset();
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Name"
                  {...register("displayName", { required: true })}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
              </div>
              <Button type="submit" className="mt-4">
                Add Student
              </Button>
            </form>
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
                {students.map((student: any, index: number) => (
                  <TableRow key={student.id || index}>
                    <TableCell>{student.displayName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.instrument || "-"}</TableCell>
                    <TableCell>{student.instructor || "-"}</TableCell>
                    <TableCell>
                      {student.dateEnrolled
                        ? moment(
                            typeof student.dateEnrolled.toDate === "function"
                              ? student.dateEnrolled.toDate()
                              : student.dateEnrolled
                          ).format("MMMM D, YYYY")
                        : "N/A"}
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
