'use client';

import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const comparisonData = [
  {
    feature: 'Technical Specialization',
    resourceWise: 'Built for software development lifecycle',
    traditional: 'Generic HR functionalities',
  },
  {
    feature: 'AI-Powered Matching',
    resourceWise: 'GenKit with Gemini API intelligence',
    traditional: 'Manual processes and keyword matching',
  },
  {
    feature: 'Multi-Engagement Model',
    resourceWise: 'ODC/Client-site/Internal support',
    traditional: 'Single model focus, lacks flexibility',
  },
  {
    feature: 'Real-Time Client Collaboration',
    resourceWise: 'Built-in secure client portals',
    traditional: 'Requires separate, external tools',
  },
  {
    feature: 'Predictive Analytics',
    resourceWise: 'Forward-looking demand forecasting',
    traditional: 'Historical data reporting only',
  },
];

export function ComparisonSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
            Why We&apos;re Different
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how ResourceWise stacks up against traditional HR and project
            management tools.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="overflow-hidden rounded-lg border shadow-md"
        >
          <div className="grid grid-cols-3 bg-muted/50 font-semibold">
            <div className="p-4">Feature</div>
            <div className="p-4 border-l">ResourceWise</div>
            <div className="p-4 border-l">Traditional Tools</div>
          </div>
          {comparisonData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="grid grid-cols-3 border-t items-center"
            >
              <div className="p-4 font-medium">{item.feature}</div>
              <div className="p-4 border-l text-sm text-muted-foreground flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <span>{item.resourceWise}</span>
              </div>
              <div className="p-4 border-l text-sm text-muted-foreground flex items-start gap-2">
                <X className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <span>{item.traditional}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
