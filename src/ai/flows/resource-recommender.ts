'use server';

/**
 * @fileOverview An AI-powered tool for recommending resources for projects.
 *
 * - recommendResources - A function that suggests the best resources for a project.
 * - RecommendResourcesInput - The input type for the recommendResources function.
 * - RecommendResourcesOutput - The return type for the recommendResources function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendResourcesInputSchema = z.object({
  project: z.any().describe('The project that needs resources.'),
  availableResources: z
    .array(z.any())
    .describe('A list of available resources to choose from.'),
});
export type RecommendResourcesInput = z.infer<
  typeof RecommendResourcesInputSchema
>;

const RecommendedResourceSchema = z.object({
  resourceId: z.string().describe('The ID of the recommended resource.'),
  resourceName: z.string().describe('The full name of the resource.'),
  justification: z
    .string()
    .describe(
      'A brief, compelling justification for why this resource is a good fit for the project.'
    ),
  matchScore: z
    .number()
    .min(1)
    .max(100)
    .describe(
      'A score from 1-100 indicating how good of a match this resource is.'
    ),
});

const RecommendResourcesOutputSchema = z.object({
  recommendations: z
    .array(RecommendedResourceSchema)
    .describe(
      'A ranked list of the top 3-5 resource recommendations for the project.'
    ),
});
export type RecommendResourcesOutput = z.infer<
  typeof RecommendResourcesOutputSchema
>;

export async function recommendResources(
  input: RecommendResourcesInput
): Promise<RecommendResourcesOutput> {
  // For some reason the type inference from the schema is not working correctly
  // for the flow, so we cast the input to any.
  return await recommendResourcesFlow(input as any);
}

const recommendationPrompt = ai.definePrompt({
  name: 'recommendationPrompt',
  input: { schema: RecommendResourcesInputSchema },
  output: { schema: RecommendResourcesOutputSchema },
  prompt: `You are an expert resource manager for a top-tier technical consultancy. Your task is to analyze a project's needs and recommend the best-fit resources from a list of available personnel.

Analyze the provided project information and the list of available resources. Based on the project's description, required skills, and other details, identify the top 3-5 candidates who would be the best fit.

For each recommendation, provide:
1.  The resource's ID ('resourceId') and full name ('resourceName').
2.  A compelling justification explaining *why* they are a strong match. Consider their technical skills, experience, and any other relevant factors from their profile.
3.  A "matchScore" from 1 to 100, where 100 is a perfect match.

Return a ranked list of these recommendations, with the best match appearing first.

**Project Details:**
\`\`\`json
{{{json project}}}
\`\`\`

**Available Resources:**
\`\`\`json
{{{json availableResources}}}
\`\`\`
`,
});

const recommendResourcesFlow = ai.defineFlow(
  {
    name: 'recommendResourcesFlow',
    inputSchema: RecommendResourcesInputSchema,
    outputSchema: RecommendResourcesOutputSchema,
  },
  async (input) => {
    const { output } = await recommendationPrompt(input);
    return output ?? { recommendations: [] };
  }
);
