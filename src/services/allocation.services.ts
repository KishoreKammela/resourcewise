'use server';

import { db } from '@/lib/firebase-admin';
import type { Allocation } from '@/lib/types';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

function serializeTimestamps(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeTimestamps);
  }
  if (typeof obj === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      newObj[key] = serializeTimestamps(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function createAllocation(
  data: Omit<Allocation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const allocationRef = db.collection('allocations').doc();
  const allocationId = allocationRef.id;

  const newAllocation = {
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await allocationRef.set(newAllocation);

  return allocationId;
}

export async function getProjectAllocations(
  projectId: string,
  options: { serialize: boolean } = { serialize: false }
): Promise<Allocation[]> {
  const snapshot = await db
    .collection('allocations')
    .where('projectId', '==', projectId)
    .where('isActive', '==', true)
    .get();

  if (snapshot.empty) {
    return [];
  }

  const allocations: Allocation[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (options.serialize) {
      allocations.push({
        id: doc.id,
        ...serializeTimestamps(data),
      } as Allocation);
    } else {
      allocations.push({ id: doc.id, ...data } as Allocation);
    }
  });

  return allocations;
}
