'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Loader2, Wand2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { extractSkillsAction } from '@/app/actions/resourceActions';

const resourceFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  designation: z.string().min(2, 'Designation is required.'),
  skills: z
    .array(z.object({ value: z.string() }))
    .min(1, 'At least one skill is required.'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contractor']),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export function AddResourceForm() {
  const { toast } = useToast();
  const [isExtracting, setIsExtracting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState('');

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      name: '',
      email: '',
      designation: '',
      skills: [],
      employmentType: 'Full-time',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'skills',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleExtractSkills = async () => {
    if (!resumeFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a resume file to extract skills.',
      });
      return;
    }

    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(resumeFile);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        const result = await extractSkillsAction(dataUri);

        if (result.success && result.skills) {
          const newSkills = result.skills.filter(
            (skill) => !fields.some((field) => field.value === skill)
          );
          append(newSkills.map((skill) => ({ value: skill })));
          toast({
            title: 'Skills Extracted!',
            description: `${newSkills.length} new skills were added from the resume.`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Extraction Failed',
            description: result.error,
          });
        }
        setIsExtracting(false);
        setResumeFile(null);
        const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: 'Could not read the selected file.',
        });
        setIsExtracting(false);
      };
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Something went wrong during skill extraction.',
      });
      setIsExtracting(false);
    }
  };
  
  const handleAddSkill = () => {
    if (skillInput.trim() && !fields.some(field => field.value.toLowerCase() === skillInput.trim().toLowerCase())) {
        append({ value: skillInput.trim() });
        setSkillInput('');
    }
  }

  function onSubmit(data: ResourceFormValues) {
    console.log(data);
    toast({
      title: 'Resource Created!',
      description: `${data.name} has been added to the resource pool.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. jane.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contractor">Contractor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
          </div>
          <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
             <div className="space-y-1.5">
                <h3 className="font-semibold">Smart Skills Extractor</h3>
                <p className="text-sm text-muted-foreground">Upload a resume (PDF, DOCX) to automatically extract and add skills.</p>
             </div>
             <div className="space-y-2">
                <Input id="resume-upload" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx"/>
             </div>
             <Button type="button" onClick={handleExtractSkills} disabled={isExtracting || !resumeFile} className="w-full">
                {isExtracting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Extract Skills
              </Button>
          </div>
        </div>

        <Separator />

        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <FormLabel>Skills</FormLabel>
              <FormDescription>
                Add skills manually or use the extractor. Press Enter to add a skill.
              </FormDescription>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="e.g. React"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              <div className="pt-2">
                {fields.length > 0 && (
                    <div className="flex flex-wrap gap-2 rounded-lg border p-4 min-h-24">
                    {fields.map((field, index) => (
                      <Badge key={field.id} variant="secondary" className="text-sm">
                        {field.value}
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 rounded-full p-0.5 hover:bg-destructive/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Create Resource</Button>
        </div>
      </form>
    </Form>
  );
}
