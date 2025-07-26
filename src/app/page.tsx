'use client';

import { CtaSection } from '@/components/public/CtaSection';
import { FeaturesSection } from '@/components/public/FeaturesSection';
import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';
import { HeroSection } from '@/components/public/HeroSection';
import { ProblemStatementSection } from '@/components/public/ProblemStatementSection';
import { BenefitsSection } from '@/components/public/BenefitsSection';
import { TechnologyShowcaseSection } from '@/components/public/TechnologyShowcaseSection';
import { UseCasesSection } from '@/components/public/UseCasesSection';
import { ComparisonSection } from '@/components/public/ComparisonSection';
import { FaqSection } from '@/components/public/FaqSection';
import { PricingSection } from '@/components/public/PricingSection';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        {/* <StatsSection /> */}
        <ProblemStatementSection />
        <FeaturesSection />
        <BenefitsSection />
        <TechnologyShowcaseSection />
        <UseCasesSection />
        <PricingSection />
        <ComparisonSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
