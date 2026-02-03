// A personalized show recommendation AI agent.
//
// - showRecommendations - A function that provides personalized show recommendations.
// - ShowRecommendationsInput - The input type for the showRecommendations function.
// - ShowRecommendationsOutput - The return type for the showRecommendations function.

'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ShowRecommendationsInputSchema = z.object({
  viewingHistory: z
    .array(z.string())
    .describe('List of show names the user has previously viewed.'),
  preferences: z
    .string()
    .describe('User preferences regarding circus shows, e.g., favorite acts, preferred show times.'),
});

export type ShowRecommendationsInput = z.infer<typeof ShowRecommendationsInputSchema>;

const ShowRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of recommended show names based on viewing history and preferences.'),
  reasoning: z
    .string()
    .describe('Explanation of why these shows were recommended.'),
});

export type ShowRecommendationsOutput = z.infer<typeof ShowRecommendationsOutputSchema>;

export async function showRecommendations(
  input: ShowRecommendationsInput
): Promise<ShowRecommendationsOutput> {
  return showRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'showRecommendationsPrompt',
  input: {schema: ShowRecommendationsInputSchema},
  output: {schema: ShowRecommendationsOutputSchema},
  prompt: `You are an AI assistant that provides personalized show recommendations for circus performances.

  Based on the user's viewing history and preferences, recommend a list of shows that they might enjoy.
  Explain the reasoning behind your recommendations.

  Viewing History: {{viewingHistory}}
  Preferences: {{preferences}}
  
  Please follow the schema provided, especially the descriptions to appropriately populate the fields in JSON.`,
});

const showRecommendationsFlow = ai.defineFlow(
  {
    name: 'showRecommendationsFlow',
    inputSchema: ShowRecommendationsInputSchema,
    outputSchema: ShowRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
