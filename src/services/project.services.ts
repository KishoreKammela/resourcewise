'use server';

import { db } from '@/lib/firebase-admin';
import type { Project } from '@/lib/types';
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
 * Creates a new project document in Firestore.
 * @param data - The data for the new project.
 * @returns The ID of the newly created project.
 */
export async function createProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const projectRef = db.collection('projects').doc();
  const projectId = projectRef.id;

  const newProject = {
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await projectRef.set(newProject);

  return projectId;
}

/**
 * Updates an existing project document in Firestore.
 * @param projectId - The project's unique ID.
 * @param data - The project data to update.
 */
export async function updateProject(
  projectId: string,
  data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const projectRef = db.collection('projects').doc(projectId);

  const updateData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };

  await projectRef.update(updateData);
}

/**
 * Retrieves all projects for a specific company.
 * @param companyId The ID of the company.
 * @param options Optional parameters.
 * @returns A promise that resolves to an array of Project objects.
 */
export async function getProjectsByCompany(
  companyId: string,
  options: { serialize: boolean } = { serialize: false }
): Promise<Project[]> {
  const snapshot = await db
    .collection('projects')
    .where('companyId', '==', companyId)
    .orderBy('createdAt', 'desc')
    .get();

  if (snapshot.empty) {
    return [];
  }

  const projects: Project[] = [];
  snapshot.forEach((doc) => {
    const projectData = doc.data() as Omit<Project, 'id'>;
    if (options.serialize) {
      const serializedData = serializeTimestamps(projectData);
      projects.push({ id: doc.id, ...serializedData, clientName: '' });
    } else {
      projects.push({ id: doc.id, ...projectData, clientName: '' });
    }
  });

  return projects;
}

/**
 * Retrieves a single project by its ID.
 * @param projectId The ID of the project.
 * @param options - Optional parameters.
 * @param options.serialize - Whether to serialize Firestore Timestamps to ISO strings.
 * @returns A promise that resolves to a Project object or null if not found.
 */
export async function getProjectById(
  projectId: string,
  options: { serialize: boolean } = { serialize: false }
): Promise<Project | null> {
  const projectRef = db.collection('projects').doc(projectId);
  const doc = await projectRef.get();

  if (!doc.exists) {
    return null;
  }

  const projectData = doc.data() as Omit<Project, 'id'>;

  if (options.serialize) {
    const serializedData = serializeTimestamps(projectData);
    return { id: doc.id, ...serializedData };
  }

  return { id: doc.id, ...projectData };
}

export async function getPaginatedProjects({
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
}): Promise<{ projects: Project[]; totalCount: number }> {
  let query: FirebaseFirestore.Query = db
    .collection('projects')
    .where('companyId', '==', companyId);

  if (filters.name) {
    query = query
      .where('basicInfo.projectName', '>=', filters.name)
      .where('basicInfo.projectName', '<=', `${filters.name}\uf8ff`);
  }

  const countSnapshot = await query.count().get();
  const totalCount = countSnapshot.data().count;

  if (sort) {
    const [sortField, sortDirection] = sort.split('.');
    const direction = sortDirection === 'desc' ? 'desc' : 'asc';
    const fieldPathMap: { [key: string]: string } = {
      name: 'basicInfo.projectName',
      'status.projectStatus': 'status.projectStatus',
      'timeline.plannedEndDate': 'timeline.plannedEndDate',
    };
    const firestoreField = fieldPathMap[sortField] || 'basicInfo.projectName';
    query = query.orderBy(firestoreField, direction);
  } else {
    query = query.orderBy('createdAt', 'desc');
  }

  const offset = (page - 1) * perPage;
  query = query.limit(perPage).offset(offset);

  const snapshot = await query.get();

  const projects = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...serializeTimestamps(doc.data()) }) as Project
  );

  return { projects, totalCount };
}
