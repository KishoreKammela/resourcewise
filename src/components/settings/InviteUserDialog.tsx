'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Check } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { invitePlatformUserAction } from '@/app/actions/invitationActions';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';

const inviteUserSchema = z.object({
  firstName: z.string().min(2, { message: 'First name is required.' }),
  lastName: z.string().min(2, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  role: z.string().min(1, { message: 'Role is required.' }),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Send Invitation
    </Button>
  );
}

export function InviteUserDialog({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [state, formAction] = useActionState(
    invitePlatformUserAction.bind(null, user?.uid ?? ''),
    { success: false }
  );

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (state.success && state.inviteLink) {
      setInviteLink(state.inviteLink);
      toast({
        title: 'Invitation Link Generated',
        description: 'You can now copy the link and share it.',
      });
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Invitation Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    form.reset();
    setInviteLink(null);
    setOpen(false);
  };

  if (inviteLink) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitation Link Ready</DialogTitle>
          <DialogDescription>
            Copy this link and send it to the user you want to invite. The link
            is valid for 7 days.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 rounded-md border bg-muted p-2">
            <Input
              id="invite-link"
              value={inviteLink}
              readOnly
              className="flex-1"
            />
            <Button size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Once the user accepts the invitation and creates an account, they
            will appear in the users list.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Invite New Platform User</DialogTitle>
        <DialogDescription>
          Enter the details of the user you want to invite. An invitation link
          will be generated.
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name={field.name}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="supportAgent">Support Agent</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="dataAnalyst">Data Analyst</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
}
