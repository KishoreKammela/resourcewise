import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordPolicyProps {
  password?: string;
}

const policies = {
  minLength: {
    label: 'At least 8 characters',
    regex: /.{8,}/,
  },
  uppercase: {
    label: 'At least one uppercase letter',
    regex: /[A-Z]/,
  },
  lowercase: {
    label: 'At least one lowercase letter',
    regex: /[a-z]/,
  },
  number: {
    label: 'At least one number',
    regex: /[0-9]/,
  },
  specialChar: {
    label: 'At least one special character',
    regex: /[^A-Za-z0-9]/,
  },
};

export function PasswordPolicy({ password = '' }: PasswordPolicyProps) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/50 p-4 text-sm sm:grid-cols-2">
      {Object.values(policies).map((policy) => {
        const isValid = policy.regex.test(password);
        return (
          <div key={policy.label} className="flex items-center gap-2">
            {isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                'text-muted-foreground',
                isValid && 'font-medium text-foreground'
              )}
            >
              {policy.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
