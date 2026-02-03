'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getShowRecommendations, RecommendationState } from '@/lib/actions';
import { shows } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

const initialState: RecommendationState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Get Recommendations
        </>
      )}
    </Button>
  );
}

export function Recommendations() {
  const [state, formAction] = useFormState(getShowRecommendations, initialState);

  return (
    <div className="space-y-8">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">Personalized Recommendations</CardTitle>
            <CardDescription>
              Tell us what you like, and our AI will suggest shows you&apos;ll love!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="font-semibold">Which shows have you seen?</Label>
              <div className="grid grid-cols-2 gap-4">
                {shows.map((show) => (
                  <div key={show.id} className="flex items-center space-x-2">
                    <Checkbox id={`show-${show.id}`} name="viewingHistory" value={show.title} />
                    <Label htmlFor={`show-${show.id}`} className="font-normal">{show.title}</Label>
                  </div>
                ))}
              </div>
              {state?.fieldErrors?.viewingHistory && (
                  <p className="text-sm font-medium text-destructive">{state.fieldErrors.viewingHistory.join(', ')}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferences" className="font-semibold">What do you enjoy in a circus show?</Label>
              <Textarea
                id="preferences"
                name="preferences"
                placeholder="e.g., I love high-flying acrobats, comedy, and shows with a strong story..."
                rows={4}
              />
              {state?.fieldErrors?.preferences && (
                  <p className="text-sm font-medium text-destructive">{state.fieldErrors.preferences.join(', ')}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <SubmitButton />
             {state?.error && (
                <p className="text-sm font-medium text-destructive mt-2">{state.error}</p>
              )}
          </CardFooter>
        </form>
      </Card>

      {state.recommendations && state.reasoning && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle className="font-headline">Here are your recommendations!</AlertTitle>
          <AlertDescription>
            <p className="mb-4 font-semibold">{state.reasoning}</p>
            <ul className="list-disc pl-5 space-y-1">
              {state.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
