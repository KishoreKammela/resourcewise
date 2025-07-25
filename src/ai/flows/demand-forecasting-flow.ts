'use server';

/**
 * @fileOverview An AI-powered tool for forecasting future skill demand based on project data.
 *
 * - forecastDemand - A function that analyzes project data to predict future needs.
 * - ForecastDemandInput - The input type for the forecastDemand function.
 * - ForecastDemandOutput - The return type for the forecastDemand function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ForecastDemandInputSchema = z.object({
  projects: z
    .array(z.any())
    .describe('An array of past and current project objects.'),
});
export type ForecastDemandInput = z.infer<typeof ForecastDemandInputSchema>;

const SkillDemandSchema = z.object({
  skill: z.string().describe('The name of the skill or technology.'),
  trend: z
    .enum(['rising', 'stable', 'declining'])
    .describe('The predicted demand trend for this skill.'),
  reasoning: z
    .string()
    .describe(
      'A brief explanation for the predicted trend, based on project data.'
    ),
});

const ForecastDemandOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A high-level executive summary of the demand forecast for the next 6-12 months.'
    ),
  demandForecast: z
    .array(SkillDemandSchema)
    .describe('A list of skills with their forecasted demand trends.'),
  strategicRecommendations: z
    .array(z.string())
    .describe(
      'A list of actionable recommendations for hiring and training based on the forecast.'
    ),
});
export type ForecastDemandOutput = z.infer<typeof ForecastDemandOutputSchema>;

export async function forecastDemand(
  input: ForecastDemandInput
): Promise<ForecastDemandOutput> {
  return await forecastDemandFlow(input as any);
}

const forecastPrompt = ai.definePrompt({
  name: 'forecastPrompt',
  input: { schema: ForecastDemandInputSchema },
  output: { schema: ForecastDemandOutputSchema },
  prompt: `You are a strategic workforce planning analyst for a technology consultancy. Your task is to analyze historical and current project data to forecast future skill demand for the next 6-12 months.

Analyze the provided list of projects. Pay close attention to project types, descriptions, technology stacks, and required skills.

Based on your analysis, provide the following:
1.  **Summary**: A concise, high-level summary of the overall demand trends.
2.  **Demand Forecast**: Identify key skills and technologies. For each, specify whether the demand is 'rising', 'stable', or 'declining', and provide a brief reasoning based on the project data.
3.  **Strategic Recommendations**: Offer a list of actionable recommendations for the company's hiring and training strategy. For example, "Prioritize hiring 2-3 Senior DevOps engineers with AWS experience," or "Invest in upskilling current frontend developers in Vue.js."

**Project Data:**
\`\`\`json
{{{json projects}}}
\`\`\`
`,
});

const forecastDemandFlow = ai.defineFlow(
  {
    name: 'forecastDemandFlow',
    inputSchema: ForecastDemandInputSchema,
    outputSchema: ForecastDemandOutputSchema,
  },
  async (input) => {
    const { output } = await forecastPrompt(input);
    return (
      output ?? {
        summary: 'No data available to generate a forecast.',
        demandForecast: [],
        strategicRecommendations: [],
      }
    );
  }
);
