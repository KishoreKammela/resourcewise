import { format } from 'date-fns';
import { Timestamp } from '@/lib/types';

/**
 * Converts a Timestamp (from either Firebase client or admin SDK), Date, or string to a Date object
 */
export function toDate(
  date?: Timestamp | Date | string | undefined
): Date | undefined {
  if (!date) {
    return undefined;
  }

  // If it's already a Date object
  if (date instanceof Date) {
    return date;
  }

  // If it's a string, convert to Date
  if (typeof date === 'string') {
    return new Date(date);
  }

  // Handle both Firebase client and admin Timestamp types
  // Both have a toDate() method but with different type signatures
  if (date && typeof date === 'object' && 'toDate' in date) {
    return date.toDate();
  }

  return undefined;
}

/**
 * Formats a date for display
 */
export function formatDate(
  date?: Timestamp | Date | string | undefined,
  formatString: string = 'PPP'
): string | null {
  if (!date) {
    return null;
  }

  const dateObj = toDate(date);
  if (!dateObj || isNaN(dateObj.getTime())) {
    return null;
  }

  return format(dateObj, formatString);
}
