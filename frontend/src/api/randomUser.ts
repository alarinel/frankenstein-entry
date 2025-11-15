/**
 * Random User API - Generate random character avatars
 * Free API - no key required
 * @see https://randomuser.me/
 */

export interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  login: {
    username: string;
  };
}

export interface RandomUserResponse {
  results: RandomUser[];
}

const RANDOM_USER_BASE_URL = 'https://randomuser.me/api';

/**
 * Fetch random user avatar for character suggestions
 */
export const fetchRandomAvatar = async (): Promise<RandomUser | null> => {
  try {
    const response = await fetch(`${RANDOM_USER_BASE_URL}/?inc=name,picture,login&nat=us,gb,ca`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch random user');
    }
    
    const data: RandomUserResponse = await response.json();
    return data.results[0] || null;
  } catch (error) {
    console.error('Error fetching random user:', error);
    return null;
  }
};

/**
 * Generate random character name from API
 */
export const fetchRandomCharacterName = async (): Promise<string> => {
  const user = await fetchRandomAvatar();
  if (user) {
    return `${user.name.first} ${user.name.last}`;
  }
  return 'Alex Adventure';
};
