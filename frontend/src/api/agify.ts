/**
 * Agify API - Predict age from name
 * Free API - no key required (1000 requests/day)
 * @see https://agify.io/
 */

export interface AgeData {
  name: string;
  age: number | null;
  count: number;
}

const AGIFY_BASE_URL = 'https://api.agify.io';

/**
 * Predict age from character name
 * Can be used to suggest age-appropriate story themes
 */
export const predictAge = async (name: string): Promise<AgeData | null> => {
  try {
    const response = await fetch(`${AGIFY_BASE_URL}?name=${encodeURIComponent(name)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch age prediction');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error predicting age:', error);
    return null;
  }
};

/**
 * Get story mood based on predicted age
 */
export const getMoodFromAge = (age: number | null): string => {
  if (!age) return 'adventurous';
  
  if (age < 20) return 'playful and exciting';
  if (age < 40) return 'adventurous and mysterious';
  if (age < 60) return 'thoughtful and wise';
  return 'nostalgic and heartwarming';
};
