'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Invitation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { app } from '@/lib/firebase';
import { PasswordPolicy } from './PasswordPolicy';
import { acceptInvitationAction } from '@/app/actions/authActions';
import { Label } from '@/components/ui/label';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character.'
  );

const acceptInvitationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Complete Registration
    </Button>
  );
}

export function AcceptInvitationForm({
  invitation,
}: {
  invitation: Invitation;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useActionState(
    acceptInvitationAction.bind(null, invitation),
    { success: false }
  );

  const form = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const password = form.watch('password');

  useEffect(() => {
    async function handlePostRegistration() {
      if (state.success) {
        try {
          const auth = getAuth(app);
          await signInWithEmailAndPassword(
            auth,
            invitation.email,
            form.getValues('password')
          );
          toast({
            title: 'Registration Complete!',
            description: "You're now logged in.",
          });
          router.push('/');
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description:
              'Your account was created, but we could not log you in. Please go to the login page.',
          });
          router.push('/login');
        }
      } else if (state.error) {
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: state.error,
        });
      }
    }
    handlePostRegistration();
  }, [state, router, toast, invitation.email, form]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Complete Your Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={invitation.firstName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={invitation.lastName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={invitation.email} disabled />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordPolicy password={password} />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
