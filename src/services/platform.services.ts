'use server';

import { db } from '@/lib/firebase-admin';
import type { PlatformConfiguration } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

const CONFIG_COLLECTION = 'platformConfiguration';

/**
 * Retrieves a specific platform configuration document.
 * @param configId The ID of the configuration document (e.g., 'sessionManagement').
 * @returns The configuration data or null if not found.
 */
export async function getPlatformConfig(
  configId: string
): Promise<PlatformConfiguration | null> {
  const docRef = db.collection(CONFIG_COLLECTION).doc(configId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return { id: docSnap.id, ...docSnap.data() } as PlatformConfiguration;
  } else {
    // Return default values if the document doesn't exist
    if (configId === 'sessionManagement') {
      return {
        id: 'sessionManagement',
        inactivityTimeoutMinutes: 15,
        warningCountdownSeconds: 60,
      };
    }
    return null;
  }
}

/**
 * Updates a platform configuration document.
 * @param configId The ID of the configuration document.
 * @param data The data to update.
 */
export async function updatePlatformConfig(
  configId: string,
  data: Partial<Omit<PlatformConfiguration, 'id'>>
): Promise<void> {
  const docRef = db.collection(CONFIG_COLLECTION).doc(configId);
  const updateData = {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };
  await docRef.set(updateData, { merge: true });
}
