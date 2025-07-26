'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserType } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Users,
  Music,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Clock,
  FileText
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function SideNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const getNavigationItems = (userType: UserType): NavItem[] => {
    const baseItems: NavItem[] = [
      { href: `/${userType}`, label: 'Dashboard', icon: <Home size={20} /> }
    ];

    switch (userType) {
      case 'admin':
        return [
          ...baseItems,
          { href: '/admin/lesson-requests', label: 'Lesson Requests', icon: <FileText size={20} /> },
          { href: '/admin/students', label: 'Students', icon: <Users size={20} /> },
          { href: '/admin/instructors', label: 'Instructors', icon: <Music size={20} /> },
          { href: '/admin/schedule', label: 'Schedule', icon: <Calendar size={20} /> },
          { href: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> }
        ];
      case 'instructor':
        return [
          ...baseItems,
          { href: '/instructor/schedule', label: 'My Schedule', icon: <Calendar size={20} /> },
          { href: '/instructor/students', label: 'My Students', icon: <Users size={20} /> },
          { href: '/instructor/lessons', label: 'Lessons', icon: <BookOpen size={20} /> },
          { href: '/instructor/profile', label: 'Profile', icon: <Settings size={20} /> }
        ];
      case 'student':
        return [
          ...baseItems,
          { href: '/student/request-schedule', label: 'Request Schedule', icon: <Clock size={20} /> },
          { href: '/student/my-lessons', label: 'My Lessons', icon: <BookOpen size={20} /> },
          { href: '/student/schedule', label: 'My Schedule', icon: <Calendar size={20} /> },
          { href: '/student/profile', label: 'Profile', icon: <Settings size={20} /> }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems(user.userType);

  const NavContent = () => (
    <>
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">SMC Platform</h2>
          <p className="text-sm text-gray-600 capitalize">{user.userType} Panel</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={20} />
        </Button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-600">{user.email}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Failed to logout:', error);
            }
          }}
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={20} />
      </Button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>
    </>
  );
}
