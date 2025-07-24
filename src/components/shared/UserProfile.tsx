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
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut, KeyRound, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChangePasswordDialog } from '../profile/ChangePasswordDialog';

export function UserProfile() {
  const { user, userProfile, userRole, logout } = useAuth();
  const { state } = useSidebar();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  if (!userProfile) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        {state === 'expanded' && <Skeleton className="h-4 w-24" />}
      </div>
    );
  }

  const getUserInfo = () => {
    let firstName = '';
    let lastName = '';
    let email = user?.email || 'No email found';

    if (userProfile) {
      if (userRole === 'company' && 'personalInfo' in userProfile) {
        firstName = userProfile.personalInfo.firstName || '';
        lastName = userProfile.personalInfo.lastName || '';
        email = userProfile.personalInfo.email || user?.email || '';
      } else if (userRole === 'platform' && 'personalInfo' in userProfile) {
        firstName = userProfile.personalInfo.firstName || '';
        lastName = userProfile.personalInfo.lastName || '';
        email = userProfile.personalInfo.email || user?.email || '';
      }
    }

    return {
      firstName: firstName || 'User',
      lastName: lastName || '',
      email,
    };
  };

  const { firstName, lastName, email } = getUserInfo();

  const triggerContent = (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center gap-3 overflow-hidden">
        <UserCircle className="h-8 w-8 shrink-0 text-muted-foreground" />
        {state === 'expanded' && (
          <div className="flex flex-col items-start overflow-hidden">
            <span className="truncate text-sm font-medium">
              {firstName} {lastName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {email}
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
      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'h-auto w-full justify-start p-2',
                state === 'collapsed' && 'h-10 w-10 justify-center p-0'
              )}
            >
              {triggerContent}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {firstName} {lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
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
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setIsLogoutAlertOpen(true)}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ChangePasswordDialog setOpen={setIsPasswordDialogOpen} />
      </Dialog>

      <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => logout()}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
