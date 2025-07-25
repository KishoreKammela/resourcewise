'use server';

import { db } from '@/lib/firebase-admin';
import type { Resource } from '@/lib/types';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Helper function to recursively convert Timestamps to serializable strings
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

/**
 * Creates a new resource document in Firestore.
 * @param data - The data for the new resource.
 * @returns The ID of the newly created resource.
 */
export async function createResource(
  data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const resourceRef = db.collection('resources').doc();
  const resourceId = resourceRef.id;

  const newResource = {
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await resourceRef.set(newResource);

  return resourceId;
}

/**
 * Updates an existing resource document in Firestore.
 * @param resourceId - The resource's unique ID.
 * @param data - The resource data to update.
 */
export async function updateResource(
  resourceId: string,
  data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const resourceRef = db.collection('resources').doc(resourceId);

  const updateData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await resourceRef.update(updateData);
}

/**
 * Retrieves all resources for a specific company.
 * @param companyId The ID of the company.
 * @returns A promise that resolves to an array of Resource objects.
 */
export async function getResourcesByCompany(
  companyId: string
): Promise<Resource[]> {
  const snapshot = await db
    .collection('resources')
    .where('companyId', '==', companyId)
    .orderBy('createdAt', 'desc')
    .get();

  if (snapshot.empty) {
    return [];
  }

  const resources: Resource[] = [];
  snapshot.forEach((doc) => {
    resources.push({ ...(doc.data() as Resource), id: doc.id });
  });

  return resources;
}

/**
 * Retrieves a single resource by its ID.
 * @param resourceId The ID of the resource.
 * @param options - Optional parameters.
 * @param options.serialize - Whether to serialize Firestore Timestamps to ISO strings.
 * @returns A promise that resolves to a Resource object or null if not found.
 */
export async function getResourceById(
  resourceId: string,
  options: { serialize: boolean } = { serialize: false }
): Promise<Resource | null> {
  const resourceRef = db.collection('resources').doc(resourceId);
  const doc = await resourceRef.get();

  if (!doc.exists) {
    return null;
  }

  const resourceData = doc.data() as Omit<Resource, 'id'>;

  if (options.serialize) {
    const serializedData = serializeTimestamps(resourceData);
    return { id: doc.id, ...serializedData };
  }

  return { id: doc.id, ...resourceData };
}
