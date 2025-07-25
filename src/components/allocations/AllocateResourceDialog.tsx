'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormStatus } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Project, Resource } from '@/lib/types';
import { createAllocationAction } from '@/app/actions/allocationActions';

const allocationFormSchema = z.object({
  resourceId: z.string().min(1, 'A resource must be selected.'),
  roleInProject: z.string().min(1, 'Role is required.'),
  allocationPercentage: z.coerce.number().min(1).max(100),
  startDate: z.date(),
  endDate: z.date().optional(),
});

type AllocationFormValues = z.infer<typeof allocationFormSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 animate-spin" />}
      Allocate
    </Button>
  );
}

export function AllocateResourceDialog({
  isOpen,
  setOpen,
  project,
  availableResources,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  project: Project;
  availableResources: Resource[];
}) {
  const { toast } = useToast();
  const { user, companyProfile } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = createAllocationAction.bind(null, {
    companyId: project.companyId,
    projectId: project.id,
    actorId: user?.uid ?? '',
  });

  const [state, formAction] = useActionState(boundAction, { success: false });

  const form = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationFormSchema),
    defaultValues: {
      resourceId: '',
      roleInProject: '',
      allocationPercentage: 100,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Resource Allocated',
        description: 'The resource has been assigned to the project.',
      });
      form.reset();
      setOpen(false);
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error Allocating Resource',
        description: state.error,
      });
    }
  }, [state, toast, setOpen, form]);

  if (!companyProfile || !user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Allocate Resource to {project.basicInfo.projectName}
          </DialogTitle>
          <DialogDescription>
            Assign a resource from your talent pool to this project.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              ref={formRef}
              action={formAction}
              className="space-y-4"
              onSubmit={form.handleSubmit((data) => {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                  if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                  } else if (value) {
                    formData.append(key, String(value));
                  }
                });
                formAction(formData);
              })}
            >
              <FormField
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a resource" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableResources.map((resource) => (
                          <SelectItem key={resource.id} value={resource.id}>
                            {resource.personalInfo.firstName}{' '}
                            {resource.personalInfo.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleInProject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role in Project</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lead Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allocationPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocation Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date (Optional)</FormLabel>
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
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <SubmitButton />
              </DialogFooter>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
