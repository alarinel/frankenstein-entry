/**
 * Custom hook for managing reading page state and logic
 * 
 * @author alarinel@gmail.com
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { useAudioStore } from '@/store/audioStore';
import { useStoryAudio } from '@/hooks/useStoryAudio';
import { usePageNavigation } from '@/hooks/usePageNavigation';
import { useCountdownTimer } from './useCountdownTimer';
import { READING_CONSTANTS } from '@/constants/reading';
import { fetchSunriseSunset, getTimeOfDay, TimeOfDay } from '@/api/sunriseSunset';
import { TextPosition } from '@/types/reading';

interface UseReadingPageStateOptions {
  storyId: string | undefined;
}

export const useReadingPageState = ({ storyId }: UseReadingPageStateOptions) => {
  const navigate = useNavigate();
  const { currentStory, setCurrentStory } = useStoryStore();
  const { setCurrentPageAudio, setIsPlaying, isPlaying, cleanup } = useAudioStore();

  // UI State
  const [showPlayPrompt, setShowPlayPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [textPosition, setTextPosition] = useState<TextPosition>('right');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  const [audioProgress, setAudioProgress] = useState(0);
  
  const lastSwitchedPageRef = useRef<number>(-1);

  // Countdown timer hook
  const { countdown, isCountingDown, startCountdown, clearCountdown } = useCountdownTimer();

  // Page navigation hook
  const {
    currentPage,
    isFlipping,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
    setCurrentPage: setNavigationPage,
    cleanup: cleanupNavigation,
  } = usePageNavigation({
    totalPages: currentStory?.pages.length || 0,
    onPageChange: () => {},
    onNavigationStart: () => {
      setShowPlayPrompt(false);
      setIsPlaying(false);
    },
  });

  // Audio callbacks
  const handleAudioError = useCallback((error: unknown, context: string) => {
    console.error(`${context}:`, error);
    toast.error('Failed to load audio. Please try again.');
  }, []);

  const handlePlayStart = useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);

  const handlePlayEnd = useCallback(() => {
    setIsPlaying(false);
    if (canGoNext && !isFlipping) {
      startCountdown(READING_CONSTANTS.ANIMATION.AUTO_ADVANCE_DELAY, nextPage);
    } else if (!canGoNext && !isFlipping && storyId) {
      // Story has ended, navigate to completion screen after a delay
      startCountdown(READING_CONSTANTS.ANIMATION.AUTO_ADVANCE_DELAY, () => {
        navigate(`/complete/${storyId}`);
      });
    }
  }, [setIsPlaying, canGoNext, isFlipping, startCountdown, nextPage, storyId, navigate]);

  // Audio management hook
  const audioHook = useStoryAudio({
    story: currentStory,
    isFlipping,
    onPlayStart: handlePlayStart,
    onPlayEnd: handlePlayEnd,
    onError: handleAudioError,
  });

  // Load story
  const loadStory = useCallback(async () => {
    if (!storyId) {
      navigate('/');
      return;
    }

    try {
      setIsLoading(true);
      const story = await storyApi.getStory(storyId);
      setCurrentStory(story);
      setNavigationPage(0);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to load story');
      navigate('/');
    }
  }, [storyId, navigate, setCurrentStory, setNavigationPage]);

  // Load story and theme on mount
  useEffect(() => {
    loadStory();
    fetchSunriseSunset().then((data) => {
      const tod = getTimeOfDay(data);
      setTimeOfDay(tod);
    });
    
    return () => {
      cleanup();
      cleanupNavigation();
      clearCountdown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  // Switch audio when page changes
  useEffect(() => {
    if (currentStory && currentStory.pages.length > 0 && currentStory.pages[currentPage]) {
      if (lastSwitchedPageRef.current !== currentPage) {
        lastSwitchedPageRef.current = currentPage;
        audioHook.switchToPage(currentPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentStory?.id]);

  // Track audio progress
  useEffect(() => {
    if (!audioHook.audioRef.current || !isPlaying) return;

    const audio = audioHook.audioRef.current;
    const updateProgress = () => {
      const seek = audio.seek();
      const duration = audio.duration();
      if (duration > 0) {
        setAudioProgress((seek / duration) * 100);
      }
    };

    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [audioHook.audioRef, isPlaying]);

  // Update audio store
  useEffect(() => {
    if (audioHook.audioRef.current) {
      setCurrentPageAudio(audioHook.audioRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentPageAudio]);

  const toggleTextPosition = useCallback(() => {
    setTextPosition(prev => {
      if (prev === 'right') return 'left';
      if (prev === 'left') return 'hidden';
      return 'right';
    });
  }, []);

  return {
    // State
    currentStory,
    currentPage,
    isLoading,
    isFlipping,
    isPlaying,
    showPlayPrompt,
    textPosition,
    timeOfDay,
    audioProgress,
    countdown,
    isCountingDown,
    canGoNext,
    canGoPrevious,
    
    // Actions
    audioHook,
    nextPage,
    previousPage,
    clearCountdown,
    toggleTextPosition,
    setShowPlayPrompt,
    setIsPlaying,
  };
};
