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
import { Loader2, CalendarIcon } from 'lucide-react';
import type { PlatformUser, TeamMember } from '@/lib/types';
import { updateUserProfileAction } from '@/app/actions/userActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

const profileFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  designation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type UserProfileProps = (PlatformUser | TeamMember) & {
  userRole: 'platform' | 'company';
  id: string;
};

const toDate = (timestamp?: Timestamp): Date | undefined => {
    return timestamp ? timestamp.toDate() : undefined;
}

export function ProfileForm({ currentUser }: { currentUser: UserProfileProps }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getInitialValues = () => {
    if (currentUser.userRole === 'company' && 'personalInfo' in currentUser) {
      return {
        firstName: currentUser.personalInfo.firstName || '',
        lastName: currentUser.personalInfo.lastName || '',
        email: currentUser.personalInfo.email || '',
        phone: currentUser.personalInfo.phone || '',
        dateOfBirth: toDate(currentUser.personalInfo.dateOfBirth),
        gender: currentUser.personalInfo.gender || '',
        city: currentUser.address?.city || '',
        country: currentUser.address?.country || '',
        designation: currentUser.professionalInfo?.designation || '',
      };
    }
    if (currentUser.userRole === 'platform' && 'personalInfo' in currentUser) {
      return {
        firstName: currentUser.personalInfo.firstName || '',
        lastName: currentUser.personalInfo.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.personalInfo.phone || '',
        dateOfBirth: toDate(currentUser.personalInfo.dateOfBirth),
        gender: currentUser.personalInfo.gender || '',
        city: currentUser.personalInfo.city || '',
        country: currentUser.personalInfo.country || '',
        designation: currentUser.designation || '',
      };
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: undefined,
      gender: '',
      city: '',
      country: '',
      designation: '',
    };
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: getInitialValues(),
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    const updatePayload = {
      ...data,
      dateOfBirth: data.dateOfBirth ? Timestamp.fromDate(data.dateOfBirth) : undefined,
    }
    const result = await updateUserProfileAction(
      currentUser.id,
      currentUser.userRole,
      updatePayload
    );
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Profile Updated',
        description: 'Your information has been successfully updated.',
      });
      form.reset(data);
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-6"
      >
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. Senior Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
           <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. United States" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                disabled={loading || !form.formState.isDirty}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Profile Update</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save these changes to your profile?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
}
