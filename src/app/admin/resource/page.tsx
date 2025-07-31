'use client'

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ResourcesPage() {
  const rooms = [
    { id: 1, name: 'Room A', status: 'occupied' },
    { id: 2, name: 'Room B', status: 'available' },
    { id: 3, name: 'Room C', status: 'maintenance' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600">Track and monitor available rooms</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
              >
                <div className="font-medium">{room.name}</div>
                <div
                  className={`text-sm font-semibold ${
                    room.status === 'available'
                      ? 'text-green-600'
                      : room.status === 'occupied'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  }`}
                >
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
