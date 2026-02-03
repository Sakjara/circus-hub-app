'use server';

import { showRecommendations, ShowRecommendationsInput } from '@/ai/flows/show-recommendations';
import { z } from 'zod';

const recommendationSchema = z.object({
  viewingHistory: z.array(z.string()).min(1, "Please select at least one show you've watched."),
  preferences: z.string().min(10, "Please describe your preferences in at least 10 characters."),
});

export type RecommendationState = {
  recommendations?: string[];
  reasoning?: string;
  error?: string;
  fieldErrors?: {
    viewingHistory?: string[];
    preferences?: string[];
  };
};

export async function getShowRecommendations(
  prevState: RecommendationState,
  formData: FormData
): Promise<RecommendationState> {
  
  const rawData = {
    viewingHistory: formData.getAll('viewingHistory'),
    preferences: formData.get('preferences'),
  };

  const validatedFields = recommendationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: 'Please fix the errors below.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await showRecommendations(validatedFields.data as ShowRecommendationsInput);
    return {
      recommendations: result.recommendations,
      reasoning: result.reasoning,
    };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred while generating recommendations. Please try again later.',
    };
  }
}
