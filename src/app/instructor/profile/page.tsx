'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Save, Phone, Mail, Music } from 'lucide-react';

export default function InstructorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: 'Sernan Aquino',
    email: 'sernan@musicclinic.ph',
    phone: '+63 900 123 4567',
    bio: 'Music educator passionate about guiding students in mastering technique, creativity, and musical discipline.',
    instruments: ['Piano', 'Drums'],
    availability: 'Weekdays • 10AM–6PM',
  });

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saved:', form);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instructor Profile</h1>
            <p className="text-sm text-muted-foreground">Your teaching identity at Sernan’s Music Clinic</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User size={18} />
              <span>Personal Info</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  disabled={!isEditing}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  disabled={!isEditing}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                disabled={!isEditing}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                rows={3}
                disabled={!isEditing}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Music size={18} />
              <span>Teaching Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Instruments</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.instruments.map((instrument, i) => (
                  <Badge key={i} className="bg-blue-100 text-blue-700">{instrument}</Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Availability</Label>
              <p className="text-sm text-gray-700 mt-2">{form.availability}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
              <Mail size={20} />
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p className="text-sm text-muted-foreground">{form.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
              <Phone size={20} />
              <div>
                <p className="text-sm font-semibold">Phone</p>
                <p className="text-sm text-muted-foreground">{form.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md">
              <Music size={20} />
              <div>
                <p className="text-sm font-semibold">Availability</p>
                <p className="text-sm text-muted-foreground">{form.availability}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
