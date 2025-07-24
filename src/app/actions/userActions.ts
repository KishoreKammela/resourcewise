'use server';

import type { UserProfileUpdate } from '@/lib/types';
import { updatePlatformUserDocument } from '@/services/user.services';
import { revalidatePath } from 'next/cache';

interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

export async function updateUserProfile(
  userId: string,
  prevState: any,
  formData: FormData
): Promise<UpdateProfileResult> {
  try {
    const dateOfBirthString = formData.get(
      'personalInfo.dateOfBirth'
    ) as string;
    const dateOfBirth = dateOfBirthString
      ? new Date(dateOfBirthString)
      : undefined;

    const updateData: UserProfileUpdate = {
      personalInfo: {
        firstName: formData.get('personalInfo.firstName') as string,
        lastName: formData.get('personalInfo.lastName') as string,
        phone: (formData.get('personalInfo.phone') as string) || undefined,
        gender: (formData.get('personalInfo.gender') as string) || undefined,
        dateOfBirth,
      },
      address: {
        line1: (formData.get('address.line1') as string) || undefined,
        line2: (formData.get('address.line2') as string) || undefined,
        city: (formData.get('address.city') as string) || undefined,
        state: (formData.get('address.state') as string) || undefined,
        country: (formData.get('address.country') as string) || undefined,
        postalCode: (formData.get('address.postalCode') as string) || undefined,
      },
      professionalInfo: {
        designation:
          (formData.get('professionalInfo.designation') as string) || undefined,
        department:
          (formData.get('professionalInfo.department') as string) || undefined,
      },
    };

    await updatePlatformUserDocument(userId, updateData);

    revalidatePath('/profile');
    return { success: true };
  } catch (error: any) {
    console.error('User Profile Update Error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while updating the profile.',
    };
  }
}
