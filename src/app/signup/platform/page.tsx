'use client';
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { createPlatformUserAction } from '@/app/actions/authActions';
import { useFormStatus } from 'react-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { PasswordPolicy } from '@/components/auth/PasswordPolicy';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

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

const platformSignupSchema = z
  .object({
    firstName: z.string().min(2, { message: 'First name is required.' }),
    lastName: z.string().min(2, { message: 'Last name is required.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type PlatformSignupFormValues = z.infer<typeof platformSignupSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Account
    </Button>
  );
}

export default function PlatformSignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useActionState(createPlatformUserAction, {
    success: false,
  });

  const form = useForm<PlatformSignupFormValues>({
    resolver: zodResolver(platformSignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const { watch } = form;
  const password = watch('password');
  const email = watch('email');

  useEffect(() => {
    async function handleLogin() {
      if (state.success) {
        try {
          const auth = getAuth(app);
          await signInWithEmailAndPassword(auth, email, password);

          toast({
            title: 'Registration Successful',
            description: 'Your platform account has been created.',
          });
          router.push('/profile');
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

    if (state.success || state.error) {
      handleLogin();
    }
  }, [state, router, toast, email, password]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Platform Account</CardTitle>
          <CardDescription>
            Enter your information to create a new platform account.
          </CardDescription>
        </CardHeader>
        <FormProvider {...form}>
          <form
            action={formAction}
            className="space-y-6"
            onSubmit={form.handleSubmit(() => {
              const formData = new FormData();
              const values = form.getValues();
              formData.append('firstName', values.firstName);
              formData.append('lastName', values.lastName);
              formData.append('email', values.email);
              formData.append('password', values.password);
              formAction(formData);
            })}
          >
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="firstName">First Name</Label>
                      <FormControl>
                        <Input
                          id="firstName"
                          placeholder="John"
                          required
                          {...field}
                        />
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
                      <Label htmlFor="lastName">Last Name</Label>
                      <FormControl>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          required
                          {...field}
                        />
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
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
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
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <SubmitButton />
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
