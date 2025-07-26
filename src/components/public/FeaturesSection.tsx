'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Users,
  BrainCircuit,
  Database,
  Search,
  TrendingUp,
  BarChart,
  UserCheck,
  Shuffle,
  FileWarning,
  UserCog,
  Briefcase,
  DollarSign,
  LineChart,
  LucideIcon,
} from 'lucide-react';
import Image from 'next/image';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  dataAiHint: string;
}

const featuresData = {
  'resource-management': [
    {
      title: 'Comprehensive Talent Profiling',
      description:
        '360-degree employee profiles with technical and soft skills.',
      icon: Users,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'profile dashboard',
    },
    {
      title: 'AI Skill Extraction',
      description:
        'Automatic skill identification from resumes using Gemini API.',
      icon: Search,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'resume analysis',
    },
    {
      title: 'Dynamic Availability Tracking',
      description:
        'Real-time resource availability and allocation percentages.',
      icon: UserCheck,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'calendar schedule',
    },
    {
      title: 'Career Progression Mapping',
      description:
        'Clear advancement paths with skill development recommendations.',
      icon: TrendingUp,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'career path',
    },
  ],
  'project-matching': [
    {
      title: 'GenKit-Powered Matching',
      description:
        'Advanced algorithms considering skills, experience, and team dynamics.',
      icon: BrainCircuit,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'neural network',
    },
    {
      title: 'Multi-Criteria Optimization',
      description:
        'Balance competing requirements for optimal team composition.',
      icon: Shuffle,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'balancing scales',
    },
    {
      title: 'Predictive Success Scoring',
      description:
        'Probability assessment of project success based on team fit.',
      icon: LineChart,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'success chart',
    },
    {
      title: 'Automated Conflict Resolution',
      description: 'Smart handling of resource allocation conflicts.',
      icon: FileWarning,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'conflict resolution',
    },
  ],
  'client-experience': [
    {
      title: 'Branded Client Portals',
      description: 'Custom dashboards with client-specific branding.',
      icon: Briefcase,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'branded dashboard',
    },
    {
      title: 'Real-Time Project Visibility',
      description: 'Live updates on project progress and team performance.',
      icon: UserCog,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'live dashboard',
    },
    {
      title: 'Integrated Communication',
      description:
        'Built-in messaging, video conferencing, and collaboration tools.',
      icon: Users,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'chat interface',
    },
    {
      title: 'Transparent Billing',
      description:
        'Clear visibility into resource utilization and billing information.',
      icon: DollarSign,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'invoice finances',
    },
  ],
  'business-intelligence': [
    {
      title: 'Predictive Analytics',
      description:
        'Demand forecasting, attrition prediction, and revenue optimization.',
      icon: TrendingUp,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'predictive chart',
    },
    {
      title: 'Performance Dashboards',
      description:
        'Real-time KPIs with automated insights and recommendations.',
      icon: BarChart,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'kpi dashboard',
    },
    {
      title: 'Strategic Planning Tools',
      description:
        'Long-term workforce planning and market opportunity analysis.',
      icon: BrainCircuit,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'strategy board',
    },
    {
      title: 'Custom Reporting',
      description: 'Role-specific reports with export capabilities.',
      icon: Database,
      image: 'https://placehold.co/1200x800.png',
      dataAiHint: 'report builder',
    },
  ],
};

type TabCategory = keyof typeof featuresData;

function FeatureTabContent({ category }: { category: TabCategory }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = featuresData[category][activeIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mt-8">
      <div className="flex flex-col gap-4 lg:col-span-1">
        {featuresData[category].map((feature, index) => (
          <button
            key={feature.title}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'p-4 rounded-lg text-left transition-all duration-300',
              activeIndex === index
                ? 'bg-primary/10 ring-2 ring-primary'
                : 'hover:bg-muted/50'
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex-shrink-0 p-2 rounded-full transition-colors',
                  activeIndex === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  {feature.title}
                </h4>
                <p
                  className={cn(
                    'text-sm transition-colors',
                    activeIndex === index
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="lg:col-span-2 relative h-[450px] overflow-hidden rounded-xl bg-muted/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={activeFeature.image}
              alt={activeFeature.title}
              width={1200}
              height={800}
              data-ai-hint={activeFeature.dataAiHint}
              className="object-cover w-full h-full rounded-xl border"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features That Drive Results
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            Explore the core capabilities that make ResourceWise the ultimate
            platform for technical consultancies.
          </p>
        </div>

        <Tabs defaultValue="resource-management" className="mt-12">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="resource-management">
              Smart Resource Management
            </TabsTrigger>
            <TabsTrigger value="project-matching">
              Intelligent Project Matching
            </TabsTrigger>
            <TabsTrigger value="client-experience">
              Client Experience Platform
            </TabsTrigger>
            <TabsTrigger value="business-intelligence">
              Business Intelligence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resource-management">
            <FeatureTabContent category="resource-management" />
          </TabsContent>
          <TabsContent value="project-matching">
            <FeatureTabContent category="project-matching" />
          </TabsContent>
          <TabsContent value="client-experience">
            <FeatureTabContent category="client-experience" />
          </TabsContent>
          <TabsContent value="business-intelligence">
            <FeatureTabContent category="business-intelligence" />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
