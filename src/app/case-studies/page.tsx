import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Case Studies | ResourceWise',
  description:
    'See how leading technical consultancies have transformed their operations with ResourceWise. Read our customer success stories and case studies.',
};

export default function CaseStudiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12 text-center md:py-24">
          <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
            Customer Success Stories
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We are currently compiling detailed case studies from our satisfied
            customers. Check back soon to see the incredible results they have
            achieved with ResourceWise.
          </p>
          <Button asChild className="mt-8">
            <Link href="/contact">Request a Demo</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
