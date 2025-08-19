// This file is machine-generated - do not edit!

'use server';

/**
 * @fileOverview A bookmark summarization AI agent.
 *
 * - summarizeBookmark - A function that handles the bookmark summarization process.
 * - SummarizeBookmarkInput - The input type for the summarizeBookmark function.
 * - SummarizeBookmarkOutput - The return type for the summarizeBookmark function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeBookmarkInputSchema = z.object({
  url: z.string().url().describe('The URL of the bookmarked page.'),
});
export type SummarizeBookmarkInput = z.infer<typeof SummarizeBookmarkInputSchema>;

const SummarizeBookmarkOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the content on the bookmarked page.'),
});
export type SummarizeBookmarkOutput = z.infer<typeof SummarizeBookmarkOutputSchema>;

export async function summarizeBookmark(input: SummarizeBookmarkInput): Promise<SummarizeBookmarkOutput> {
  return summarizeBookmarkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBookmarkPrompt',
  input: {schema: SummarizeBookmarkInputSchema},
  output: {schema: SummarizeBookmarkOutputSchema},
  prompt: `You are an expert summarizer. Your job is to summarize the content of a web page given its URL. Keep the summary concise and to the point.

URL: {{{url}}}`,
});

const summarizeBookmarkFlow = ai.defineFlow(
  {
    name: 'summarizeBookmarkFlow',
    inputSchema: SummarizeBookmarkInputSchema,
    outputSchema: SummarizeBookmarkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
