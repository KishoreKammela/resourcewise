'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, Rocket } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
            Experience the Platform Yourself
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Discover how ResourceWise can revolutionize your consultancy. Take a
            self-guided tour or sign up for our free plan to get started today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
          className="mt-10 grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <div className="rounded-lg border bg-card text-card-foreground p-8 text-left flex flex-col">
            <h3 className="text-xl font-bold mb-2">Interactive Demo</h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              Take a 5-minute interactive tour of the platform with sample data.
              No registration required.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="#">
                <PlayCircle className="mr-2" />
                Start Interactive Tour
              </Link>
            </Button>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground p-8 text-left flex flex-col">
            <h3 className="text-xl font-bold mb-2">Start Free Forever</h3>
            <p className="text-muted-foreground mb-6 flex-grow">
              Get immediate access to the Free plan. No credit card required.
              Upgrade anytime.
            </p>
            <Button asChild size="lg">
              <Link href="/signup">
                <Rocket className="mr-2" />
                Sign Up for Free
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
