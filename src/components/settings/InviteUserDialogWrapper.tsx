'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { InviteUserDialog } from './InviteUserDialog';

export function InviteUserDialogWrapper() {
  const [isInviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <Dialog open={isInviteDialogOpen} onOpenChange={setInviteDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <InviteUserDialog setOpen={setInviteDialogOpen} />
    </Dialog>
  );
}
