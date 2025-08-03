/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useLessonRequestStore from "@/store/useLessonRequestStore";
import moment from "moment";
import { roomLookUp } from "@/lib/helper";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Define types

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
  status: "pending" | "approved" | "declined";
};

export default function LessonRequestsPage() {
  const {
    pendingRequests,
    getPendingLessonRequests,
    updateStatus,
    updateRoom,
  } = useLessonRequestStore();

  useEffect(() => {
    getPendingLessonRequests();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
                  <TableHead>Instructor</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.studentName}</TableCell>
                    <TableCell>{req.instrument}</TableCell>
                    <TableCell>{req.duration} min</TableCell>
                    <TableCell>{req.level}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {req.preferredDates.map((date, index) => (
                          <div key={index}>
                            {moment(date).format("MMM D, YYYY")}
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {req.preferredTimes.map((time, index) => (
                          <div key={index}>{time}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "approved"
                            ? "default"
                            : req.status === "declined"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.instructorName}</TableCell>
                    <TableCell>
                      <Select
                        onValueChange={async (value: string) => {
                          await updateRoom(req.id, value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomLookUp.map((room: string) => (
                            <SelectItem key={room} value={room}>
                              {room}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        variant="outline"
                        onClick={async () =>
                          await updateStatus(req.id, "approved")
                        }
                        disabled={!(req.status === "pending")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () =>
                          await updateStatus(req.id, "declined")
                        }
                        disabled={!(req.status === "pending")}
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
