/**
 * Custom hook for managing countdown timer functionality
 * 
 * @author alarinel@gmail.com
 */

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseCountdownTimerReturn {
  countdown: number;
  isCountingDown: boolean;
  startCountdown: (duration: number, onComplete: () => void) => void;
  clearCountdown: () => void;
}

export const useCountdownTimer = (): UseCountdownTimerReturn => {
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const countdownIntervalRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  const clearCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setIsCountingDown(false);
    setCountdown(0);
  }, []);

  const startCountdown = useCallback((duration: number, onComplete: () => void) => {
    clearCountdown();
    
    const durationInSeconds = Math.ceil(duration / 1000);
    setIsCountingDown(true);
    setCountdown(durationInSeconds);
    
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
      // Clear the interval but don't call clearCountdown to avoid clearing this timeout
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setIsCountingDown(false);
      setCountdown(0);
      autoAdvanceTimeoutRef.current = null;
      
      // Execute the callback
      onComplete();
    }, duration);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCountdown();
    };
  }, [clearCountdown]);

  return {
    countdown,
    isCountingDown,
    startCountdown,
    clearCountdown,
  };
};
