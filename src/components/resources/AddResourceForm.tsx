'use client';

import { useEffect, useRef } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
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
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createResourceAction } from '@/app/actions/resourceActions';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const resourceFormSchema = z.object({
  resourceCode: z.string().optional(),
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email('Invalid email address.').optional().or(z.literal('')),
    phone: z.string().optional(),
    profilePictureUrl: z.string().url().optional().or(z.literal('')),
    dateOfBirth: z.date().optional(),
    gender: z.string().optional(),
    nationality: z.string().optional(),
    languagesSpoken: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)),
  }),
  address: z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  professionalInfo: z.object({
    designation: z.string().optional(),
    department: z.string().optional(),
    practiceArea: z.string().optional(),
    seniorityLevel: z.string().optional(),
    employmentType: z.string().min(1, 'Employment type is required.'),
  }),
  employmentDetails: z.object({
    joiningDate: z.date().optional(),
    probationEndDate: z.date().optional(),
    reportingManagerId: z.string().optional(),
    workLocation: z.string().optional(),
    workMode: z.string().optional(),
    status: z.string().min(1, 'Employment status is required.'),
  }),
  experience: z.object({
    totalYears: z.coerce.number().optional().nullable(),
    yearsWithCompany: z.coerce.number().optional().nullable(),
    previousCompanies: z.array(z.object({
      companyName: z.string().min(1, "Cannot be empty"),
      role: z.string().min(1, "Cannot be empty"),
      duration: z.string().min(1, "Cannot be empty"),
    })).optional(),
    education: z.array(z.object({
      degree: z.string().min(1, "Cannot be empty"),
      institution: z.string().min(1, "Cannot be empty"),
      year: z.coerce.number().min(1900, "Invalid year"),
    })).optional(),
    certifications: z.array(z.object({
        name: z.string().min(1, "Cannot be empty"),
        issuingOrganization: z.string().min(1, "Cannot be empty"),
    })).optional(),
  }),
  skills: z.object({
    technical: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)),
    soft: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)),
  }),
  availability: z.object({
    status: z.string().min(1, 'Availability status is required.'),
    currentAllocationPercentage: z.coerce.number().min(0).max(100),
    maxAllocationPercentage: z.coerce.number().min(0).max(100),
    noticePeriodDays: z.coerce.number().optional().nullable(),
  }),
  financial: z.object({
    hourlyRate: z.coerce.number().optional().nullable(),
    dailyRate: z.coerce.number().optional().nullable(),
    monthlySalary: z.coerce.number().optional().nullable(),
    currency: z.string().min(1, 'Currency is required.'),
    billingRateClient: z.coerce.number().optional().nullable(),
    costCenter: z.string().optional(),
  }),
  performance: z.object({
    rating: z.coerce.number().min(1).max(5).optional().nullable(),
    careerGoals: z.string().optional(),
    developmentAreas: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)),
  }),
  externalProfiles: z.object({
    portfolioUrl: z.string().url().optional().or(z.literal('')),
    linkedinProfile: z.string().url().optional().or(z.literal('')),
    githubProfile: z.string().url().optional().or(z.literal('')),
  }),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 animate-spin" />}
      Add Resource
    </Button>
  );
}

