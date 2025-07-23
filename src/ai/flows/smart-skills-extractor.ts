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
  return extractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: { schema: ExtractSkillsInputSchema },
  output: { schema: ExtractSkillsOutputSchema },
  prompt: `You are an expert HR assistant specializing in skill extraction from resumes.

You will use this information to extract the skills from the resume.

Resume: {{media url=resumeDataUri}}`,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
