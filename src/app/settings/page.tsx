'use client';

import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useActionState, useEffect, useMemo, useRef } from 'react';
import { updateCompanyAction } from '@/app/actions/companyActions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
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

const companyProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name is required.'),
  companyWebsite: z.string().url('Please enter a valid URL.').optional(),
  companyLogoUrl: z.string().url('Please enter a valid URL.').optional(),
  timezone: z.string(),
  settings: z.object({
    currency: z.string(),
  }),
});

type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;

function SaveButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" disabled={!isDirty || pending}>
          {pending && <Loader2 className="mr-2 animate-spin" />}
          Save Changes
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to save these changes to the company profile?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="submit">Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SettingsContent() {
  const { userProfile, companyProfile, userRole, loading } = useAuth();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(
    updateCompanyAction.bind(
      null,
      companyProfile?.id ?? '',
      userProfile?.id ?? ''
    ),
    { success: false }
  );

  const isCompanyAdmin =
    userRole === 'company' &&
    userProfile &&
    'permissions' in userProfile &&
    (userProfile.permissions?.accessLevel === 'admin' ||
      userProfile.permissions?.accessLevel === 'superAdmin');

  const defaultValues = useMemo((): CompanyProfileFormValues => {
    return {
      companyName: companyProfile?.companyName ?? '',
      companyWebsite: companyProfile?.companyWebsite ?? '',
      companyLogoUrl: companyProfile?.companyLogoUrl ?? '',
      timezone: companyProfile?.timezone ?? 'UTC',
      settings: {
        currency: companyProfile?.settings?.currency ?? 'USD',
      },
    };
  }, [companyProfile]);

  const form = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    formState: { isDirty },
    reset,
  } = form;

  useEffect(() => {
    if (companyProfile) {
      reset(defaultValues);
    }
  }, [companyProfile, reset, defaultValues]);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Company Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  if (loading) {
    return <p>Loading settings...</p>;
  }

  if (userRole !== 'company') {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Settings" />
        <p>
          These settings are managed by company administrators. There are no
          platform-level settings here at this time.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form action={formAction} ref={formRef} className="space-y-6">
        <PageHeader title="Settings" />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Update your company&apos;s profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isCompanyAdmin}
                          placeholder="Your Company Inc."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isCompanyAdmin}
                          placeholder="https://yourcompany.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="companyLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Logo URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isCompanyAdmin}
                        placeholder="https://yourcompany.com/logo.png"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timezone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isCompanyAdmin}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PST">
                          Pacific Standard Time (PST)
                        </SelectItem>
                        <SelectItem value="EST">
                          Eastern Standard Time (EST)
                        </SelectItem>
                        <SelectItem value="GMT">
                          Greenwich Mean Time (GMT)
                        </SelectItem>
                        <SelectItem value="UTC">
                          Coordinated Universal Time (UTC)
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
              <CardTitle>Operational Data</CardTitle>
              <CardDescription>
                Configure your company&apos;s operational settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="settings.currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!isCompanyAdmin}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {isCompanyAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription plan and billing details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">
                      {companyProfile?.subscription?.plan
                        ? `${companyProfile.subscription.plan
                            .charAt(0)
                            .toUpperCase()}${companyProfile.subscription.plan.slice(1)} Plan`
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Unlimited resources and projects.
                    </p>
                  </div>
                  <Button>Manage Subscription</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {isCompanyAdmin && (
          <div className="flex justify-end">
            <SaveButton isDirty={isDirty} />
          </div>
        )}
      </form>
    </Form>
  );
}
export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsContent />
    </AppShell>
  );
}
