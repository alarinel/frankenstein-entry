/**
 * Custom hook for reading page event handlers
 * 
 * @author alarinel@gmail.com
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardNavigation, KeyboardKeys } from '@/hooks/shared';

interface UseReadingPageHandlersOptions {
  storyId: string | undefined;
  currentStory: any;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isPlaying: boolean;
  audioHook: any;
  nextPage: () => void;
  previousPage: () => void;
  clearCountdown: () => void;
  resetHighlighting: () => void;
  setShowPlayPrompt: (show: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const useReadingPageHandlers = ({
  storyId,
  currentStory,
  canGoNext,
  canGoPrevious,
  isPlaying,
  audioHook,
  nextPage,
  previousPage,
  clearCountdown,
  resetHighlighting,
  setShowPlayPrompt,
  setIsPlaying,
}: UseReadingPageHandlersOptions) => {
  const navigate = useNavigate();

  const handleStartReading = useCallback(() => {
    audioHook.markUserInteracted();
    setShowPlayPrompt(false);
    audioHook.play();
  }, [audioHook, setShowPlayPrompt]);

  const handleNextPage = useCallback(() => {
    if (!currentStory) return;
    
    clearCountdown();

    if (canGoNext) {
      audioHook.stop();
      audioHook.markUserInteracted();
      resetHighlighting();
      nextPage();
    } else {
      navigate(`/complete/${storyId}`);
    }
  }, [currentStory, canGoNext, nextPage, resetHighlighting, navigate, storyId, audioHook, clearCountdown]);

  const handlePreviousPage = useCallback(() => {
    clearCountdown();

    if (canGoPrevious) {
      audioHook.stop();
      audioHook.markUserInteracted();
      resetHighlighting();
      previousPage();
    }
  }, [canGoPrevious, previousPage, resetHighlighting, audioHook, clearCountdown]);

  const handleTogglePlayPause = useCallback(() => {
    audioHook.markUserInteracted();
    setShowPlayPrompt(false);
    audioHook.togglePlayPause(isPlaying);
    setIsPlaying(!isPlaying);
  }, [audioHook, isPlaying, setIsPlaying, setShowPlayPrompt]);

  const handleBackToMenu = useCallback(() => {
    audioHook.stop();
    navigate('/');
  }, [audioHook, navigate]);

  // Keyboard navigation using shared hook
  useKeyboardNavigation({
    bindings: [
      { key: KeyboardKeys.ARROW_RIGHT, handler: handleNextPage, preventDefault: true },
      { key: KeyboardKeys.ARROW_LEFT, handler: handlePreviousPage, preventDefault: true },
      { key: KeyboardKeys.SPACE, handler: handleTogglePlayPause, preventDefault: true },
    ],
    enabled: true,
  });

  return {
    handleStartReading,
    handleNextPage,
    handlePreviousPage,
    handleTogglePlayPause,
    handleBackToMenu,
  };
};
