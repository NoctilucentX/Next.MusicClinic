'use client';

import React from 'react';
import SideNav from './SideNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <main className="lg:pl-64">
        <div className="px-4 py-8 lg:px-8">
          <div className="pt-16 lg:pt-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
