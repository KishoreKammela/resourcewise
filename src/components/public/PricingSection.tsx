'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      'Up to 20 resources',
      'Up to 5 active projects',
      'Basic matching algorithms',
      'Standard client portal',
      'Community support',
    ],
    cta: 'Start Free Forever',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/user/month',
    features: [
      'Unlimited resources & projects',
      'Advanced AI matching',
      'Custom client branding',
      'Comprehensive analytics',
      'Priority email and chat support',
    ],
    cta: 'Start 30-Day Pro Trial',
    href: '/signup',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Full platform customization',
      'Advanced integrations & API access',
      'Dedicated infrastructure',
      '24/7 premium support',
      'SLA guarantees',
    ],
    cta: 'Schedule Enterprise Demo',
    href: '#',
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Choose the Plan That Fits Your Growth
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing. No hidden fees.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3 items-center">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={cn(
                  'h-full flex flex-col',
                  tier.featured && 'border-2 border-primary shadow-2xl'
                )}
              >
                {tier.featured && (
                  <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider text-center py-1 rounded-t-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>
                    <span className="text-4xl font-bold text-foreground">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-muted-foreground">
                        {tier.period}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                    variant={tier.featured ? 'default' : 'outline'}
                  >
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
