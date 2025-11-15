import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { useAudioStore } from '@/store/audioStore';
import toast from 'react-hot-toast';

import { SubtleParticleBackground } from '@/components/SubtleParticleBackground';
import { FloatingBats } from '@/components/spooky/FloatingBats';
import { FloatingCandles } from '@/components/spooky/FloatingCandles';
import { FloatingSpiders } from '@/components/spooky/FloatingSpiders';
import { MagicSparkles } from '@/components/spooky/MagicSparkles';
import { Book3D } from '@/components/Book3D';
import { AudioProgressBar } from '@/components/AudioProgressBar';
import { NavigationControls } from '@/components/NavigationControls';

import { useStoryAudio } from '@/hooks/useStoryAudio';
import { useTextHighlighting } from '@/hooks/useTextHighlighting';
import { usePageNavigation } from '@/hooks/usePageNavigation';
import { useAutoPlay } from '@/hooks/useAutoPlay';
import { READING_CONSTANTS } from '@/constants/reading';
import { fetchSunriseSunset, getTimeOfDay, getThemeForTimeOfDay, TimeOfDay } from '@/api/sunriseSunset';

export const ReadingPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { currentStory, setCurrentStory } = useStoryStore();
  const { setCurrentPageAudio, setIsPlaying, isPlaying, cleanup } = useAudioStore();

  // UI State
  const [showPlayPrompt, setShowPlayPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [textPosition, setTextPosition] = useState<'left' | 'right' | 'hidden'>('right');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  
  // Audio State
  const [audioProgress, setAudioProgress] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  
  // Refs
  const lastSwitchedPageRef = useRef<number>(-1);
  const currentPageRef = useRef(0);

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

  // Update current page ref
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Auto-play hook
  const { startAutoAdvance, clearTimers } = useAutoPlay({
    isFlipping,
    canGoNext,
    onAdvance: nextPage,
    delay: READING_CONSTANTS.ANIMATION.AUTO_ADVANCE_DELAY,
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
    console.log('[ReadingPage] Audio ended, starting auto-advance');
    setIsPlaying(false);
    startAutoAdvance(setCountdown, setIsCountingDown);
  }, [setIsPlaying, startAutoAdvance]);

  // Audio management hook
  const audioHook = useStoryAudio({
    story: currentStory,
    isFlipping,
    onPlayStart: handlePlayStart,
    onPlayEnd: handlePlayEnd,
    onError: handleAudioError,
  });

  // Get current page data
  const currentPageData = useMemo(() => {
    if (!currentStory || !currentStory.pages[currentPage]) {
      return null;
    }
    return currentStory.pages[currentPage];
  }, [currentStory?.id, currentPage, currentStory?.pages]);

  // Text highlighting hook
  const { highlightedWords, reset: resetHighlighting } = useTextHighlighting({
    text: currentPageData?.text || '',
    duration: currentPageData?.duration || 0,
    isPlaying: isPlaying,
    isActive: !!currentPageData,
  });

  // Memoize words and image URL
  const words = useMemo(() => currentPageData?.text.split(' ') || [], [currentPageData?.text]);
  const imageUrl = useMemo(() => 
    currentPageData ? storyApi.getAssetUrl(currentPageData.imageUrl) : '', 
    [currentPageData?.imageUrl]
  );

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
      clearTimers();
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

  const loadStory = async () => {
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
  };

  const handleStartReading = useCallback(() => {
    audioHook.markUserInteracted();
    setShowPlayPrompt(false);
    audioHook.play();
  }, [audioHook]);

  const handleNextPage = useCallback(() => {
    if (!currentStory) return;
    
    clearTimers();
    setIsCountingDown(false);
    setCountdown(0);

    if (canGoNext) {
      audioHook.stop();
      audioHook.markUserInteracted();
      resetHighlighting();
      nextPage();
    } else {
      navigate(`/complete/${storyId}`);
    }
  }, [currentStory, canGoNext, nextPage, resetHighlighting, navigate, storyId, audioHook, clearTimers]);

  const handlePreviousPage = useCallback(() => {
    clearTimers();
    setIsCountingDown(false);
    setCountdown(0);

    if (canGoPrevious) {
      audioHook.stop();
      audioHook.markUserInteracted();
      resetHighlighting();
      previousPage();
    }
  }, [canGoPrevious, previousPage, resetHighlighting, audioHook, clearTimers]);

  const handleTogglePlayPause = useCallback(() => {
    audioHook.markUserInteracted();
    setShowPlayPrompt(false);
    audioHook.togglePlayPause(isPlaying);
    setIsPlaying(!isPlaying);
  }, [audioHook, isPlaying, setIsPlaying]);

  const toggleTextPosition = useCallback(() => {
    setTextPosition(prev => {
      if (prev === 'right') return 'left';
      if (prev === 'left') return 'hidden';
      return 'right';
    });
  }, []);

  const handleBackToMenu = useCallback(() => {
    audioHook.stop();
    navigate('/');
  }, [audioHook, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePreviousPage();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNextPage, handlePreviousPage, handleTogglePlayPause]);

  if (isLoading || !currentStory || !currentPageData) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-4xl">Loading...</div>
      </div>
    );
  }

  const theme = getThemeForTimeOfDay(timeOfDay);

  return (
    <div className={`h-screen bg-gradient-to-br ${theme.from} ${theme.via} ${theme.to} flex flex-col overflow-hidden relative`}>
      {/* Background Elements */}
      <SubtleParticleBackground intensity={theme.intensity as 'light' | 'medium' | 'dark'} />
      <FloatingBats count={3} />
      <FloatingSpiders count={4} />
      <FloatingCandles />
      <MagicSparkles isActive={true} />

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 text-4xl animate-float-slow z-10">📚</div>
      <div className="absolute top-4 right-4 text-4xl animate-float z-10" style={{ animationDelay: '0.5s' }}>⭐</div>
      <div className="absolute bottom-4 left-4 text-4xl animate-bounce-subtle z-10">🌙</div>
      <div className="absolute bottom-4 right-4 text-4xl animate-bounce-subtle z-10" style={{ animationDelay: '0.7s' }}>🎭</div>

      {/* Play Prompt Overlay */}
      <AnimatePresence>
        {showPlayPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleStartReading}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                📖
              </motion.div>
              <h2 className="text-4xl font-spooky text-transparent bg-gradient-to-r from-spooky-purple-400 via-spooky-pink-400 to-spooky-orange-400 bg-clip-text mb-4">
                Ready to Begin?
              </h2>
              <p className="text-gray-300 text-lg mb-8 font-fun">
                Click the button below to start your magical story
              </p>
              <button 
                onClick={handleStartReading}
                className="text-xl px-8 py-4 bg-gradient-to-br from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 hover:from-spooky-purple-500 hover:via-spooky-pink-500 hover:to-spooky-orange-500 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                style={{
                  boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                <span className="text-2xl mr-3">▶️</span>
                Start Reading
                <span className="text-2xl ml-3">✨</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={handleBackToMenu}
          className="flex items-center gap-2 px-4 py-2 bg-dark-900/95 hover:bg-dark-800/95 rounded-xl transition-all duration-200 text-gray-300 hover:text-white shadow-lg hover:shadow-xl border border-gray-700/50 hover:border-gray-600/50 backdrop-blur-sm"
          style={{
            transform: 'translateZ(0)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <span className="text-xl">🏠</span>
          <span className="hidden md:inline font-medium">Menu</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 min-h-0">
        <div className="w-full max-w-7xl flex flex-col items-center" style={{ height: '90vh' }}>
          {/* Story Title */}
          <div className="absolute top-6 left-0 right-0 z-20">
            <h1 className="text-2xl md:text-3xl font-spooky bg-gradient-to-r from-spooky-purple-400 via-spooky-pink-400 to-spooky-orange-400 bg-clip-text text-transparent text-center">
              {currentStory.title}
            </h1>
          </div>

          {/* Book Container */}
          <div className="flex-1 flex items-center justify-center w-full -mt-8">
            <div className="w-full flex flex-col items-center gap-3">
              <Book3D
                currentPage={currentPageData}
                story={currentStory}
                imageUrl={imageUrl}
                textPosition={textPosition}
                words={words}
                highlightedWords={highlightedWords}
              />

              <AudioProgressBar
                audioProgress={audioProgress}
                isPlaying={isPlaying}
                isCountingDown={isCountingDown}
                countdown={countdown}
              />

              <NavigationControls
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                isFlipping={isFlipping}
                isPlaying={isPlaying}
                textPosition={textPosition}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
                onTogglePlayPause={handleTogglePlayPause}
                onToggleTextPosition={toggleTextPosition}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
