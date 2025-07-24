'use client';

import { useMemo, useState, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import type { Timestamp } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { updateUserProfile } from '@/app/actions/userActions';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const profileFormSchema = z.object({
  email: z.string().email(),
  personalInfo: z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    phone: z.string().optional(),
    dateOfBirth: z.date().optional(),
    gender: z.string().optional(),
  }),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  professionalInfo: z.object({
    designation: z.string().optional(),
    department: z.string().optional(),
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type UserProfileProps = (PlatformUser | TeamMember) & {
  userRole: 'platform' | 'company';
  id: string;
};

const toDate = (timestamp?: Timestamp | Date): Date | undefined => {
  if (!timestamp) {
    return undefined;
  }
  // Firestore Timestamps have a toDate() method, plain Dates do not.
  if (timestamp && typeof (timestamp as Timestamp).toDate === 'function') {
    return (timestamp as Timestamp).toDate();
  }
  // If it's already a Date object, return it.
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return undefined;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  );
}

export function ProfileForm({
  currentUser,
}: {
  currentUser: UserProfileProps;
}) {
  const { toast } = useToast();
  const { refreshUserProfile } = useAuth();
  const [state, formAction] = useActionState(
    updateUserProfile.bind(null, currentUser.id),
    { success: false }
  );

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      refreshUserProfile();
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: state.error,
      });
    }
  }, [state, toast, refreshUserProfile]);

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const getInitialValues = useMemo((): ProfileFormValues => {
    const email = currentUser.email || '';

    if (currentUser.userRole === 'platform') {
      const platformUser = currentUser as PlatformUser;
      return {
        email,
        personalInfo: {
          firstName: platformUser.personalInfo?.firstName ?? '',
          lastName: platformUser.personalInfo?.lastName ?? '',
          phone: platformUser.personalInfo?.phone ?? '',
          dateOfBirth: toDate(platformUser.personalInfo?.dateOfBirth),
          gender: platformUser.personalInfo?.gender ?? '',
        },
        address: {
          line1: platformUser.address?.line1 ?? '',
          line2: platformUser.address?.line2 ?? '',
          city: platformUser.address?.city ?? '',
          state: platformUser.address?.state ?? '',
          country: platformUser.address?.country ?? '',
          postalCode: platformUser.address?.postalCode ?? '',
        },
        professionalInfo: {
          designation: platformUser.professionalInfo?.designation ?? '',
          department: platformUser.professionalInfo?.department ?? '',
        },
      };
    }
    // Fallback for company users or other roles
    return {
      email,
      personalInfo: {
        firstName: (currentUser as any).personalInfo?.firstName ?? '',
        lastName: (currentUser as any).personalInfo?.lastName ?? '',
        phone: (currentUser as any).personalInfo?.phone ?? '',
        dateOfBirth: toDate((currentUser as any).personalInfo?.dateOfBirth),
        gender: (currentUser as any).personalInfo?.gender ?? '',
      },
      address: {
        line1: (currentUser as any).address?.line1 ?? '',
        line2: (currentUser as any).address?.line2 ?? '',
        city: (currentUser as any).address?.city ?? '',
        state: (currentUser as any).address?.state ?? '',
        country: (currentUser as any).address?.country ?? '',
        postalCode: (currentUser as any).address?.postalCode ?? '',
      },
      professionalInfo: {
        designation: (currentUser as any).professionalInfo?.designation ?? '',
        department: (currentUser as any).professionalInfo?.department ?? '',
      },
    };
  }, [currentUser]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: getInitialValues,
    mode: 'onChange',
  });

  useEffect(() => {
    form.reset(getInitialValues);
  }, [currentUser, form, getInitialValues]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="personalInfo.firstName"
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
                name="personalInfo.lastName"
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
                name="personalInfo.phone"
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
                name="personalInfo.dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover
                      open={isDatePickerOpen}
                      onOpenChange={setDatePickerOpen}
                    >
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
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setDatePickerOpen(false);
                          }}
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
            </div>
            <FormField
              control={form.control}
              name="personalInfo.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>User&apso;s residential address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="address.line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Apt 4B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="address.city"
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
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. California" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="address.country"
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
              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 94103" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              User&apos;s role and department within the company.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="professionalInfo.designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Platform Administrator"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="professionalInfo.department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. IT, Operations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}
