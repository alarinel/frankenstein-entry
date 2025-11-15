import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { useAudioStore } from '@/store/audioStore';

import { SubtleParticleBackground } from '@/components/SubtleParticleBackground';
import { FloatingBats } from '@/components/spooky/FloatingBats';
import { FloatingCandles } from '@/components/spooky/FloatingCandles';
import { FloatingSpiders } from '@/components/spooky/FloatingSpiders';
import { MagicSparkles } from '@/components/spooky/MagicSparkles';
import toast from 'react-hot-toast';

import { useStoryAudio } from '@/hooks/useStoryAudio';
import { useTextHighlighting } from '@/hooks/useTextHighlighting';
import { usePageNavigation } from '@/hooks/usePageNavigation';
import { READING_CONSTANTS } from '@/constants/reading';
import { fetchSunriseSunset, getTimeOfDay, getThemeForTimeOfDay, TimeOfDay } from '@/api/sunriseSunset';

export const ReadingPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { currentStory, setCurrentStory } = useStoryStore();
  const { setCurrentPageAudio, setIsPlaying, isPlaying, cleanup } = useAudioStore();

  const [showPlayPrompt, setShowPlayPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [textPosition, setTextPosition] = useState<'left' | 'right' | 'hidden'>('right');
  const lastSwitchedPageRef = useRef<number>(-1);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const countdownIntervalRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);
  const currentPageRef = useRef(0);

  // Page navigation hook - must be declared before callbacks that use its values
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
    onPageChange: () => {
      // Page change is handled in useEffect below
    },
    onNavigationStart: () => {
      setShowPlayPrompt(false);
      setIsPlaying(false);
      // setCurrentPlayingPage(null);
    },
  });

  // Error handler for audio issues
  const handleAudioError = useCallback((error: unknown, context: string) => {
    console.error(`${context}:`, error);
    toast.error('Failed to load audio. Please try again.');
  }, []);

  // Audio playback callbacks
  const handlePlayStart = useCallback(
    (_pageIndex: number) => {
      setIsPlaying(true);
    },
    [setIsPlaying]
  );

  const handlePlayEnd = useCallback(
    (pageIndex: number) => {
      const actualCurrentPage = currentPageRef.current;
      console.log('handlePlayEnd called for page:', pageIndex, 'actualCurrentPage:', actualCurrentPage, 'canGoNext:', canGoNext, 'isFlipping:', isFlipping);
      
      setIsPlaying(false);

      // Clear any existing timers
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
        autoAdvanceTimeoutRef.current = null;
      }

      // Auto-advance to next page if not manually navigating
      // Check if the page that just finished is the current page and we can go next
      if (!isFlipping && actualCurrentPage === pageIndex && canGoNext) {
        console.log('Starting countdown for auto-advance');
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
          console.log('Auto-advancing to next page');
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          setIsCountingDown(false);
          setCountdown(0);
          nextPage();
        }, READING_CONSTANTS.ANIMATION.AUTO_ADVANCE_DELAY);
      } else {
        console.log('Not auto-advancing. Conditions not met. isFlipping:', isFlipping, 'pageMatch:', actualCurrentPage === pageIndex, 'canGoNext:', canGoNext);
      }
    },
    [setIsPlaying, isFlipping, canGoNext, nextPage]
  );

  // Audio management hook
  const audioHook = useStoryAudio({
    story: currentStory,
    isFlipping,
    onPlayStart: handlePlayStart,
    onPlayEnd: handlePlayEnd,
    onError: handleAudioError,
  });

  // Get current page safely - only depend on story ID and page number
  const currentPageData = useMemo(() => {
    if (!currentStory || !currentStory.pages[currentPage]) {
      return null;
    }
    return currentStory.pages[currentPage];
  }, [currentStory?.id, currentPage, currentStory?.pages]);

  // Text highlighting hook - Re-enabled with performance optimization
  const { highlightedWords, reset: resetHighlighting } = useTextHighlighting({
    text: currentPageData?.text || '',
    duration: currentPageData?.duration || 0,
    isPlaying: isPlaying,
    isActive: !!currentPageData,
  });

  // Memoize words array
  const words = useMemo(() => {
    return currentPageData?.text.split(' ') || [];
  }, [currentPageData?.text]);

  // Memoize image URL - only update when imageUrl string changes
  const imageUrl = useMemo(() => {
    return currentPageData ? storyApi.getAssetUrl(currentPageData.imageUrl) : '';
  }, [currentPageData?.imageUrl]);

  // Load story and fetch time of day on mount
  useEffect(() => {
    loadStory();
    
    // Fetch sunrise/sunset data for dynamic theming
    fetchSunriseSunset().then((data) => {
      const tod = getTimeOfDay(data);
      setTimeOfDay(tod);
    });
    
    return () => {
      cleanup();
      cleanupNavigation();
      // Clear countdown timers
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  // Update current page ref
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Switch to page when currentPage changes - with deduplication
  useEffect(() => {
    if (currentStory && currentStory.pages.length > 0 && currentStory.pages[currentPage]) {
      // Only switch if we haven't already switched to this page
      if (lastSwitchedPageRef.current !== currentPage) {
        lastSwitchedPageRef.current = currentPage;
        audioHook.switchToPage(currentPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentStory?.id]);

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

    // Clear countdown timers
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    setIsCountingDown(false);
    setCountdown(0);

    if (canGoNext) {
      audioHook.stop();
      audioHook.markUserInteracted();
      resetHighlighting();
      nextPage();
    } else {
      // Story complete
      navigate(`/complete/${storyId}`);
    }
  }, [currentStory, canGoNext, nextPage, resetHighlighting, navigate, storyId, audioHook]);

  const handlePreviousPage = useCallback(() => {
    // Clear countdown timers
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    setIsCountingDown(false);
    setCountdown(0);

    if (canGoPrevious) {
      audioHook.stop();
      audioHook.markUserInteracted();
      resetHighlighting();
      previousPage();
    }
  }, [canGoPrevious, previousPage, resetHighlighting, audioHook]);

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

  // Update audio store with current audio ref
  useEffect(() => {
    if (audioHook.audioRef.current) {
      setCurrentPageAudio(audioHook.audioRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCurrentPageAudio]);

  // Track audio progress
  useEffect(() => {
    if (!audioHook.audioRef.current || !isPlaying) return;

    const audio = audioHook.audioRef.current;
    
    const updateProgress = () => {
      const seek = audio.seek();
      const duration = audio.duration();
      
      if (duration > 0) {
        const progress = (seek / duration) * 100;
        setAudioProgress(progress);
        setAudioDuration(duration);
      }
    };

    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [audioHook.audioRef, isPlaying]);

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
      {/* Subtle particle background */}
      <SubtleParticleBackground intensity={theme.intensity as 'light' | 'medium' | 'dark'} />
      
      {/* Floating spooky elements */}
      <FloatingBats count={3} />
      <FloatingSpiders count={4} />
      <FloatingCandles />
      <MagicSparkles isActive={true} />

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 text-4xl animate-float-slow z-10">📚</div>
      <div className="absolute top-4 right-4 text-4xl animate-float z-10" style={{ animationDelay: '0.5s' }}>
        ⭐
      </div>
      <div className="absolute bottom-4 left-4 text-4xl animate-bounce-subtle z-10">🌙</div>
      <div className="absolute bottom-4 right-4 text-4xl animate-bounce-subtle z-10" style={{ animationDelay: '0.7s' }}>
        🎭
      </div>

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

      {/* Back button - top left with higher z-index */}
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

      {/* Main content area - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0">
        <div className="w-full max-w-7xl flex flex-col items-center" style={{ height: '90vh' }}>
          {/* Story Title - Absolute positioned to stay in place */}
          <div className="absolute top-6 left-0 right-0 z-20">
            <h1 className="text-2xl md:text-3xl font-spooky bg-gradient-to-r from-spooky-purple-400 via-spooky-pink-400 to-spooky-orange-400 bg-clip-text text-transparent text-center">
              {currentStory.title}
            </h1>
          </div>

          {/* Book Container - Centered with negative margin to move up */}
          <div className="flex-1 flex items-center justify-center w-full -mt-8">
            <div className="w-full flex flex-col items-center gap-3">

          {/* Book Container with 3D effect and floating animation */}
          <motion.div
            className="relative w-full"
            style={{
              perspective: '3000px',
              perspectiveOrigin: 'center bottom',
            }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
          {/* Book Shadow - Animated with floating */}
          <motion.div 
            className="absolute inset-0 bg-black/40 rounded-3xl blur-2xl transform translate-y-12 scale-105"
            animate={{
              opacity: [0.4, 0.3, 0.4],
              scale: [1.05, 1.08, 1.05],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Book Wrapper with subtle rotation */}
          <motion.div
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateX: [12, 10, 12],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Book Pages with V-shaped Depth Effect */}
            <div
              className="relative"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(12deg)',
              }}
            >
              {/* Stacked Page Layers for depth */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`depth-${i}`}
                  className="absolute inset-0 bg-amber-100 rounded-3xl border border-amber-200"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(-${(i + 1) * 5}px) scale(${1 - i * 0.002})`,
                    opacity: 1 - (i * 0.1),
                    boxShadow: `0 ${2 + i}px ${8 + i * 2}px rgba(0, 0, 0, ${0.2 + i * 0.05})`,
                  }}
                />
              ))}

              {/* Main Book Pages - Full Spread Layout */}
              <div
                className="relative bg-amber-50 rounded-3xl overflow-hidden min-h-[700px]"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(1px)',
                }}
              >
                {/* Page edges with realistic paper effect */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none z-40" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
                  {/* Top edge highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/40 to-transparent" />
                  {/* Bottom edge shadow */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/20 to-transparent" />
                  {/* Left edge */}
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-amber-200/30 to-transparent" />
                  {/* Right edge */}
                  <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-l from-amber-200/30 to-transparent" />
                </div>
                {/* Full Spread Image Background */}
                <div className="absolute inset-0 z-5 rounded-3xl overflow-hidden bg-amber-100">
                  <img
                    src={imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E'}
                    alt={`Page ${currentPageData?.pageNumber || 0}`}
                    className="w-full h-full object-cover"
                    style={{ display: imageUrl ? 'block' : 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
                </div>

                {/* V-Shape Effect - Dark gradient toward center */}
                <div 
                  className="absolute inset-0 z-15 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse 100px 100% at 50% 50%, rgba(0,0,0,0.7) 0%, transparent 100%)
                    `,
                  }}
                />

                {/* Book Spine - Deep shadow in center */}
                <div 
                  className="absolute left-1/2 top-0 bottom-0 w-6 transform -translate-x-1/2 z-30"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateX(-50%) translateZ(-10px)',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.9) 100%)',
                    boxShadow: `
                      inset 0 0 20px rgba(0, 0, 0, 1),
                      0 0 30px rgba(0, 0, 0, 0.8)
                    `,
                  }}
                />

                {/* Text Overlay - Positionable left/right/hidden */}
                {textPosition !== 'hidden' && (
                <div 
                  className={`absolute top-0 bottom-0 w-full md:w-1/2 p-6 md:p-10 flex items-end justify-center z-20 transition-all duration-300 ${
                    textPosition === 'right' ? 'right-0' : 'left-0'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(15px)',
                  }}
                >
                  <div className="w-full">
                      <div className="flex flex-col gap-5">
                        {/* Text Content with premium styling */}
                        <div className="relative bg-gradient-to-br from-amber-50/98 via-yellow-50/98 to-orange-50/98 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-amber-300/60">
                          {/* Decorative corner elements */}
                          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
                          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
                          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg" />
                          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg" />
                          
                          {/* Paper texture overlay */}
                          <div className="absolute inset-0 opacity-[0.03] rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiLz48L3N2Zz4=')]" />
                          
                          <div className="relative font-serif text-base md:text-xl leading-loose">
                            {words.map((word, index) => (
                              <span
                                key={`word-${currentPage}-${index}`}
                                className={`inline-block mr-3 mb-2 transition-all duration-200 ${
                                  highlightedWords.has(index)
                                    ? 'text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text font-bold'
                                    : 'text-amber-50'
                                }`}
                                style={{
                                  textShadow: highlightedWords.has(index)
                                    ? '0 0 25px rgba(168, 85, 247, 0.8), 0 0 15px rgba(236, 72, 153, 0.6)'
                                    : 'none',
                                  transform: highlightedWords.has(index) ? 'scale(1.05)' : 'scale(1)',
                                }}
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Page Number and Audio Visualizer with enhanced styling */}
                        <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-amber-100/95 via-yellow-100/95 to-orange-100/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-amber-300/50">
                          {/* <AudioVisualizer isPlaying={isPlaying} /> */}
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-spooky-purple-500 to-spooky-pink-500 animate-pulse" />
                            <div className="text-center text-gray-800 font-serif italic text-base font-bold tracking-wide">
                              Page {currentPageData.pageNumber} of {currentStory.pages.length}
                            </div>
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-spooky-pink-500 to-spooky-orange-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </motion.div>
          </motion.div>

          {/* Audio Progress Bar and Countdown */}
          <div className="relative z-20 w-full max-w-2xl mt-4">
            <div className="bg-dark-800/80 backdrop-blur-sm rounded-xl p-4 border border-spooky-purple-600/30">
              {/* Progress Bar */}
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-spooky-purple-500 via-spooky-pink-500 to-spooky-orange-500 transition-all duration-100"
                  style={{
                    width: `${audioProgress}%`,
                  }}
                />
              </div>
              
              {/* Status Text */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  {isPlaying ? '🎵 Playing...' : isCountingDown ? `⏳ Next page in ${countdown}s` : '⏸️ Paused'}
                </span>
                <span className="text-spooky-purple-300 font-mono">
                  {Math.floor(audioProgress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Controls with 3D buttons */}
          <div className="relative z-20 flex flex-col md:flex-row justify-between items-center mt-3 gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={!canGoPrevious || isFlipping}
              className="group relative px-6 py-3 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              style={{
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
              }}
              aria-label="Go to previous page"
            >
              <span className="text-xl mr-2 group-hover:animate-bounce">🦇</span>
              <span className="hidden md:inline">Previous</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlayPause}
                className={`group relative p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  isPlaying 
                    ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 shadow-red-500/30' 
                    : 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:via-green-500 hover:to-green-600 shadow-green-500/30'
                }`}
                style={{
                  boxShadow: `0 8px 25px ${isPlaying ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                }}
                aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
                aria-pressed={isPlaying}
              >
                <span className={`text-2xl text-white transition-transform duration-200 ${
                  isPlaying ? 'group-hover:scale-110' : 'group-hover:scale-110 group-hover:translate-x-0.5'
                }`}>
                  {isPlaying ? '⏸️' : '▶️'}
                </span>
              </button>
              
              <button
                onClick={toggleTextPosition}
                className="group relative p-3 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 rounded-xl transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                style={{
                  boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                aria-label={`Text position: ${textPosition}`}
                title={`Text: ${textPosition === 'right' ? 'Right' : textPosition === 'left' ? 'Left' : 'Hidden'}`}
              >
                <span className="text-lg group-hover:animate-pulse">
                  {textPosition === 'right' ? '➡️' : textPosition === 'left' ? '⬅️' : '👁️'}
                </span>
              </button>
            </div>

            <button
              onClick={handleNextPage}
              disabled={isFlipping}
              className="group relative px-6 py-3 bg-gradient-to-br from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 hover:from-spooky-purple-500 hover:via-spooky-pink-500 hover:to-spooky-orange-500 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              style={{
                boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
              }}
              aria-label={canGoNext ? 'Go to next page' : 'Complete story'}
            >
              <span className="hidden md:inline">{canGoNext ? 'Next' : 'Complete'}</span>
              <span className="text-xl ml-2 group-hover:animate-bounce">
                {canGoNext ? '📖' : '✨'}
              </span>
            </button>
          </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};
