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
    .describe('A list of technical skills extracted from the resume.'),
  softSkills: z
    .array(z.string())
    .describe(
      'A list of soft skills inferred from the resume content, such as leadership, communication, etc.'
    ),
});
export type ExtractSkillsOutput = z.infer<typeof ExtractSkillsOutputSchema>;

export async function extractSkills(
  input: ExtractSkillsInput
): Promise<ExtractSkillsOutput> {
  return await extractSkillsFlow(input);
}

const skillsPrompt = ai.definePrompt({
  name: 'skillsPrompt',
  input: { schema: ExtractSkillsInputSchema },
  output: { schema: ExtractSkillsOutputSchema },
  prompt: `You are an expert technical recruiter and HR analyst. Your task is to analyze the provided resume and perform two actions:

1.  **Extract Technical Skills**: Identify and list all technical skills. Focus on programming languages, frameworks, libraries, databases, cloud technologies, development tools, and other relevant technical competencies.

2.  **Infer Soft Skills**: Based on the descriptions of roles, projects, and accomplishments, infer a list of soft skills. Examples include "Leadership", "Teamwork", "Problem Solving", "Communication", "Project Management", "Client-facing experience".

Present the output as two separate lists of strings.

Resume Content:
{{media url=resumeDataUri}}
`,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async (input) => {
    const { output } = await skillsPrompt(input);
    if (!output) {
      return { skills: [], softSkills: [] };
    }
    return {
      skills: output.skills.filter(Boolean), // Ensure no empty strings
      softSkills: output.softSkills.filter(Boolean),
    };
  }
);