export function AddResourceForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { companyProfile, user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = createResourceAction.bind(null, {
    companyId: companyProfile?.id ?? '',
    actorId: user?.uid ?? '',
  });

  const [state, formAction] = useActionState(boundAction, { success: false });

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      resourceCode: '',
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        profilePictureUrl: '',
        gender: '',
        nationality: '',
        languagesSpoken: [],
      },
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
      professionalInfo: {
        designation: '',
        department: '',
        practiceArea: '',
        seniorityLevel: '',
        employmentType: '',
      },
      employmentDetails: {
        reportingManagerId: '',
        workLocation: '',
        workMode: '',
        status: 'active',
      },
      experience: {
        totalYears: null,
        yearsWithCompany: null,
        previousCompanies: [],
        education: [],
        certifications: [],
      },
      skills: {
        technical: [],
        soft: [],
      },
      availability: {
        status: 'available',
        currentAllocationPercentage: 0,
        maxAllocationPercentage: 100,
        noticePeriodDays: null,
      },
      financial: {
        currency: companyProfile?.settings?.currency || 'USD',
        hourlyRate: null,
        dailyRate: null,
        monthlySalary: null,
        billingRateClient: null,
        costCenter: '',
      },
      performance: {
        rating: null,
        careerGoals: '',
        developmentAreas: [],
      },
      externalProfiles: {
        portfolioUrl: '',
        linkedinProfile: '',
        githubProfile: '',
      },
    },
    mode: 'onBlur',
  });
  
  const { fields: companyFields, append: appendCompany, remove: removeCompany } = useFieldArray({ control: form.control, name: "experience.previousCompanies" });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control: form.control, name: "experience.education" });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control: form.control, name: "experience.certifications" });

  useEffect(() => {
    if (state.success && state.resourceId) {
      toast({
        title: 'Resource Added',
        description: 'The new resource has been added to your talent pool.',
      });
      router.push('/resources');
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error Adding Resource',
        description: state.error,
      });
    }
  }, [state, router, toast]);

  if (!companyProfile || !user) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form ref={formRef} action={formAction} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Core Identification</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="resourceCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Code (Optional)</FormLabel>
                  <FormControl><Input placeholder="Unique identifier, e.g., EMP001" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="personalInfo.profilePictureUrl" render={({ field }) => (
                <FormItem><FormLabel>Profile Picture URL (Optional)</FormLabel><FormControl><Input placeholder="https://example.com/photo.png" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="personalInfo.firstName" render={({ field }) => (
                  <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.lastName" render={({ field }) => (
                  <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.email" render={({ field }) => (
                  <FormItem><FormLabel>Email (Optional)</FormLabel><FormControl><Input type="email" placeholder="john.doe@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input placeholder="+1234567890" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.dateOfBirth" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Date of Birth (Optional)</FormLabel>
                    <Popover><PopoverTrigger asChild>
                      <FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl>
                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                    </PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem><SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="personalInfo.nationality" render={({ field }) => (
                  <FormItem><FormLabel>Nationality (Optional)</FormLabel><FormControl><Input placeholder="e.g., American" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="personalInfo.languagesSpoken" render={({ field }) => (
                  <FormItem><FormLabel>Languages Spoken</FormLabel><FormControl><Input placeholder="English, Spanish, French" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader><CardTitle>Address (Optional)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="address.line1" render={({ field }) => (<FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
              <FormField control={form.control} name="address.line2" render={({ field }) => (<FormItem><FormLabel>Address Line 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="address.city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="address.state" render={({ field }) => (<FormItem><FormLabel>State/Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="address.country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="address.postalCode" render={({ field }) => (<FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader><CardTitle>Professional &amp; Employment Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <FormField control={form.control} name="professionalInfo.designation" render={({ field }) => (
                    <FormItem><FormLabel>Designation (Optional)</FormLabel><FormControl><Input placeholder="e.g., Senior Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="professionalInfo.department" render={({ field }) => (
                    <FormItem><FormLabel>Department (Optional)</FormLabel><FormControl><Input placeholder="e.g., Engineering" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="professionalInfo.practiceArea" render={({ field }) => (
                    <FormItem><FormLabel>Practice Area (Optional)</FormLabel><FormControl><Input placeholder="e.g., Cloud & DevOps" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="professionalInfo.seniorityLevel" render={({ field }) => (
                    <FormItem><FormLabel>Seniority (Optional)</FormLabel><FormControl><Input placeholder="e.g., Mid, Senior, Lead" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="professionalInfo.employmentType" render={({ field }) => (
                    <FormItem><FormLabel>Employment Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select employment type" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem><SelectItem value="part-time">Part-time</SelectItem><SelectItem value="contract">Contract</SelectItem><SelectItem value="freelance">Freelance</SelectItem><SelectItem value="intern">Intern</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="employmentDetails.status" render={({ field }) => (
                    <FormItem><FormLabel>Employment Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="employmentDetails.joiningDate" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Joining Date (Optional)</FormLabel>
                    <Popover><PopoverTrigger asChild>
                      <FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl>
                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="employmentDetails.probationEndDate" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Probation End Date (Optional)</FormLabel>
                    <Popover><PopoverTrigger asChild>
                      <FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button></FormControl>
                    </PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="employmentDetails.workLocation" render={({ field }) => (
                    <FormItem><FormLabel>Work Location (Optional)</FormLabel><FormControl><Input placeholder="e.g., New York Office" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="employmentDetails.workMode" render={({ field }) => (
                    <FormItem><FormLabel>Work Mode (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select work mode" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="remote">Remote</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem><SelectItem value="office">In-Office</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               <FormField control={form.control} name="skills.technical" render={({ field }) => (
                  <FormItem><FormLabel>Technical Skills</FormLabel><FormControl><Textarea placeholder="Comma-separated, e.g., React, Node.js, TypeScript" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
               <FormField control={form.control} name="skills.soft" render={({ field }) => (
                  <FormItem><FormLabel>Soft Skills</FormLabel><FormControl><Textarea placeholder="Comma-separated, e.g., Communication, Teamwork" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Availability &amp; Allocation</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="availability.status" render={({ field }) => (
                    <FormItem><FormLabel>Availability Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="available">Available</SelectItem><SelectItem value="partially-allocated">Partially Allocated</SelectItem><SelectItem value="fully-allocated">Fully Allocated</SelectItem><SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="availability.currentAllocationPercentage" render={({ field }) => (
                  <FormItem><FormLabel>Current Allocation %</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="availability.maxAllocationPercentage" render={({ field }) => (
                  <FormItem><FormLabel>Max Allocation %</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="availability.noticePeriodDays" render={({ field }) => (
                  <FormItem><FormLabel>Notice Period (Days)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader><CardTitle>Financials (Optional)</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="financial.currency" render={({ field }) => (
                    <FormItem><FormLabel>Currency</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl><SelectContent>
                      <SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="financial.hourlyRate" render={({ field }) => (
                  <FormItem><FormLabel>Internal Hourly Rate</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="financial.billingRateClient" render={({ field }) => (
                  <FormItem><FormLabel>Client Billing Rate</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="financial.costCenter" render={({ field }) => (
                  <FormItem><FormLabel>Cost Center</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Experience &amp; Education</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="experience.totalYears" render={({ field }) => (
                  <FormItem><FormLabel>Total Years of Experience</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                )} />
                
              <h4 className="font-medium pt-4">Work History</h4>
              {companyFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name={`experience.previousCompanies.${index}.companyName`} render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField control={form.control} name={`experience.previousCompanies.${index}.role`} render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField control={form.control} name={`experience.previousCompanies.${index}.duration`} render={({ field }) => (<FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="e.g., 2 years" {...field} /></FormControl><FormMessage/></FormItem>)} />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeCompany(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendCompany({ companyName: '', role: '', duration: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Experience</Button>
            
              <h4 className="font-medium pt-4">Education</h4>
               {educationFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name={`experience.education.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField control={form.control} name={`experience.education.${index}.institution`} render={({ field }) => (<FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField control={form.control} name={`experience.education.${index}.year`} render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>)} />
                  </div>
                   <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendEducation({ degree: '', institution: '', year: new Date().getFullYear() })}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>

              <h4 className="font-medium pt-4">Certifications</h4>
              {certFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name={`experience.certifications.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                    <FormField control={form.control} name={`experience.certifications.${index}.issuingOrganization`} render={({ field }) => (<FormItem><FormLabel>Issuing Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                  </div>
                   <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeCert(index)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendCert({ name: '', issuingOrganization: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Certification</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Performance &amp; External Profiles (Optional)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="performance.rating" render={({ field }) => (
                  <FormItem><FormLabel>Performance Rating (1-5)</FormLabel><FormControl><Input type="number" min="1" max="5" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="performance.careerGoals" render={({ field }) => (
                  <FormItem><FormLabel>Career Goals</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="performance.developmentAreas" render={({ field }) => (
                  <FormItem><FormLabel>Development Areas</FormLabel><FormControl><Textarea placeholder="Comma-separated skills or topics" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="externalProfiles.portfolioUrl" render={({ field }) => (
                  <FormItem><FormLabel>Portfolio URL</FormLabel><FormControl><Input type="url" placeholder="https://my-portfolio.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="externalProfiles.linkedinProfile" render={({ field }) => (
                  <FormItem><FormLabel>LinkedIn Profile URL</FormLabel><FormControl><Input type="url" placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="externalProfiles.githubProfile" render={({ field }) => (
                  <FormItem><FormLabel>GitHub Profile URL</FormLabel><FormControl><Input type="url" placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
