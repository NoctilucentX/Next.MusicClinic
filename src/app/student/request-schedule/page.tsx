/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, Music, X } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import useLessonRequestStore from "@/store/useLessonRequestStore";
import useInstructorStore from "@/store/useInstructorStore";
import { instrumentsLookUp, timeSlotsLookUp } from "@/lib/helper";

type FormValues = {
  instrument: string;
  level: string;
  duration: string;
  instructorId: string;
  additionalNotes?: string;
};

export default function StudentRequestSchedulePage() {
  const { user }: any = useAuthStore();
  const { addLessonRequest } = useLessonRequestStore();
  const { instructors, fetchAllInstructor } = useInstructorStore();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      instrument: "",
      level: "",
      duration: "60",
      additionalNotes: "",
      instructorId: "",
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    if (!selectedDates.length || !selectedTimes.length) return;

    setLoading(true);
    try {
      await addLessonRequest({
        studentId: user?.uid,
        studentName: user?.displayName,
        studentEmail: user?.email,
        instrument: data.instrument,
        level: data.level,
        instructorId: data.instructorId,
        duration: parseInt(data.duration),
        preferredDates: selectedDates.map((date) => date.toISOString()),
        preferredTimes: selectedTimes,
        additionalNotes: data.additionalNotes || "",
      });

      setSuccess(true);
      setSelectedDates([]);
      setSelectedTimes([]);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates ?? []);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  useEffect(() => {
    fetchAllInstructor();
  }, []);

  const canSubmit = selectedDates.length > 0 && selectedTimes.length > 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Request Lesson Schedule</h1>
          <p className="text-gray-600 mt-2">
            Select your preferred dates and times for music lessons
          </p>
        </div>

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <div className="w-4 h-4 rounded-full bg-green-600" />
                <span className="font-medium">
                  Request submitted successfully!
                </span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Your lesson request has been sent to the admin. You'll be
                notified once it's reviewed.
              </p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lesson Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Music size={20} />
                  <span>Lesson Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Instrument</Label>
                  <Controller
                    name="instrument"
                    control={control}
                    rules={{ required: "Instrument is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select instrument" />
                        </SelectTrigger>
                        <SelectContent>
                          {instrumentsLookUp.map((inst) => (
                            <SelectItem key={inst} value={inst}>
                              {inst}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.instrument && (
                    <p className="text-sm text-red-500">
                      {errors.instrument.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Skill Level</Label>
                  <Controller
                    name="level"
                    control={control}
                    rules={{ required: "Level is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.level && (
                    <p className="text-sm text-red-500">
                      {errors.level.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Instructor</Label>
                  <Controller
                    name="instructorId"
                    control={control}
                    rules={{ required: "Level is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {instructors.map((inst: any) => (
                            <SelectItem key={inst.uid} value={inst.uid}>
                              {inst.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.level && (
                    <p className="text-sm text-red-500">
                      {errors.level.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Lesson Duration</Label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label>Additional Notes</Label>
                  <Controller
                    name="additionalNotes"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Any specific requirements or preferences..."
                        rows={3}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon size={20} />
                  <span>Preferred Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                />
                {selectedDates.length > 0 && (
                  <div className="mt-4">
                    <Label>Selected Dates:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedDates.map((date, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                        >
                          {date.toLocaleDateString()}
                          <X
                            size={14}
                            className="ml-1"
                            onClick={() =>
                              setSelectedDates((prev) =>
                                prev.filter(
                                  (d) =>
                                    d.toDateString() !== date.toDateString()
                                )
                              )
                            }
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock size={20} />
                <span>Preferred Times</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {timeSlotsLookUp.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={
                      selectedTimes.includes(time) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className="w-full"
                  >
                    {time}
                  </Button>
                ))}
              </div>
              {selectedTimes.length > 0 && (
                <div className="mt-4">
                  <Label>Selected Times:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTimes.map((time, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {time}
                        <X
                          size={14}
                          className="ml-1"
                          onClick={() => handleTimeSelect(time)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit || loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Submitting..." : "Submit Lesson Request"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
