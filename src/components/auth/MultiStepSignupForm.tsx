'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const step1Schema = z.object({
  firstName: z.string().min(2, { message: 'First name is required.' }),
  lastName: z.string().min(2, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
});

const step2Schema = z.object({
  companyName: z.string().min(2, { message: 'Company name is required.' }),
  companyWebsite: z
    .string()
    .url({ message: 'Please enter a valid URL.' })
    .optional()
    .or(z.literal('')),
});

const signupSchema = step1Schema
  .merge(step2Schema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const steps = [
  {
    id: '01',
    name: 'Your Details',
    fields: ['firstName', 'lastName', 'email', 'password', 'confirmPassword'],
    schema: step1Schema,
  },
  {
    id: '02',
    name: 'Company Information',
    fields: ['companyName', 'companyWebsite'],
    schema: step2Schema,
  },
  { id: '03', name: 'Review & Submit', schema: z.object({}) },
];

export function MultiStepSignupForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading] = useState(false);

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      companyWebsite: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger, getValues } = methods;

  const processForm = (data: SignupFormValues) => {
    console.log('Form Submitted', data);
    // Here we would call the server action
    toast({
      title: 'In Progress',
      description: 'Company registration is being rebuilt.',
    });
  };

  type FieldName = keyof SignupFormValues;

  const next = async () => {
    const fields = steps[currentStep].fields as FieldName[];
    const output = await trigger(fields, { shouldFocus: true });

    if (!output) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(processForm)} className="space-y-8">
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold ${
                    currentStep >= index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > index ? (
                    <span>&#10003;</span>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    currentStep >= index
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <Separator
                  className={`w-16 transition-colors ${
                    currentStep > index ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <Separator />

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: currentStep > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentStep > 0 ? -50 : 50 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={methods.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="pb-2">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={methods.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="pb-2">
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
                    control={methods.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="pb-2">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={methods.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="pb-2">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={methods.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="pb-2">
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={methods.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem className="pb-2">
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="companyWebsite"
                    render={({ field }) => (
                      <FormItem className="pb-2">
                        <FormLabel>Company Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Review Your Information
                  </h3>
                  <div className="space-y-2 rounded-md border p-4">
                    <p>
                      <span className="font-semibold">Name:</span>{' '}
                      {getValues('firstName')} {getValues('lastName')}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{' '}
                      {getValues('email')}
                    </p>
                    <Separator className="my-2" />
                    <p>
                      <span className="font-semibold">Company Name:</span>{' '}
                      {getValues('companyName')}
                    </p>
                    <p>
                      <span className="font-semibold">Company Website:</span>{' '}
                      {getValues('companyWebsite') || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Separator />

        <div className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button type="button" onClick={prev} variant="outline">
                <ArrowLeft className="mr-2" />
                Go Back
              </Button>
            )}
          </div>
          <div>
            {currentStep < steps.length - 1 && (
              <Button type="button" onClick={next}>
                Next Step
                <ArrowRight className="ml-2" />
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Company Account
              </Button>
            )}
          </div>
        </div>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
