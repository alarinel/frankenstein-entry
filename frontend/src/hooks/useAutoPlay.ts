import { useRef, useCallback, useEffect } from 'react';

interface UseAutoPlayOptions {
  isFlipping: boolean;
  canGoNext: boolean;
  onAdvance: () => void;
  delay: number;
}

export const useAutoPlay = ({
  isFlipping,
  canGoNext,
  onAdvance,
  delay,
}: UseAutoPlayOptions) => {
  const countdownIntervalRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  }, []);

  const startAutoAdvance = useCallback((
    setCountdown: (value: number | ((prev: number) => number)) => void,
    setIsCountingDown: (value: boolean) => void
  ) => {
    console.log('[AutoPlay] Starting auto-advance', { isFlipping, canGoNext });
    
    if (isFlipping || !canGoNext) {
      console.log('[AutoPlay] Conditions not met, aborting');
      return;
    }

    clearTimers();
    
    setIsCountingDown(true);
    setCountdown(5);
    
    // Countdown timer
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          setIsCountingDown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Auto-advance after delay
    autoAdvanceTimeoutRef.current = window.setTimeout(() => {
      console.log('[AutoPlay] Executing auto-advance');
      clearTimers();
      setIsCountingDown(false);
      setCountdown(0);
      onAdvance();
    }, delay);
  }, [isFlipping, canGoNext, onAdvance, delay, clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    startAutoAdvance,
    clearTimers,
  };
};
