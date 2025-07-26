'use client';

import { motion } from 'framer-motion';

const useCases = [
  {
    title: 'Software Development Agency',
    challenge:
      'Managing 50+ developers across 15 client projects with varying skill requirements.',
    solution:
      'AI-powered matching ensures optimal team composition for each project.',
    results:
      '40% improvement in project delivery time, 25% increase in client retention.',
  },
  {
    title: 'ODC Management Company',
    challenge:
      'Operating multiple offshore development centers for global clients.',
    solution:
      'Centralized resource management with client-specific portals and reporting.',
    results:
      '60% improvement in client satisfaction, 30% reduction in operational overhead.',
  },
  {
    title: 'Hybrid Product & Services Co.',
    challenge:
      'Balancing internal product development with client service delivery.',
    solution:
      'Multi-engagement model support with intelligent resource allocation.',
    results:
      '35% increase in resource utilization, successful launch of 3 new products.',
  },
];

const fadeInAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export function UseCasesSection() {
  return (
    <section className="w-full py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          {...fadeInAnimation}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-serif">
            Perfect for Every Technical Consultancy Model
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            ResourceWise is designed to adapt to your unique business structure
            and operational needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold font-serif mb-4">
                  {useCase.title}
                </h3>
              </div>
              <div className="p-6 pt-0 space-y-4 flex-grow">
                <div>
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                    Challenge
                  </h4>
                  <p className="mt-1 text-card-foreground/90">
                    {useCase.challenge}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                    Solution
                  </h4>
                  <p className="mt-1 text-card-foreground/90">
                    {useCase.solution}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-muted/50 rounded-b-xl mt-auto">
                <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                  Results
                </h4>
                <p className="mt-1 text-accent-foreground font-semibold">
                  {useCase.results}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
