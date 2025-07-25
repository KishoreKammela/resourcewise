'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateClientAction } from '@/app/actions/clientActions';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Client } from '@/lib/types';
import { toDate } from '@/lib/helpers/date-helpers';

const clientFormSchema = z.object({
  clientCode: z.string().optional(),
  basicInfo: z.object({
    clientName: z.string().min(1, 'Client name is required.'),
    clientType: z.string().optional(),
    industry: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    logoUrl: z.string().url().optional().or(z.literal('')),
  }),
  contactInfo: z.object({
    primary: z.object({
      name: z.string().min(1, 'Contact name is required.'),
      email: z.string().email('Invalid email address.'),
      phone: z.string().optional(),
      designation: z.string().optional(),
    }),
  }),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    timezone: z.string().optional(),
  }),
  relationship: z.object({
    accountManagerId: z.string().optional(),
    status: z.string().min(1, 'Status is required.'),
    startDate: z.date().optional(),
    healthScore: z.coerce.number().min(1).max(10).optional(),
  }),
  commercial: z.object({
    billingCurrency: z.string().min(1, 'Currency is required.'),
  }),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

function clientToFormValues(client: Client): ClientFormValues {
  return {
    clientCode: client.clientCode || '',
    basicInfo: {
      clientName: client.basicInfo?.clientName || '',
      clientType: client.basicInfo?.clientType || '',
      industry: client.basicInfo?.industry || '',
      website: client.basicInfo?.website || '',
      logoUrl: client.basicInfo?.logoUrl || '',
    },
    contactInfo: {
      primary: {
        name: client.contactInfo?.primary?.name || '',
        email: client.contactInfo?.primary?.email || '',
        phone: client.contactInfo?.primary?.phone || '',
        designation: client.contactInfo?.primary?.designation || '',
      },
    },
    address: {
      line1: client.address?.line1 || '',
      line2: client.address?.line2 || '',
      city: client.address?.city || '',
      state: client.address?.state || '',
      country: client.address?.country || '',
      postalCode: client.address?.postalCode || '',
      timezone: client.address?.timezone || '',
    },
    relationship: {
      accountManagerId: client.relationship?.accountManagerId || '',
      status: client.relationship?.status || 'Active',
      startDate: toDate(client.relationship?.startDate),
      healthScore: client.relationship?.healthScore || 5,
    },
    commercial: {
      billingCurrency: client.commercial?.billingCurrency || 'USD',
    },
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 animate-spin" />}
      Save Changes
    </Button>
  );
}

export function EditClientForm({ client }: { client: Client }) {
  const { toast } = useToast();
  const { companyProfile, user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = updateClientAction.bind(null, {
    clientId: client.id,
    companyId: companyProfile?.id ?? '',
    actorId: user?.uid ?? '',
  });

  const [state, formAction] = useActionState(boundAction, { success: false });

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: clientToFormValues(client),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Client Updated',
        description: 'The client details have been saved.',
      });
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error Updating Client',
        description: state.error,
      });
    }
  }, [state, toast]);

  if (!companyProfile || !user) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form ref={formRef} action={formAction} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="basicInfo.clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Code (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="ACME001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basicInfo.industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basicInfo.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://acme.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Primary Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactInfo.primary.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactInfo.primary.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane.smith@acme.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactInfo.primary.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactInfo.primary.designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Project Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relationship</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="relationship.status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commercial.billingCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relationship.startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Relationship Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <SubmitButton />
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
