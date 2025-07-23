'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmailAction } from '@/app/actions/userActions';
import { UserCircle, LogOut, KeyRound, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UserProfile() {
  const { user, userProfile, logout } = useAuth();
  const { state } = useSidebar();
  const { toast } = useToast();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isPasswordAlertOpen, setIsPasswordAlertOpen] = useState(false);

  const handlePasswordReset = async () => {
    if (user?.email) {
      const result = await sendPasswordResetEmailAction(user.email);
      if (result.success) {
        toast({
          title: 'Password Reset Email Sent',
          description: `An email has been sent to ${user.email} with instructions to reset your password.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Sending Email',
          description: result.error,
        });
      }
    }
    setIsPasswordAlertOpen(false);
  };

  if (!userProfile) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        {state === 'expanded' && <Skeleton className="h-4 w-24" />}
      </div>
    );
  }
  
  const triggerContent = (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3 overflow-hidden">
        <UserCircle className="h-8 w-8 shrink-0 text-muted-foreground" />
        {state === 'expanded' && (
          <div className="flex flex-col items-start overflow-hidden">
            <span className="truncate text-sm font-medium">
              {userProfile.firstName} {userProfile.lastName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {userProfile.email}
            </span>
          </div>
        )}
      </div>
       {state === 'expanded' && (
         <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      )}
    </div>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cn(
            "h-auto w-full justify-start p-2",
            state === 'collapsed' && 'h-10 w-10 justify-center p-0'
          )}>
            {triggerContent}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userProfile.firstName} {userProfile.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userProfile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsPasswordAlertOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsLogoutAlertOpen(true)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => logout()}>Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isPasswordAlertOpen} onOpenChange={setIsPasswordAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password?</AlertDialogTitle>
            <AlertDialogDescription>
              We will send a password reset link to your email address: <strong>{user?.email}</strong>. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordReset}>Send Email</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
