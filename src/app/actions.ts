'use server';

import { summarizeBookmark } from '@/ai/flows/summarize-bookmark';

function isPubliclyRoutable(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    // Reject localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return false;
    }

    // Reject private IP address ranges
    if (
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      return false;
    }
    
    // Reject URLs without a TLD
    if (!hostname.includes('.')) {
        return false;
    }

    // Allow all other URLs
    return true;
  } catch (e) {
    return false;
  }
}

export async function summarizeUrlAction(url: string) {
  try {
    if (!url || !URL.canParse(url)) {
      return { error: 'Invalid URL provided. Please ensure it is a valid, full URL.' };
    }

    if (!isPubliclyRoutable(url)) {
        return { error: 'This URL is not publicly accessible and cannot be summarized.' };
    }

    const result = await summarizeBookmark({ url });
    if (result && result.summary) {
        return { summary: result.summary };
    }
    return { error: 'Could not generate a summary for this URL.' };
  } catch (e) {
    console.error('Summarization Error:', e);
    // Provide a more specific error if possible, but keep it user-friendly.
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    if (errorMessage.includes('400 Bad Request')) {
        return { error: 'The provided URL could not be accessed or processed. It might be invalid or restricted.' };
    }
    return { error: 'Failed to summarize the bookmark. The service may be temporarily unavailable.' };
  }
}
