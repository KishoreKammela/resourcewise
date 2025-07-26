'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqData = [
  {
    question: 'How does the AI matching actually work?',
    answer:
      "Our platform uses GenKit, powered by Google's Gemini API. It goes beyond simple keyword matching by understanding the context and semantics of your project requirements and your resources' skills. It analyzes past project performance, team dynamics, and even inferred soft skills from resumes to recommend the optimal team composition for project success.",
  },
  {
    question: 'Can we integrate with our existing tools?',
    answer:
      'Yes. ResourceWise is designed to be the central hub of your operations. We offer robust API access and are building a growing library of pre-built integrations for popular tools like Jira, Slack, GitHub, and major accounting software. This ensures a seamless workflow and a single source of truth.',
  },
  {
    question: 'How do you ensure data security and compliance?',
    answer:
      "We are built on Firebase, leveraging Google's world-class security infrastructure. All data is encrypted at rest and in transit. Our multi-tenant architecture ensures strict data isolation for each company. We adhere to GDPR and CCPA standards and can provide specific compliance documentation for enterprise clients.",
  },
  {
    question: "What's the typical implementation timeline?",
    answer:
      'For our Pro plan, you can be up and running in a single day. The onboarding process is guided and intuitive. For Enterprise clients requiring custom integrations, a typical implementation roadmap is 2-4 weeks. Our customer success team works closely with you to ensure a smooth transition.',
  },
  {
    question: 'How do you calculate ROI and success metrics?',
    answer:
      'We track several key performance indicators (KPIs) to measure success, including resource utilization rate, time-to-fill for project roles, project profitability, and client satisfaction scores. We provide dashboards to visualize these metrics and help you benchmark your performance against industry standards to calculate a clear ROI.',
  },
];

export function FaqSection() {
  return (
    <section className="py-16 sm:py-24 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We have answers. If you don&apos;t see your question
            here, feel free to reach out to us.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
