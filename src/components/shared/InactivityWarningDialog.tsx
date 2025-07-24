'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface InactivityWarningDialogProps {
  isOpen: boolean;
  countdown: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export function InactivityWarningDialog({
  isOpen,
  countdown,
  onStayLoggedIn,
  onLogout,
}: InactivityWarningDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are You Still There?</AlertDialogTitle>
          <AlertDialogDescription>
            You have been inactive for a while. For your security, you will be
            logged out automatically in {countdown} seconds.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onLogout}>
              Log Out Now
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onStayLoggedIn}>Stay Logged In</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
