'use server';

import { db } from '@/lib/firebase-admin';
import type { AuditLog } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Creates a new audit log entry in Firestore.
 * @param logData - The data for the audit log entry.
 */
export async function createAuditLog(
  logData: Omit<AuditLog, 'id' | 'timestamp'>
): Promise<void> {
  const auditLogRef = db.collection('auditLogs').doc(); // Auto-generate ID

  const newLog: Omit<AuditLog, 'id'> = {
    ...logData,
    timestamp: FieldValue.serverTimestamp() as any,
  };

  await auditLogRef.set(newLog);
}
