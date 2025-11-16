/**
 * ZenQuotes API client for fetching random quotes
 * Free API - no key required
 * @see https://zenquotes.io/
 */

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
}

const ZENQUOTES_BASE_URL = 'https://zenquotes.io/api';

/**
 * Fetch a random quote from ZenQuotes API
 * Returns inspirational and literary quotes
 */
export const fetchRandomQuote = async (): Promise<Quote> => {
  try {
    const response = await fetch(`${ZENQUOTES_BASE_URL}/random`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }
    
    const data = await response.json();
    
    // ZenQuotes returns an array with one quote
    const zenQuote = data[0];
    
    // Transform ZenQuotes format to our Quote interface
    return {
      _id: `zen-${Date.now()}`,
      content: zenQuote.q,
      author: zenQuote.a,
      tags: ['inspirational'],
      authorSlug: zenQuote.a.toLowerCase().replace(/\s+/g, '-'),
      length: zenQuote.q.length,
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    // Return a fallback quote
    return {
      _id: 'fallback',
      content: 'Every story has a beginning, a middle, and an end.',
      author: 'Unknown',
      tags: ['literature'],
      authorSlug: 'unknown',
      length: 50,
    };
  }
};
