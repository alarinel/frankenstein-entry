/**
 * Sunrise-Sunset API client for dynamic theming
 * Free API - no key required
 * @see https://sunrise-sunset.org/api
 */

export interface SunriseSunsetData {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: number;
  civil_twilight_begin: string;
  civil_twilight_end: string;
  nautical_twilight_begin: string;
  nautical_twilight_end: string;
  astronomical_twilight_begin: string;
  astronomical_twilight_end: string;
}

export interface SunriseSunsetResponse {
  results: SunriseSunsetData;
  status: string;
}

export type TimeOfDay = 'night' | 'twilight' | 'day';

const SUNRISE_SUNSET_BASE_URL = 'https://api.sunrise-sunset.org/json';

/**
 * Fetch sunrise/sunset times for user's location
 * Falls back to default location if geolocation fails
 */
export const fetchSunriseSunset = async (): Promise<SunriseSunsetData | null> => {
  try {
    // Try to get user's location
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000,
        maximumAge: 3600000, // Cache for 1 hour
      });
    });

    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `${SUNRISE_SUNSET_BASE_URL}?lat=${latitude}&lng=${longitude}&formatted=0`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch sunrise/sunset data');
    }

    const data: SunriseSunsetResponse = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error('Invalid response from sunrise-sunset API');
    }

    return data.results;
  } catch (error) {
    console.warn('Could not fetch sunrise/sunset data:', error);
    return null;
  }
};

/**
 * Determine time of day based on sunrise/sunset data
 */
export const getTimeOfDay = (data: SunriseSunsetData | null): TimeOfDay => {
  if (!data) {
    // Fallback to local time
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) return 'day';
    if (hour >= 18 && hour < 20) return 'twilight';
    return 'night';
  }

  const now = new Date();
  const sunrise = new Date(data.sunrise);
  const sunset = new Date(data.sunset);
  const twilightEnd = new Date(data.civil_twilight_end);
  const twilightBegin = new Date(data.civil_twilight_begin);

  if (now >= sunrise && now < sunset) {
    return 'day';
  } else if (
    (now >= sunset && now < twilightEnd) ||
    (now >= twilightBegin && now < sunrise)
  ) {
    return 'twilight';
  } else {
    return 'night';
  }
};

/**
 * Get theme colors based on time of day
 */
export const getThemeForTimeOfDay = (timeOfDay: TimeOfDay) => {
  switch (timeOfDay) {
    case 'day':
      return {
        from: 'from-blue-900',
        via: 'via-purple-800',
        to: 'to-pink-700',
        intensity: 'light',
      };
    case 'twilight':
      return {
        from: 'from-orange-900',
        via: 'via-purple-900',
        to: 'to-indigo-900',
        intensity: 'medium',
      };
    case 'night':
      return {
        from: 'from-dark-950',
        via: 'via-dark-900',
        to: 'to-spooky-purple-950',
        intensity: 'dark',
      };
  }
};
