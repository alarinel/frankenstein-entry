/**
 * Bored API - Random activity suggestions
 * Free API - no key required
 * @see https://www.boredapi.com/
 */

export interface Activity {
  activity: string;
  type: string;
  participants: number;
  price: number;
  link: string;
  key: string;
  accessibility: number;
}

const BORED_API_BASE_URL = 'https://www.boredapi.com/api';

/**
 * Fetch random activity suggestion
 * Can be used for story goal inspiration
 */
export const fetchRandomActivity = async (): Promise<Activity | null> => {
  try {
    const response = await fetch(`${BORED_API_BASE_URL}/activity`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch activity');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity:', error);
    return null;
  }
};

/**
 * Fetch activity by type for story goals
 */
export const fetchActivityByType = async (type: string): Promise<Activity | null> => {
  try {
    const response = await fetch(`${BORED_API_BASE_URL}/activity?type=${type}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch activity');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity:', error);
    return null;
  }
};

/**
 * Convert activity to story goal format
 */
export const activityToGoal = (activity: Activity): string => {
  return activity.activity.toLowerCase();
};
