'use client';
import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'Consultancy Companies' },
  { value: '35%', label: 'Revenue Increase' },
  { value: '40%', label: 'Client Satisfaction Boost' },
  { value: '50%', label: 'Recruitment Cost Reduction' },
];

export function StatsSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center bg-muted/50 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-extrabold text-primary md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
