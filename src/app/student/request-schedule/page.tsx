'use client';

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, Music, Plus, X } from 'lucide-react';

export default function StudentRequestSchedulePage() {
  const { user } = useAuth();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [instrument, setInstrument] = useState('');
  const [duration, setDuration] = useState('60');
  const [level, setLevel] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const instruments = [
    'Piano', 'Guitar', 'Violin', 'Drums', 'Voice',
    'Saxophone', 'Flute', 'Trumpet', 'Cello', 'Bass'
  ];

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }
    setSelectedDates(dates);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter(t => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'lessonRequests'), {
        studentId: user?.uid,
        studentName: user?.name,
        studentEmail: user?.email,
        instrument,
        preferredDates: selectedDates.map(date => date.toISOString()),
        preferredTimes: selectedTimes,
        duration: parseInt(duration),
        level,
        additionalNotes,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setSuccess(true);
      // Reset form
      setSelectedDates([]);
      setSelectedTimes([]);
      setInstrument('');
      setDuration('60');
      setLevel('');
      setAdditionalNotes('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = selectedDates.length > 0 && selectedTimes.length > 0 && instrument && level;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Request Lesson Schedule</h1>
          <p className="text-gray-600 mt-2">Select your preferred dates and times for music lessons</p>
        </div>

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <div className="w-4 h-4 rounded-full bg-green-600"></div>
                <span className="font-medium">Request submitted successfully!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Your lesson request has been sent to the admin. You'll be notified once it's reviewed.
              </p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="instrument">Instrument</Label>
                  <Select value={instrument} onValueChange={setInstrument}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      {instruments.map((inst) => (
                        <SelectItem key={inst} value={inst}>
                          {inst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">Skill Level</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Lesson Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
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
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any specific requirements or preferences..."
                    rows={3}
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
                  className="rounded-md border w-full"
                />
                {selectedDates.length > 0 && (
                  <div className="mt-4">
                    <Label>Selected Dates:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedDates.map((date, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {date.toLocaleDateString()}
                          <X
                            size={14}
                            className="ml-1"
                            onClick={() => {
                              const newDates = selectedDates.filter(
                                selectedDate => selectedDate.toDateString() !== date.toDateString()
                              );
                              setSelectedDates(newDates);
                            }}
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
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    type="button"
                    variant={selectedTimes.includes(time) ? "default" : "outline"}
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
                      <Badge key={index} variant="secondary" className="cursor-pointer">
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
              {loading ? 'Submitting...' : 'Submit Lesson Request'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
