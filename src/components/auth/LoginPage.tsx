'use client';

import React, { useState } from 'react';
import { useAuth, UserType } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password, userType);
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen musical-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
            {/* Logo */}
             <div className="login-logo flex justify-center">
                <img
                src="/logo.png"
                alt="Sernan's Music Clinic Logo"
                  className="h-50 h-50"
                />
            </div>

        <CardHeader className="smc-login text-center">
    
          <CardTitle className="login-text text-2xl font-bold">Studio Management Platform</CardTitle>
          <CardDescription className='login1-text'>WELCOME BACK!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="login-text text-2xl">
            <div className="user-text m-5 ">
              <Label htmlFor="userType">USER TYPE</Label>
              <Select value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">ADMIN</SelectItem>
                  <SelectItem value="instructor">INCTRUCTOR</SelectItem>
                  <SelectItem value="student">STUDENT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="login-card space-y-2 m-5">
              <Label htmlFor="email">EMAIL</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2 m-5">
              <Label htmlFor="password">PASSWORD</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center ">{error}</div>
            )}

            <Button type="submit" className="w-full mx-auto justify-center" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
