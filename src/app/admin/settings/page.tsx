// app/admin/settings/page.tsx
'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function AdminSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" placeholder="e.g. HarmoniHub" />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" placeholder="Asia/Manila" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="2fa">Enable 2-Factor Authentication</Label>
              <Switch id="2fa" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="publicAccess">Allow Student Self-Registration</Label>
              <Switch id="publicAccess" />
            </div>
            <Button variant="destructive">Reset Admin Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="allowBackToBack">Allow Back-to-Back Lessons</Label>
              <Switch id="allowBackToBack" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maxLessons">Max Lessons Per Day</Label>
              <Input type="number" id="maxLessons" defaultValue={8} />
            </div>
            <Button>Update Preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotify">Email Alerts</Label>
              <Switch id="emailNotify" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lessonReminders">Lesson Reminder Notifications</Label>
              <Switch id="lessonReminders" />
            </div>
            <Button>Save Notification Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Version: 1.3.2</p>
            <p>Environment: Production</p>
            <p>Deployment: Vercel</p>
            <p>Region: Asia Southeast</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
