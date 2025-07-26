import { FeaturesSection } from '@/components/public/FeaturesSection';
import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features | ResourceWise',
  description:
    'Explore the powerful features of ResourceWise, including AI-powered resource matching, comprehensive talent profiling, real-time client portals, and predictive business intelligence.',
};

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
