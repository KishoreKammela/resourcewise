'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { PlatformConfiguration } from '@/lib/types';
import { updateSessionConfigAction } from '@/app/actions/platformActions';

const configFormSchema = z.object({
  inactivityTimeoutMinutes: z
    .number({ coerce: true })
    .int()
    .positive('Must be a positive number.'),
  warningCountdownSeconds: z
    .number({ coerce: true })
    .int()
    .positive('Must be a positive number.'),
});

type ConfigFormValues = z.infer<typeof configFormSchema>;

function SubmitButton({ isDirty }: { isDirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={!isDirty || pending}>
      {pending && <Loader2 className="mr-2 animate-spin" />}
      Save Changes
    </Button>
  );
}

export function PlatformConfigForm({
  sessionConfig,
}: {
  sessionConfig: PlatformConfiguration | null;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(
    updateSessionConfigAction.bind(null, user?.uid ?? ''),
    { success: false }
  );

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      inactivityTimeoutMinutes:
        sessionConfig?.sessionTimeout?.timeoutDurationMinutes ?? 15,
      warningCountdownSeconds:
        sessionConfig?.sessionTimeout?.warningCountdownSeconds ?? 60,
    },
    mode: 'onChange',
  });

  const {
    formState: { isDirty },
    reset,
  } = form;

  useEffect(() => {
    if (sessionConfig) {
      reset({
        inactivityTimeoutMinutes:
          sessionConfig.sessionTimeout?.timeoutDurationMinutes ?? 15,
        warningCountdownSeconds:
          sessionConfig.sessionTimeout?.warningCountdownSeconds ?? 60,
      });
    }
  }, [sessionConfig, reset]);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Configuration Updated',
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

  return (
    <FormProvider {...form}>
      <form
        ref={formRef}
        action={formAction}
        className="space-y-6"
        onSubmit={form.handleSubmit((data) => {
          const formData = new FormData();
          formData.append(
            'inactivityTimeoutMinutes',
            String(data.inactivityTimeoutMinutes)
          );
          formData.append(
            'warningCountdownSeconds',
            String(data.warningCountdownSeconds)
          );
          formAction(formData);
        })}
      >
        <Card>
          <CardHeader>
            <CardTitle>Session Management</CardTitle>
            <CardDescription>
              Configure automatic session timeout settings for all users.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="inactivityTimeoutMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inactivity Timeout (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Time in minutes before a user is considered inactive and a
                    warning is shown.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warningCountdownSeconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warning Countdown (seconds)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Duration in seconds of the warning dialog before automatic
                    logout.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton isDirty={isDirty} />
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
