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
import { Checkbox } from '../ui/checkbox';

const clientFormSchema = z.object({
  clientCode: z.string().optional(),
  basicInfo: z.object({
    clientName: z.string().min(1, 'Client name is required.'),
    clientType: z.string().optional(),
    industry: z.string().optional(),
    companySize: z.string().optional(),
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
  businessInfo: z.object({
    registrationNumber: z.string().optional(),
    taxIdentificationNumber: z.string().optional(),
    annualRevenueRange: z.string().optional(),
    employeeCountRange: z.string().optional(),
    businessModel: z.string().optional(),
  }),
  relationship: z.object({
    accountManagerId: z.string().optional(),
    status: z.string().min(1, 'Status is required.'),
    startDate: z.date().optional(),
    healthScore: z.coerce.number().min(1).max(5).optional(),
    satisfactionRating: z.coerce.number().min(1).max(5).optional(),
  }),
  commercial: z.object({
    contractType: z.string().optional(),
    paymentTerms: z.string().optional(),
    billingCurrency: z.string().min(1, 'Currency is required.'),
    standardBillingRate: z.coerce.number().optional(),
    discountPercentage: z.coerce.number().optional(),
    creditLimit: z.coerce.number().optional(),
    paymentHistoryRating: z.string().optional(),
  }),
  contract: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    value: z.coerce.number().optional(),
    documentUrl: z.string().url().optional().or(z.literal('')),
    ndaSigned: z.boolean().default(false),
    ndaExpiryDate: z.date().optional(),
    msaSigned: z.boolean().default(false),
    msaExpiryDate: z.date().optional(),
  }),
  communication: z.object({
    preferredMethod: z.string().optional(),
    frequency: z.string().optional(),
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
      companySize: client.basicInfo?.companySize || '',
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
    businessInfo: {
      registrationNumber: client.businessInfo?.registrationNumber || '',
      taxIdentificationNumber:
        client.businessInfo?.taxIdentificationNumber || '',
      annualRevenueRange: client.businessInfo?.annualRevenueRange || '',
      employeeCountRange: client.businessInfo?.employeeCountRange || '',
      businessModel: client.businessInfo?.businessModel || '',
    },
    relationship: {
      accountManagerId: client.relationship?.accountManagerId || '',
      status: client.relationship?.status || 'Active',
      startDate: toDate(client.relationship?.startDate),
      healthScore: client.relationship?.healthScore || 3,
      satisfactionRating: client.relationship?.satisfactionRating || 3,
    },
    commercial: {
      contractType: client.commercial?.contractType || '',
      paymentTerms: client.commercial?.paymentTerms || '',
      billingCurrency: client.commercial?.billingCurrency || 'USD',
      standardBillingRate: client.commercial?.standardBillingRate,
      discountPercentage: client.commercial?.discountPercentage,
      creditLimit: client.commercial?.creditLimit,
      paymentHistoryRating: client.commercial?.paymentHistoryRating || '',
    },
    contract: {
      startDate: toDate(client.contract?.startDate),
      endDate: toDate(client.contract?.endDate),
      value: client.contract?.value,
      documentUrl: client.contract?.documentUrl || '',
      ndaSigned: client.contract?.ndaSigned || false,
      ndaExpiryDate: toDate(client.contract?.ndaExpiryDate),
      msaSigned: client.contract?.msaSigned || false,
      msaExpiryDate: toDate(client.contract?.msaExpiryDate),
    },
    communication: {
      preferredMethod: client.communication?.preferredMethod || '',
      frequency: client.communication?.frequency || '',
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
                name="basicInfo.clientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Direct Client">
                          Direct Client
                        </SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Subcontractor">
                          Subcontractor
                        </SelectItem>
                        <SelectItem value="Internal">Internal</SelectItem>
                      </SelectContent>
                    </Select>
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
                name="basicInfo.companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Startup">Startup (1-50)</SelectItem>
                        <SelectItem value="SME">SME (51-500)</SelectItem>
                        <SelectItem value="Enterprise">
                          Enterprise (501-5000)
                        </SelectItem>
                        <SelectItem value="Large Enterprise">
                          Large Enterprise (5000+)
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="businessInfo.registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessInfo.taxIdentificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID Number (TIN)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessInfo.annualRevenueRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Revenue Range</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select revenue range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0-1M">0 - 1M USD</SelectItem>
                        <SelectItem value="1M-10M">1M - 10M USD</SelectItem>
                        <SelectItem value="10M-50M">10M - 50M USD</SelectItem>
                        <SelectItem value="50M+">50M+ USD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessInfo.businessModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="B2B">B2B</SelectItem>
                        <SelectItem value="B2C">B2C</SelectItem>
                        <SelectItem value="B2B2C">B2B2C</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="Prospect">Prospect</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
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
              <FormField
                control={form.control}
                name="relationship.healthScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health Score (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relationship.satisfactionRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Satisfaction Rating (1-5)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commercial Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="commercial.paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="Advance">Advance</SelectItem>
                        <SelectItem value="Milestone-based">
                          Milestone-based
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract & Legal</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contract.ndaSigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>NDA Signed?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contract.msaSigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>MSA Signed?</FormLabel>
                    </div>
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
