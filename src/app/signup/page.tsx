'use client';
import { MultiStepSignupForm } from '@/components/auth/MultiStepSignupForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Register Your Company</CardTitle>
          <CardDescription>
            Create your admin account and set up your company profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultiStepSignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
