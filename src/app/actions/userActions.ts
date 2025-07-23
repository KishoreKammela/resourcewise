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
    const dateOfBirth = formData.get('personalInfo.dateOfBirth') as string;
    const updateData: UserProfileUpdate = {
      personalInfo: {
        firstName: formData.get('personalInfo.firstName') as string,
        lastName: formData.get('personalInfo.lastName') as string,
        phone: formData.get('personalInfo.phone') as string,
        gender: formData.get('personalInfo.gender') as string,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
      address: {
        line1: formData.get('address.line1') as string,
        line2: formData.get('address.line2') as string,
        city: formData.get('address.city') as string,
        state: formData.get('address.state') as string,
        country: formData.get('address.country') as string,
        postalCode: formData.get('address.postalCode') as string,
      },
      professionalInfo: {
        designation: formData.get('professionalInfo.designation') as string,
        department: formData.get('professionalInfo.department') as string,
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
