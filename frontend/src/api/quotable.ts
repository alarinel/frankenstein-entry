/**
 * Quotable API client for fetching random quotes
 * Free API - no key required
 * @see https://github.com/lukePeavey/quotable
 */

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
}

const QUOTABLE_BASE_URL = 'https://api.quotable.io';

// Tags that fit our spooky/literary theme
const THEMED_TAGS = [
  'literature',
  'imagination',
  'wisdom',
  'inspirational',
  'famous-quotes',
];

/**
 * Fetch a random quote from Quotable API
 * Filters by literary/inspirational themes
 */
export const fetchRandomQuote = async (): Promise<Quote> => {
  try {
    const tags = THEMED_TAGS.join('|');
    const response = await fetch(`${QUOTABLE_BASE_URL}/random?tags=${tags}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }
    
    return await response.json();
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
