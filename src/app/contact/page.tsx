import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/public/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | ResourceWise',
  description:
    'Get in touch with the ResourceWise team. Schedule a demo, ask a question, or learn more about how we can help your technical consultancy.',
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
