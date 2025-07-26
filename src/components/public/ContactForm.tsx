'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';

export function ContactForm() {
  return (
    <div className="container mx-auto py-12 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
          Contact Our Team
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We&apos;re here to answer your questions, provide demos, and help you
          get started.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl font-bold">Send us a message</h2>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below and we&apos;ll get back to you as soon as
            possible.
          </p>
          <Card className="mt-8">
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold">
            Schedule a Live Demo
          </h2>
          <p className="mt-2 text-muted-foreground">
            Pick a time that works for you and we&apos;ll give you a guided tour
            of the platform.
          </p>
          <Card className="mt-8 flex justify-center">
            <Calendar
              mode="single"
              className="p-3"
              classNames={{
                day_selected:
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
