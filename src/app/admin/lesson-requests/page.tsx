'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LessonRequest } from '@/types/lesson';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Music, User, FileText, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLessonRequestsPage() {
  const [requests, setRequests] = useState<LessonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LessonRequest | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'lessonRequests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const requestsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as LessonRequest[];
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateRequestStatus = async (requestId: string, status: LessonRequest['status'], scheduleData?: { date: string; time: string }) => {
    try {
      const requestRef = doc(db, 'lessonRequests', requestId);
      const updateData: Record<string, any> = {
        status,
        updatedAt: new Date()
      };

      if (scheduleData) {
        updateData.scheduledDate = scheduleData.date;
        updateData.scheduledTime = scheduleData.time;
      }

      await updateDoc(requestRef, updateData);
      setSelectedRequest(null);
      setScheduledDate('');
      setScheduledTime('');
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      pending: 'default',
      approved: 'secondary',
      rejected: 'destructive',
      scheduled: 'secondary'
    };

    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson requests...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Lesson Requests</h1>
          <div className="mt-4 sm:mt-0">
            <Badge variant="secondary" className="text-sm">
              {requests.filter(r => r.status === 'pending').length} Pending
            </Badge>
          </div>
        </div>

        {requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lesson requests</h3>
              <p className="text-gray-600">Students haven't submitted any lesson requests yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <User size={20} />
                      <span>{request.studentName}</span>
                    </CardTitle>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Music size={16} className="text-gray-500" />
                      <span className="text-sm">
                        <strong>Instrument:</strong> {request.instrument}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="text-sm">
                        <strong>Duration:</strong> {request.duration} min
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-sm">
                        <strong>Level:</strong> {request.level}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <strong className="text-sm">Preferred Dates:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.preferredDates.map((date, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {new Date(date).toLocaleDateString()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <strong className="text-sm">Preferred Times:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.preferredTimes.map((time, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {request.additionalNotes && (
                    <div>
                      <strong className="text-sm">Notes:</strong>
                      <p className="text-sm text-gray-600 mt-1">{request.additionalNotes}</p>
                    </div>
                  )}

                  {request.status === 'scheduled' && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <strong className="text-sm text-green-800">Scheduled:</strong>
                      <p className="text-sm text-green-700">
                        {new Date(request.scheduledDate!).toLocaleDateString()} at {request.scheduledTime}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4">
                    {request.status === 'pending' && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Check size={16} className="mr-1" />
                              Schedule
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Schedule Lesson</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={scheduledDate}
                                  onChange={(e) => setScheduledDate(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="time">Time</Label>
                                <Input
                                  id="time"
                                  type="time"
                                  value={scheduledTime}
                                  onChange={(e) => setScheduledTime(e.target.value)}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedRequest(null);
                                    setScheduledDate('');
                                    setScheduledTime('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => updateRequestStatus(request.id, 'scheduled', {
                                    date: scheduledDate,
                                    time: scheduledTime
                                  })}
                                  disabled={!scheduledDate || !scheduledTime}
                                >
                                  Confirm Schedule
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateRequestStatus(request.id, 'approved')}
                        >
                          <Check size={16} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateRequestStatus(request.id, 'rejected')}
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Submitted: {request.createdAt.toLocaleDateString()} at {request.createdAt.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
