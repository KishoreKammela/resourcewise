'use server';

import { db } from '@/lib/firebase-admin';
import type { Client } from '@/lib/types';
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
 * Creates a new client document in Firestore.
 * @param data - The data for the new client.
 * @returns The ID of the newly created client.
 */
export async function createClient(
  data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const clientRef = db.collection('clients').doc();
  const clientId = clientRef.id;

  const newClient = {
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await clientRef.set(newClient);

  return clientId;
}

/**
 * Updates an existing client document in Firestore.
 * @param clientId - The client's unique ID.
 * @param data - The client data to update.
 */
export async function updateClient(
  clientId: string,
  data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const clientRef = db.collection('clients').doc(clientId);

  const updateData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await clientRef.update(updateData);
}

/**
 * Retrieves all clients for a specific company.
 * @param companyId The ID of the company.
 * @returns A promise that resolves to an array of Client objects.
 */
export async function getClientsByCompany(
  companyId: string
): Promise<Client[]> {
  const snapshot = await db
    .collection('clients')
    .where('companyId', '==', companyId)
    .orderBy('createdAt', 'desc')
    .get();

  if (snapshot.empty) {
    return [];
  }

  const clients: Client[] = [];
  snapshot.forEach((doc) => {
    clients.push({ id: doc.id, ...(doc.data() as Omit<Client, 'id'>) });
  });

  return clients;
}

/**
 * Retrieves a single client by its ID.
 * @param clientId The ID of the client.
 * @param options - Optional parameters.
 * @param options.serialize - Whether to serialize Firestore Timestamps to ISO strings.
 * @returns A promise that resolves to a Client object or null if not found.
 */
export async function getClientById(
  clientId: string,
  options: { serialize: boolean } = { serialize: false }
): Promise<Client | null> {
  const clientRef = db.collection('clients').doc(clientId);
  const doc = await clientRef.get();

  if (!doc.exists) {
    return null;
  }

  const clientData = doc.data() as Omit<Client, 'id'>;

  if (options.serialize) {
    const serializedData = serializeTimestamps(clientData);
    return { id: doc.id, ...serializedData };
  }

  return { id: doc.id, ...clientData };
}

export async function getPaginatedClients({
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
}): Promise<{ clients: Client[]; totalCount: number }> {
  let query: FirebaseFirestore.Query = db
    .collection('clients')
    .where('companyId', '==', companyId);

  if (filters.name) {
    query = query
      .where('basicInfo.clientName', '>=', filters.name)
      .where('basicInfo.clientName', '<=', `${filters.name}\uf8ff`);
  }

  const countSnapshot = await query.count().get();
  const totalCount = countSnapshot.data().count;

  if (sort) {
    const [sortField, sortDirection] = sort.split('.');
    const direction = sortDirection === 'desc' ? 'desc' : 'asc';
    const fieldPathMap: { [key: string]: string } = {
      name: 'basicInfo.clientName',
      contact: 'contactInfo.primary.name',
      status: 'relationship.status',
    };
    const firestoreField = fieldPathMap[sortField] || 'basicInfo.clientName';
    query = query.orderBy(firestoreField, direction);
  } else {
    query = query.orderBy('createdAt', 'desc');
  }

  const offset = (page - 1) * perPage;
  query = query.limit(perPage).offset(offset);

  const snapshot = await query.get();

  const clients = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...serializeTimestamps(doc.data()) }) as Client
  );

  return { clients, totalCount };
}
