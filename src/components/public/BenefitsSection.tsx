'use client';

import { motion } from 'framer-motion';
import {
  DollarSign,
  Heart,
  TrendingUp,
  Zap,
  Scaling,
  BrainCircuit,
  CheckCircle,
} from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Increase Revenue by 35%',
    points: [
      'Optimal resource utilization and reduced bench time',
      'Better project margins through intelligent matching',
      'Faster time-to-market for new opportunities',
    ],
  },
  {
    icon: Heart,
    title: 'Improve Client Satisfaction by 40%',
    points: [
      'Real-time project transparency and communication',
      'Consistent delivery quality through better team matching',
      'Proactive issue identification and resolution',
    ],
  },
  {
    icon: DollarSign,
    title: 'Reduce Recruitment Costs by 50%',
    points: [
      'Efficient internal resource allocation before external hiring',
      'Improved placement success rates reduce replacement costs',
      'Data-driven hiring decisions with skill gap analysis',
    ],
  },
  {
    icon: Scaling,
    title: 'Scale Operations Seamlessly',
    points: [
      'Multi-tenant platform supporting unlimited growth',
      'Automated processes reduce manual overhead',
      'Standardized workflows across all engagement models',
    ],
  },
  {
    icon: Zap,
    title: 'Enhance Team Performance by 30%',
    points: [
      'Better skill-project alignment improves job satisfaction',
      'Clear career progression paths increase retention',
      'Performance analytics drive continuous improvement',
    ],
  },
  {
    icon: BrainCircuit,
    title: 'Accelerate Decision Making',
    points: [
      'Real-time dashboards eliminate reporting delays',
      'AI-powered insights provide actionable recommendations',
      'Predictive analytics enable proactive planning',
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function BenefitsSection() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Why Leading Consultancies Choose Our Platform
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 text-primary p-3 rounded-full">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{benefit.title}</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground flex-1">
                {benefit.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
