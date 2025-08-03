/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useAuthStore from "@/store/useAuthStore";
import useInstructorStore from "@/store/useInstructorStore";
import moment from "moment";
import { instrumentsLookUp } from "@/lib/helper";
import { Minus, Plus } from "lucide-react";

type InstructorForm = {
  displayName: string;
  email: string;
  instruments: { name: string }[];
  experience: string;
  certifications: string;
  dateJoined: string;
  students?: number;
};

export default function InstructorsPage() {
  const { user }: any = useAuthStore();
  const { register, control, handleSubmit, reset } = useForm<InstructorForm>({
    defaultValues: {
      instruments: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "instruments",
  });
  const { createInstructor, fetchAllInstructor, instructors } =
    useInstructorStore();

  useEffect(() => {
    fetchAllInstructor();
  }, [fetchAllInstructor]);

  const onSubmit = async (data: InstructorForm) => {
    if (data) {
      const instructorInfo = {
        ...data,
        userType: "instructor",
      };
      await createInstructor(instructorInfo, user);
      await fetchAllInstructor();
      reset();
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-4"
            >
              <Input
                {...register("displayName", { required: "Name is required" })}
                placeholder="Name"
              />

              <Input
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
              />
              <Input
                {...register("experience")}
                placeholder="Experience (Years)"
              />
              <Input
                {...register("certifications")}
                placeholder="Certifications"
              />
              <div className="col-span-2 space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Controller
                      control={control}
                      name={`instruments.${index}.name`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select instrument" />
                          </SelectTrigger>
                          <SelectContent>
                            {instrumentsLookUp.map((instrument) => (
                              <SelectItem key={instrument} value={instrument}>
                                {instrument}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    {index === fields.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => append({ name: "" })}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="col-span-2">
                <Button type="submit">Add Instructor</Button>
              </div>
            </form>
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
                  <TableHead>Date Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.map((instructor: any, index) => (
                  <TableRow key={index}>
                    <TableCell>{instructor.displayName}</TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>
                      {Array.isArray(instructor.instruments)
                        ? instructor.instruments
                            .map((inst: any) => inst.name)
                            .join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {instructor.experience
                        ? `${instructor.experience} yrs`
                        : "-"}
                    </TableCell>
                    <TableCell>{instructor.certifications}</TableCell>
                    <TableCell>
                      {instructor.dateEnrolled
                        ? moment(
                            typeof instructor.dateEnrolled.toDate === "function"
                              ? instructor.dateEnrolled.toDate()
                              : instructor.dateEnrolled
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
