import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { useAudioStore } from '@/store/audioStore';

import { SubtleParticleBackground } from '@/components/SubtleParticleBackground';
import { FloatingBats } from '@/components/spooky/FloatingBats';
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
  const [textPosition, setTextPosition] = useState<'left' | 'right'>('right');
  const lastSwitchedPageRef = useRef<number>(-1);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');

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
      setIsPlaying(false);

      // Auto-advance to next page if not manually navigating
      if (!isFlipping && currentPage === pageIndex && canGoNext) {
        setTimeout(() => {
          nextPage();
        }, READING_CONSTANTS.ANIMATION.AUTO_ADVANCE_DELAY);
      }
    },
    [setIsPlaying, isFlipping, currentPage, canGoNext, nextPage]
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

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
    setTextPosition(prev => prev === 'right' ? 'left' : 'right');
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
      
      {/* Floating bats */}
      <FloatingBats count={4} />

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 text-4xl animate-float-slow">📚</div>
      <div className="absolute top-4 right-4 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>
        ⭐
      </div>
      <div className="absolute bottom-4 left-4 text-4xl animate-bounce-subtle">🌙</div>
      <div className="absolute bottom-4 right-4 text-4xl animate-bounce-subtle" style={{ animationDelay: '0.7s' }}>
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
        <div className="max-w-7xl w-full flex flex-col items-center gap-4">

          {/* Story Title */}
          <h1 className="text-2xl md:text-3xl font-spooky bg-gradient-to-r from-spooky-purple-400 via-spooky-pink-400 to-spooky-orange-400 bg-clip-text text-transparent text-center">
            {currentStory.title}
          </h1>

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
              rotateX: [30, 28, 30],
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
                transform: 'rotateX(30deg)',
              }}
            >
              {/* Stacked Page Layers for depth - Optimized to prevent flickering */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={`depth-${i}`}
                  className="absolute inset-0 bg-amber-100 rounded-3xl"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(-${(i + 1) * 3}px)`,
                    opacity: 1 - (i * 0.15),
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
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
                {/* Book Spine with dramatic V-shaped depth */}
                <div 
                  className="absolute left-1/2 top-0 bottom-0 w-6 transform -translate-x-1/2 hidden md:block z-30"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateX(-50%) translateZ(-20px)',
                    background: 'linear-gradient(to bottom, #78350f 0%, #451a03 50%, #1c0a00 100%)',
                    boxShadow: `
                      inset 0 0 40px rgba(0, 0, 0, 0.9),
                      inset -2px 0 10px rgba(0, 0, 0, 0.8),
                      inset 2px 0 10px rgba(0, 0, 0, 0.8),
                      0 0 30px rgba(0, 0, 0, 0.6)
                    `,
                  }}
                >
                  {/* Spine texture lines */}
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 h-px bg-black"
                        style={{ top: `${i * 5}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Full Spread Image Background - Covers entire book */}
                <div className="absolute inset-0 z-10 rounded-3xl overflow-hidden bg-amber-100">
                  <img
                    src={imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E'}
                    alt={`Page ${currentPageData?.pageNumber || 0}`}
                    className="w-full h-full object-cover"
                    style={{ display: imageUrl ? 'block' : 'none' }}
                  />
                  {/* Enhanced gradient overlays for depth and readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
                  {/* Vignette effect */}
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />
                </div>

                {/* Left Page - Subtle shadow for depth */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none"
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: 15,
                    boxShadow: `inset -40px 0 60px -30px rgba(0, 0, 0, 0.3)`,
                  }}
                />

                {/* Right Page - Subtle shadow for depth */}
                <div 
                  className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: 15,
                    boxShadow: `inset 40px 0 60px -30px rgba(0, 0, 0, 0.3)`,
                  }}
                />

                {/* Text Overlay - Positionable left or right */}
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
                          
                          <div className="relative font-serif text-gray-900 text-base md:text-xl leading-loose">
                            {words.map((word, index) => (
                              <span
                                key={`word-${currentPage}-${index}`}
                                className={`inline-block mr-3 mb-2 transition-all duration-200 ${
                                  highlightedWords.has(index)
                                    ? 'text-transparent bg-gradient-to-r from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 bg-clip-text font-bold'
                                    : 'text-gray-800'
                                }`}
                                style={{
                                  textShadow: highlightedWords.has(index)
                                    ? '0 0 15px rgba(168, 85, 247, 0.4)'
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
              </div>
            </div>
          </motion.div>
          </motion.div>

          {/* Navigation Controls with 3D buttons */}
          <div className="relative z-20 flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
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
                aria-label="Toggle text position"
              >
                <span className="text-lg group-hover:animate-pulse">
                  {textPosition === 'right' ? '⬅️' : '➡️'}
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

          {/* Progress indicator */}
          <div className="w-full max-w-md mt-4">
            <div className="h-2 bg-dark-800/80 rounded-full overflow-hidden border border-spooky-purple-600/30">
              <div
                className="h-full bg-gradient-to-r from-spooky-purple-600 via-spooky-pink-500 to-spooky-orange-500 transition-all duration-300"
                style={{
                  width: `${((currentPage + 1) / currentStory.pages.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-center text-spooky-purple-300 text-sm mt-2 font-fun">
              Page {currentPage + 1} of {currentStory.pages.length}
            </p>
          </div>
      </div>
    </div>
  );
};
