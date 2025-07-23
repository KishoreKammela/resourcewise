'use server';

import { extractSkills } from '@/ai/flows/smart-skills-extractor';

export async function extractSkillsAction(resumeDataUri: string) {
  if (!resumeDataUri || !resumeDataUri.startsWith('data:')) {
    return { success: false, error: 'Invalid resume data provided.' };
  }

  try {
    const result = await extractSkills({ resumeDataUri });
    return { success: true, skills: result.skills };
  } catch (error) {
    console.error('Skill extraction failed:', error);
    // Potentially check for specific error types from the AI service
    return {
      success: false,
      error: 'Failed to extract skills from the resume.',
    };
  }
}
