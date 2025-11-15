/**
 * JokeAPI - Random jokes for loading screens
 * Free API - no key required
 * @see https://v2.jokeapi.dev/
 */

export interface Joke {
  type: 'single' | 'twopart';
  joke?: string; // For single jokes
  setup?: string; // For two-part jokes
  delivery?: string; // For two-part jokes
  category: string;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
}

const JOKE_API_BASE_URL = 'https://v2.jokeapi.dev/joke';

/**
 * Fetch a safe, family-friendly joke
 * Perfect for loading screens
 */
export const fetchSafeJoke = async (): Promise<Joke | null> => {
  try {
    // Only fetch Programming, Miscellaneous, and Pun categories
    // Blacklist all potentially offensive content
    const response = await fetch(
      `${JOKE_API_BASE_URL}/Programming,Miscellaneous,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch joke');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching joke:', error);
    return null;
  }
};

/**
 * Format joke for display
 */
export const formatJoke = (joke: Joke): string => {
  if (joke.type === 'single' && joke.joke) {
    return joke.joke;
  }
  if (joke.type === 'twopart' && joke.setup && joke.delivery) {
    return `${joke.setup} ${joke.delivery}`;
  }
  return 'Why did the story cross the road? To get to the other page! 📖';
};
