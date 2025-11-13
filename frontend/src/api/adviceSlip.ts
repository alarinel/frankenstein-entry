/**
 * Advice Slip API - Random advice for completion page
 * Free API - no key required
 * @see https://api.adviceslip.com/
 */

export interface Advice {
  id: number;
  advice: string;
}

export interface AdviceResponse {
  slip: Advice;
}

const ADVICE_SLIP_BASE_URL = 'https://api.adviceslip.com';

/**
 * Fetch random advice
 * Perfect for completion page encouragement
 */
export const fetchRandomAdvice = async (): Promise<Advice> => {
  try {
    const response = await fetch(`${ADVICE_SLIP_BASE_URL}/advice`, {
      cache: 'no-cache', // API requires no caching
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch advice');
    }
    
    const data: AdviceResponse = await response.json();
    return data.slip;
  } catch (error) {
    console.error('Error fetching advice:', error);
    // Return a fallback advice
    return {
      id: 0,
      advice: 'Keep creating amazing stories!',
    };
  }
};
