import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';
import { PricingSection } from '@/components/public/PricingSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | ResourceWise',
  description:
    'Find the perfect plan for your technical consultancy. ResourceWise offers flexible pricing tiers, from our free plan for small teams to enterprise-grade solutions.',
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
