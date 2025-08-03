/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useAuthStore from "@/store/useAuthStore";
import useInstructorDashboard from "@/store/useInstructorDashboard";
import moment from "moment-timezone";

export default function MySchedulePage() {
  const [filter, setFilter] = useState<"all" | "today" | "upcoming">(
    "upcoming"
  );
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<any[]>([]);

  const { user }: any = useAuthStore();
  const {
    getApprovedLessonRequests,
    getAllLessonsSorted,
    getTodaysLessonsSorted,
    getUpcomingLessonsSorted,
  } = useInstructorDashboard();

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user) return;
      setLoading(true);
      await getApprovedLessonRequests(user.uid);

      let filtered: any[] = [];
      switch (filter) {
        case "today":
          filtered = getTodaysLessonsSorted();
          break;
        case "upcoming":
          filtered = getUpcomingLessonsSorted();
          break;
        default:
          filtered = getAllLessonsSorted();
          break;
      }

      setLessons(filtered);
      setLoading(false);
    };

    fetchLessons();
  }, [
    user,
    getApprovedLessonRequests,
    getAllLessonsSorted,
    getUpcomingLessonsSorted,
    getTodaysLessonsSorted,
    filter,
  ]);

  const thisMonth = moment().tz("Asia/Manila").format("MMMM YYYY");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Schedule - {thisMonth}</CardTitle>
            <ToggleGroup
              type="single"
              value={filter}
              onValueChange={(val) => {
                if (val) setFilter(val as "all" | "today" | "upcoming");
              }}
              className="mt-2"
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="today">Today</ToggleGroupItem>
              <ToggleGroupItem value="upcoming">Upcoming</ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading lessons...</p>
            ) : lessons.length === 0 ? (
              <p className="text-muted-foreground">No lessons found.</p>
            ) : (
              [...lessons]
                .map((lesson) => {
                  const now = moment.tz("Asia/Manila");

                  const validDateTimes = lesson.preferredDates.flatMap(
                    (date: any) =>
                      lesson.preferredTimes.map((time: any) =>
                        moment.tz(
                          `${date} ${time}`,
                          "YYYY-MM-DD hh:mm A",
                          "Asia/Manila"
                        )
                      )
                  );

                  // If filtering for upcoming only, exclude past lessons
                  const relevantDateTimes =
                    filter === "upcoming"
                      ? validDateTimes.filter((dt: any) => dt.isAfter(now))
                      : validDateTimes;

                  if (relevantDateTimes.length === 0) return null;

                  const earliestDateTime = relevantDateTimes.sort(
                    (a: any, b: any) => a.valueOf() - b.valueOf()
                  )[0];

                  return { lesson, dateTime: earliestDateTime };
                })
                .filter(Boolean)
                .sort((a, b) => a!.dateTime.valueOf() - b!.dateTime.valueOf())
                .map(({ lesson, dateTime }: any) => (
                  <Card key={lesson.id} className="p-4 border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          {dateTime.format("dddd, MMM D")} -{" "}
                          {dateTime.format("h:mm A")}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {lesson.instrument} lesson with {lesson.studentName}
                        </p>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
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
