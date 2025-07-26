// components/admin/HelpModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';


export default function HelpModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Help & Support</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Management</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="space-y-4 mt-4 text-sm">
          <p>If you need assistance, you can reach out to:</p>
          <div>
            <strong>Email:</strong> support@harmonihub.com
          </div>
          <div>
            <strong>Phone:</strong> +63 912 345 6789
          </div>
          <div>
            <strong>Office Hours:</strong> Mon–Fri, 9:00 AM – 5:00 PM
          </div>
          <div>
            <strong>Location:</strong> HarmoniHub HQ, Tarlac City, Philippines
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
