'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/80 to-accent/60">
      <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 text-center text-primary-foreground md:px-6">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
        >
          Transform Your Technical Consultancy with AI-Powered Resource
          Allocation
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.6 }}
          className="mt-6 max-w-3xl text-lg opacity-90 md:text-xl"
        >
          The only platform that intelligently matches your technical talent to
          the right projects using GenKit with Gemini API - purpose-built for
          consultancy companies, ODCs, and IT services organizations.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.9 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/signup">Start 30-Day Free Trial</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#">Watch 2-Min Demo</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
