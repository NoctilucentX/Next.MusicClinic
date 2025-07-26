'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, Music } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Students',
      value: '45',
      icon: Users,
      change: '+3 this month'
    },
    {
      title: 'Active Instructors',
      value: '8',
      icon: Music,
      change: '+1 this month'
    },
    {
      title: 'Pending Requests',
      value: '12',
      icon: FileText,
      change: '+5 today'
    },
    {
      title: 'Scheduled Lessons',
      value: '28',
      icon: Calendar,
      change: 'This week'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to Sernan's Music Clinic management platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New lesson request from John Doe</p>
                    <p className="text-xs text-gray-500">Piano lesson - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lesson scheduled with Sarah Smith</p>
                    <p className="text-xs text-gray-500">Guitar lesson - 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New instructor registered</p>
                    <p className="text-xs text-gray-500">Mike Johnson - Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Review Lesson Requests</p>
                    <p className="text-xs text-gray-500">12 pending requests</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium">Manage Schedule</p>
                    <p className="text-xs text-gray-500">View all lessons</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users size={20} className="text-purple-600" />
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-xs text-gray-500">Students & instructors</p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
