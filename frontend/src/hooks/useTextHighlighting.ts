/**
 * Custom hook for managing text highlighting with proper cleanup
 * 
 * @author alarinel@gmail.com
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTextHighlightingOptions {
  text: string;
  duration: number;
  isPlaying: boolean;
  isActive: boolean;
}

export const useTextHighlighting = ({
  text,
  duration,
  isPlaying,
  isActive,
}: UseTextHighlightingOptions) => {
  const [highlightedWords, setHighlightedWords] = useState<Set<number>>(new Set());
  const timeoutIdsRef = useRef<number[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearAllTimeouts();
    setHighlightedWords(new Set());
  }, [clearAllTimeouts]);

  useEffect(() => {
    if (!isPlaying || !isActive) {
      reset();
      return;
    }

    const words = text.split(' ');
    const timePerWord = duration / words.length;

    words.forEach((_, index) => {
      const timeoutId = window.setTimeout(() => {
        setHighlightedWords((prev) => new Set([...prev, index]));
      }, timePerWord * 1000 * index);

      timeoutIdsRef.current.push(timeoutId);
    });

    return () => {
      clearAllTimeouts();
    };
  }, [text, duration, isPlaying, isActive, reset, clearAllTimeouts]);

  return { highlightedWords, reset };
};
