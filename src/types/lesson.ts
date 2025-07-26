export interface LessonRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  instrument: string;
  preferredDates: string[];
  preferredTimes: string[];
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  additionalNotes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'scheduled';
  createdAt: Date;
  updatedAt: Date;
  instructorId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  instruments: string[];
  availability: {
    [day: string]: string[]; // day -> available time slots
  };
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  instruments: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
}
