'use server';

/**
 * @fileOverview An AI-powered tool that extracts skills from uploaded resumes.
 *
 * - extractSkills - A function that handles the skill extraction process.
 * - ExtractSkillsInput - The input type for the extractSkills function.
 * - ExtractSkillsOutput - The return type for the extractSkills function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractSkillsInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractSkillsInput = z.infer<typeof ExtractSkillsInputSchema>;

const ExtractSkillsOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of skills extracted from the resume.'),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkills(
  input: ExtractSkillsInput
): Promise<ExtractSkillsOutput> {
  console.log('extractSkills AI flow to be re-implemented');
  return { skills: [] };
}
