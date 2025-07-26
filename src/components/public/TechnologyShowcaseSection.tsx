'use client';

import { motion } from 'framer-motion';
import { Zap, Database, Code, ShieldCheck } from 'lucide-react';

const fadeInAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const techHighlights = [
  {
    icon: Zap,
    title: 'GenKit with Gemini API',
    description: 'Advanced AI for intelligent matching and insights.',
  },
  {
    icon: Database,
    title: 'Firebase Architecture',
    description: 'Scalable, secure, and real-time platform foundation.',
  },
  {
    icon: Code,
    title: 'Next.js with TypeScript',
    description: 'Modern, performant, and type-safe web application.',
  },
  {
    icon: ShieldCheck,
    title: 'Multi-Tenant SaaS',
    description: 'Enterprise-grade security and data isolation.',
  },
];

const techDifferentiators = [
  'Real-time collaboration with Firebase Real-time Database',
  'Advanced security with Firebase Authentication and Security Rules',
  'Scalable file management with Firebase Storage',
  'Comprehensive analytics with Firebase Analytics integration',
];

export function TechnologyShowcaseSection() {
  return (
    <section className="w-full py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          {...fadeInAnimation}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-serif">
            Built on a Cutting-Edge Technology Stack
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            We leverage a modern, scalable, and secure technology stack to
            deliver a reliable and performant platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            {...fadeInAnimation}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Technology Highlights</h3>
            <div className="space-y-6">
              {techHighlights.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            {...fadeInAnimation}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">
              Technical Differentiators
            </h3>
            <ul className="space-y-4">
              {techDifferentiators.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-accent-foreground" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
