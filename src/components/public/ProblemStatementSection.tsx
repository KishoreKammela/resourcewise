'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GitFork, UserX, EyeOff, SearchX } from 'lucide-react';

const problems = [
  {
    icon: GitFork,
    challenge:
      'Managing internal projects, ODC operations, and client-site allocations simultaneously.',
    impact: 'Leads to resource conflicts and missed opportunities.',
  },
  {
    icon: UserX,
    challenge:
      'Manual processes using spreadsheets and institutional knowledge.',
    impact: 'Suboptimal allocations and 40% longer time-to-fill.',
  },
  {
    icon: EyeOff,
    challenge: 'Clients lack real-time insight into their allocated resources.',
    impact: 'Communication gaps and client dissatisfaction.',
  },
  {
    icon: SearchX,
    challenge:
      'No clear visibility into team capabilities across technology stacks.',
    impact: 'Inability to pursue new opportunities and plan for growth.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export function ProblemStatementSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            The Challenges Every Technical Consultancy Faces
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
            If you&apos;re still juggling spreadsheets and endless meetings,
            you&apos;re leaving money and opportunities on the table.
          </p>
        </div>

        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-1 md:gap-12 lg:max-w-5xl lg:grid-cols-2 mt-12">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              className="grid gap-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <div className="grid grid-cols-[48px_1fr] gap-4 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <problem.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Challenge</h3>
                  <p className="text-muted-foreground">{problem.challenge}</p>
                </div>
              </div>
              <div className="grid grid-cols-[48px_1fr] gap-4 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <span className="text-2xl font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Impact</h3>
                  <p className="text-muted-foreground">{problem.impact}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg">
            See How Our Platform Solves These Challenges
          </Button>
        </div>
      </div>
    </section>
  );
}
