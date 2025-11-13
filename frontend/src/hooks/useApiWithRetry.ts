import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
}

export function useApiWithRetry<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: RetryOptions = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = await apiFunction(...args);
          setIsLoading(false);
          setRetryCount(0);
          return result;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error');
          console.error(`API call attempt ${attempt + 1} failed:`, lastError);

          if (attempt < maxRetries) {
            setRetryCount(attempt + 1);
            toast.error(`Request failed. Retrying... (${attempt + 1}/${maxRetries})`);

            // Exponential backoff
            const delay = retryDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      // All retries failed
      setIsLoading(false);
      setError(lastError);
      setRetryCount(0);

      if (onError && lastError) {
        onError(lastError);
      }

      toast.error(
        lastError?.message || 'Request failed after multiple attempts. Please try again later.'
      );

      return null;
    },
    [apiFunction, maxRetries, retryDelay, onError]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
    setRetryCount(0);
  }, []);

  return {
    execute,
    isLoading,
    error,
    retryCount,
    reset,
  };
}
