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
  companyId: string,
  options: { serialize: boolean } = { serialize: false }
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
    const resourceData = doc.data() as Omit<Resource, 'id'>;
    if (options.serialize) {
      const serializedData = serializeTimestamps(resourceData);
      resources.push({ id: doc.id, ...serializedData } as Resource);
    } else {
      resources.push({ ...(doc.data() as Resource), id: doc.id });
    }
  });

  return resources;
}

export async function getPaginatedResources({
  companyId,
  page,
  perPage,
  sort,
  filters,
}: {
  companyId: string;
  page: number;
  perPage: number;
  sort?: string;
  filters: Record<string, string | undefined>;
}): Promise<{ resources: Resource[]; totalCount: number }> {
  let query: FirebaseFirestore.Query = db
    .collection('resources')
    .where('companyId', '==', companyId);

  // Filtering
  if (filters.name) {
    // This is a simple prefix search. For full-text search, an external service like Algolia or Typesense is recommended.
    // We will search by first name for this example.
    query = query
      .where('personalInfo.firstName', '>=', filters.name)
      .where('personalInfo.firstName', '<=', `${filters.name}\uf8ff`);
  }
  if (filters.designation) {
    query = query.where(
      'professionalInfo.designation',
      '==',
      filters.designation
    );
  }
  if (filters.status) {
    query = query.where('availability.status', '==', filters.status);
  }

  // Count total documents for pagination before applying sorting and pagination to the query
  const countSnapshot = await query.count().get();
  const totalCount = countSnapshot.data().count;

  // Sorting
  if (sort) {
    const [sortField, sortDirection] = sort.split('.');
    const direction = sortDirection === 'desc' ? 'desc' : 'asc';
    // Map client-side field names to Firestore field paths
    const fieldPathMap: { [key: string]: string } = {
      name: 'personalInfo.firstName',
      designation: 'professionalInfo.designation',
      status: 'availability.status',
      allocation: 'availability.currentAllocationPercentage',
    };
    const firestoreField = fieldPathMap[sortField] || 'createdAt';
    query = query.orderBy(firestoreField, direction);
  } else {
    query = query.orderBy('createdAt', 'desc');
  }

  // Pagination
  const offset = (page - 1) * perPage;
  query = query.limit(perPage).offset(offset);

  const snapshot = await query.get();

  const resources = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...serializeTimestamps(doc.data()) }) as Resource
  );

  return { resources, totalCount };
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
    return { id: doc.id, ...serializedData } as Resource;
  }

  return { id: doc.id, ...resourceData };
}
