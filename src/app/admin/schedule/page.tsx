/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import useAdminDashboard from "@/store/useAdminDashboard";
import moment from "moment";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const loadLessons = async () => {
      const data = await useAdminDashboard
        .getState()
        .fetchLessonsByDate(selectedDate);
      setLessons(data);
    };
    loadLessons();
  }, [selectedDate]);

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
              onSelect={(date) => setSelectedDate(date ?? new Date())}
              className="rounded-md border"
              month={new Date()}
            />

            <div className="mt-6 space-y-4">
              {lessons.length > 0 ? (
                lessons.map((lesson) => {
                  const formattedDate =
                    lesson.preferredDates?.length &&
                    lesson.preferredTimes?.length
                      ? moment(
                          `${lesson.preferredDates[0]} ${lesson.preferredTimes[0]}`,
                          "YYYY-MM-DDTHH:mm:ss.SSSZ h:mm A"
                        ).format("dddd, MMM D - h:mm A")
                      : "Unknown time";

                  return (
                    <Card key={lesson.id} className="border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-medium">
                            {lesson.instrument || "Instrument"} Lesson
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {lesson.studentName || "Student"} with{" "}
                            {lesson.instructorName || "Instructor"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formattedDate}
                          </p>
                        </div>
                        <Badge
                          variant={
                            lesson.status === "approved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {lesson.status}
                        </Badge>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <p className="text-muted-foreground">
                  No lessons scheduled for this day.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
