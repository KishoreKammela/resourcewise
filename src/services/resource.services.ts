'use server';

import { db } from '@/lib/firebase-admin';
import type { Resource } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

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
    resources.push({ id: doc.id, ...doc.data() } as Resource);
  });

  return resources;
}

/**
 * Retrieves a single resource by its ID.
 * @param resourceId The ID of the resource.
 * @returns A promise that resolves to a Resource object or null if not found.
 */
export async function getResourceById(
  resourceId: string
): Promise<Resource | null> {
  const resourceRef = db.collection('resources').doc(resourceId);
  const doc = await resourceRef.get();

  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() } as Resource;
}
