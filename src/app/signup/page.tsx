import { MultiStepSignupForm } from '@/components/auth/MultiStepSignupForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';
import type { Metadata } from 'next';
import { BarChart3, Briefcase, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign Up | ResourceWise',
  description:
    'Create your ResourceWise account and start revolutionizing your resource management today.',
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="w-full lg:grid lg:min-h-[calc(100vh-8rem)] lg:grid-cols-2">
          <div className="flex items-center justify-center p-6 lg:p-12">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Register Your Company
                </CardTitle>
                <CardDescription>
                  Create your admin account and set up your company profile to
                  get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MultiStepSignupForm />
              </CardContent>
            </Card>
          </div>
          <div className="hidden bg-muted lg:flex lg:flex-col lg:items-center lg:justify-center p-12 text-white">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold font-serif text-foreground">
                Join the Future of Resource Management
              </h2>
              <p className="mt-4 text-muted-foreground">
                Start your journey to optimize your talent, projects, and
                profitability.
              </p>
              <ul className="mt-8 space-y-6 text-left">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Intelligent Resource Allocation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Match the right talent to the right projects with our
                      AI-powered suggestions.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Comprehensive Talent Management
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Maintain a complete, up-to-date view of your team&apos;s
                      skills and availability.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Advanced Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Gain data-driven insights for strategic decision-making
                      and capacity planning.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
