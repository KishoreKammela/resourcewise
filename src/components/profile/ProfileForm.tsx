'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { PlatformUser, TeamMember } from '@/lib/types';
import { updateUserProfileAction } from '@/app/actions/userActions';

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type UserProfileProps = (PlatformUser | TeamMember) & {
    userRole: 'platform' | 'company',
    id: string
};

export function ProfileForm({ currentUser }: { currentUser: UserProfileProps }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const defaultValues: Partial<ProfileFormValues> = {
    firstName: currentUser.personalInfo?.firstName || currentUser.firstName,
    lastName: currentUser.personalInfo?.lastName || currentUser.lastName,
    email: currentUser.personalInfo?.email || currentUser.email,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    const result = await updateUserProfileAction(currentUser.id, currentUser.userRole, {
      firstName: data.firstName,
      lastName: data.lastName,
    });
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Profile Updated',
        description: 'Your information has been successfully updated.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !form.formState.isDirty}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
