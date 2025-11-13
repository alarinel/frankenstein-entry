/**
 * Custom hook for managing page navigation with flip animations
 * 
 * @author alarinel@gmail.com
 */

import { useState, useCallback, useRef } from 'react';
import { READING_CONSTANTS } from '@/constants/reading';

interface UsePageNavigationOptions {
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onNavigationStart: () => void;
}

export const usePageNavigation = ({
  totalPages,
  onPageChange,
  onNavigationStart,
}: UsePageNavigationOptions) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipTimeoutRef = useRef<number | null>(null);

  const navigateToPage = useCallback(
    (newPage: number) => {
      if (isFlipping || newPage < 0 || newPage >= totalPages) {
        return;
      }

      onNavigationStart();

      // Clear any existing flip timeout
      if (flipTimeoutRef.current !== null) {
        clearTimeout(flipTimeoutRef.current);
      }

      setIsFlipping(true);

      flipTimeoutRef.current = window.setTimeout(() => {
        setCurrentPage(newPage);
        setIsFlipping(false);
        onPageChange(newPage);
        flipTimeoutRef.current = null;
      }, READING_CONSTANTS.ANIMATION.PAGE_FLIP_DURATION);
    },
    [isFlipping, totalPages, onPageChange, onNavigationStart]
  );

  const nextPage = useCallback(() => {
    navigateToPage(currentPage + 1);
  }, [currentPage, navigateToPage]);

  const previousPage = useCallback(() => {
    navigateToPage(currentPage - 1);
  }, [currentPage, navigateToPage]);

  const canGoNext = currentPage < totalPages - 1;
  const canGoPrevious = currentPage > 0;

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (flipTimeoutRef.current !== null) {
      clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
  }, []);

  return {
    currentPage,
    isFlipping,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    setCurrentPage,
    cleanup,
  };
};
