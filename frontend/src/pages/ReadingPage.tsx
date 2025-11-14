import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { useAudioStore } from '@/store/audioStore';

import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingCandles } from '@/components/spooky/FloatingCandles';
import { FloatingBats } from '@/components/spooky/FloatingBats';
import { AudioVisualizer } from '@/components/spooky/AudioVisualizer';
import { MagicSparkles } from '@/components/spooky/MagicSparkles';
import { BookPage3D } from '@/components/spooky/BookPage3D';
import { SpookyButton } from '@/components/spooky/SpookyButton';
import toast from 'react-hot-toast';

export const ReadingPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { currentStory, setCurrentStory } = useStoryStore();
  const {
    setCurrentPageAudio,
    setIsPlaying,
    isPlaying,
    currentPage,
    setCurrentPage,
    cleanup,
  } = useAudioStore();

  const [isFlipping, setIsFlipping] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<number[]>([]);
  const [showPlayPrompt, setShowPlayPrompt] = useState(true);
  const audioRef = useRef<Howl | null>(null);
  const allAudioRef = useRef<Map<number, Howl>>(new Map());
  const hasUserInteracted = useRef(false);

  useEffect(() => {
    loadStory();
    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.unload();
        audioRef.current = null;
      }
      cleanup();
    };
  }, [storyId]);

  useEffect(() => {
    if (currentStory && currentStory.pages.length > 0 && currentStory.pages[currentPage]) {
      loadPageAudio(currentPage);
    }
    
    // Cleanup function to stop audio when page changes
    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current.unload();
      }
      setHighlightedWords([]);
      setIsPlaying(false);
    };
  }, [currentPage, currentStory?.id]); // Only depend on currentPage and story ID, not entire story object

  const loadStory = async () => {
    if (!storyId) {
      navigate('/');
      return;
    }

    try {
      const story = await storyApi.getStory(storyId);
      setCurrentStory(story);
      setCurrentPage(0);
    } catch (error) {
      toast.error('Failed to load story');
      navigate('/');
    }
  };

  const loadPageAudio = (pageIndex: number) => {
    if (!currentStory || !currentStory.pages[pageIndex]) return;

    // Clean up previous audio completely
    if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current.unload();
      audioRef.current = null;
    }

    const page = currentStory.pages[pageIndex];
    const audioUrl = storyApi.getAssetUrl(page.narrationUrl);

    const howl = new Howl({
      src: [audioUrl],
      html5: true,
      preload: true,
      onplay: () => {
        setIsPlaying(true);
        startTextHighlighting(page.text, page.duration);
      },
      onend: () => {
        setIsPlaying(false);
        setHighlightedWords([]);

        // Auto-advance to next page only if not manually navigating
        if (!isFlipping) {
          setTimeout(() => {
            handleNextPage();
          }, 2000);
        }
      },
      onloaderror: (_id: number, error: unknown) => {
        console.error('Audio load error:', error);
        toast.error('Failed to load audio');
      },
      onplayerror: (_id: number, error: unknown) => {
        console.error('Audio playback error:', error);
        toast.error('Audio playback failed');
      },
    });

    audioRef.current = howl;
    setCurrentPageAudio(howl);

    // Only auto-play if user has already interacted
    if (hasUserInteracted.current) {
      setTimeout(() => {
        if (audioRef.current === howl) {
          howl.play();
        }
      }, 500);
    } else {
      // Show play prompt for first interaction
      setShowPlayPrompt(true);
    }
  };

  const handleStartReading = () => {
    hasUserInteracted.current = true;
    setShowPlayPrompt(false);
    
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const startTextHighlighting = (text: string, duration: number) => {
    const words = text.split(' ');
    const timePerWord = duration / words.length;

    words.forEach((_, index) => {
      setTimeout(() => {
        setHighlightedWords((prev) => [...prev, index]);
      }, timePerWord * 1000 * index);
    });
  };

  const handleNextPage = () => {
    if (!currentStory || isFlipping) return;

    hasUserInteracted.current = true;
    setShowPlayPrompt(false);

    // Stop current audio
    if (audioRef.current) {
      audioRef.current.stop();
    }

    if (currentPage < currentStory.pages.length - 1) {
      setIsFlipping(true);
      setHighlightedWords([]);
      setIsPlaying(false);

      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 800);
    } else {
      // Story complete
      navigate(`/complete/${storyId}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0 && !isFlipping) {
      hasUserInteracted.current = true;
      setShowPlayPrompt(false);

      // Stop current audio
      if (audioRef.current) {
        audioRef.current.stop();
      }

      setIsFlipping(true);
      setHighlightedWords([]);
      setIsPlaying(false);

      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 800);
    }
  };

  const handleTogglePlayPause = () => {
    if (!audioRef.current) return;

    hasUserInteracted.current = true;
    setShowPlayPrompt(false);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!currentStory || !currentStory.pages[currentPage]) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin text-4xl">📚</div>
      </div>
    );
  }

  const page = currentStory.pages[currentPage];
  const words = page.text.split(' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      <ParticleBackground />
      <FloatingCandles />
      <FloatingBats count={3} />

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
              <SpookyButton onClick={handleStartReading} variant="primary" className="text-xl px-8 py-4">
                <span className="text-2xl mr-3">▶️</span>
                Start Reading
                <span className="text-2xl ml-3">✨</span>
              </SpookyButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl w-full z-10">
        {/* Story Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-spooky bg-gradient-to-r from-spooky-purple-400 via-spooky-pink-400 to-spooky-orange-400 bg-clip-text text-transparent">
            {currentStory.title}
          </h1>
        </motion.div>

        {/* Book Container with 3D effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          className="relative"
          style={{
            perspective: '2000px',
          }}
        >
          {/* Sparkles during page flip */}
          <MagicSparkles isActive={isFlipping} />

          {/* Book Shadow - Multiple layers for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-spooky-purple-900/40 to-spooky-pink-900/40 rounded-3xl blur-3xl transform translate-y-8" />
          <div className="absolute inset-0 bg-black/30 rounded-3xl blur-2xl transform translate-y-6 scale-95" />
          <div className="absolute inset-0 bg-black/20 rounded-3xl blur-xl transform translate-y-4 scale-98" />

          {/* Book Pages with Concave Effect */}
          <div
            className="relative grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-1 bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50 rounded-3xl overflow-hidden min-h-[600px]"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: `
                0 30px 60px -15px rgba(0, 0, 0, 0.6),
                0 20px 40px -10px rgba(0, 0, 0, 0.4),
                0 10px 20px -5px rgba(0, 0, 0, 0.3),
                inset 0 2px 4px 0 rgba(255, 255, 255, 0.3),
                inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)
              `,
            }}
          >
            {/* Book Spine with depth */}
            <div 
              className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 transform -translate-x-1/2 hidden md:block z-20"
              style={{
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.3)',
              }}
            />

            {/* Left Page - Image with concave effect */}
            <div 
              className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'perspective(2000px) rotateY(3deg)',
                boxShadow: `
                  inset -30px 0 50px -20px rgba(0, 0, 0, 0.25),
                  inset -10px 0 20px -10px rgba(0, 0, 0, 0.15),
                  inset 0 10px 20px -10px rgba(0, 0, 0, 0.1),
                  inset 0 -10px 20px -10px rgba(0, 0, 0, 0.1)
                `,
              }}
            >
              <AnimatePresence mode="wait">
                <BookPage3D
                  key={`image-${currentPage}`}
                  side="left"
                  isFlipping={isFlipping}
                  pageKey={`image-${currentPage}`}
                >
                  <div className="flex items-center justify-center h-full">
                    <motion.img
                      src={storyApi.getAssetUrl(page.imageUrl)}
                      alt={`Page ${page.pageNumber}`}
                      className="w-full h-auto rounded-xl shadow-2xl object-cover max-h-[500px] border-4 border-amber-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                  </div>
                </BookPage3D>
              </AnimatePresence>
            </div>

            {/* Right Page - Text with concave effect */}
            <div 
              className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-50"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'perspective(2000px) rotateY(-3deg)',
                boxShadow: `
                  inset 30px 0 50px -20px rgba(0, 0, 0, 0.25),
                  inset 10px 0 20px -10px rgba(0, 0, 0, 0.15),
                  inset 0 10px 20px -10px rgba(0, 0, 0, 0.1),
                  inset 0 -10px 20px -10px rgba(0, 0, 0, 0.1)
                `,
              }}
            >
              <AnimatePresence mode="wait">
                <BookPage3D
                  key={`text-${currentPage}`}
                  side="right"
                  isFlipping={isFlipping}
                  pageKey={`text-${currentPage}`}
                >
                  <div className="flex flex-col justify-between h-full">
                    {/* Text Content */}
                    <div className="flex-1 flex items-center">
                      <div className="font-serif text-gray-800 text-lg md:text-xl leading-loose">
                        {words.map((word, index) => (
                          <span
                            key={index}
                            className={`inline-block mr-2 transition-all duration-300 ${
                              highlightedWords.includes(index)
                                ? 'text-transparent bg-gradient-to-r from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 bg-clip-text font-bold'
                                : 'text-gray-700'
                            }`}
                            style={{
                              textShadow: highlightedWords.includes(index)
                                ? '0 0 20px rgba(168, 85, 247, 0.5)'
                                : 'none',
                              transform: highlightedWords.includes(index) ? 'scale(1.05)' : 'scale(1)',
                            }}
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Page Number and Audio Visualizer */}
                    <div className="mt-6 flex flex-col items-center gap-3">
                      <AudioVisualizer isPlaying={isPlaying} />
                      <div className="text-center text-gray-600 font-serif italic text-sm">
                        Page {page.pageNumber} of {currentStory.pages.length}
                      </div>
                    </div>
                  </div>
                </BookPage3D>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <SpookyButton
              onClick={handlePreviousPage}
              disabled={currentPage === 0 || isFlipping}
              variant="secondary"
              className="w-full md:w-auto"
            >
              <span className="text-xl mr-2">🦇</span>
              Previous Page
            </SpookyButton>

            <div className="flex items-center gap-4">
              <SpookyButton
                onClick={handleTogglePlayPause}
                variant="ghost"
                className="w-full md:w-auto"
              >
                {isPlaying ? (
                  <>
                    <span className="text-xl mr-2">⏸️</span>
                    Pause
                  </>
                ) : (
                  <>
                    <span className="text-xl mr-2">▶️</span>
                    Play
                  </>
                )}
              </SpookyButton>
            </div>

            <SpookyButton
              onClick={handleNextPage}
              disabled={isFlipping}
              variant="primary"
              className="w-full md:w-auto"
            >
              Next Page
              <span className="text-xl ml-2">📖</span>
            </SpookyButton>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="h-2 bg-dark-800/80 rounded-full overflow-hidden border border-spooky-purple-600/30">
            <motion.div
              className="h-full bg-gradient-to-r from-spooky-purple-600 via-spooky-pink-500 to-spooky-orange-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentPage + 1) / currentStory.pages.length) * 100}%`,
              }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%]" />
            </motion.div>
          </div>
          <p className="text-center text-spooky-purple-300 text-xs mt-2 font-fun">
            {currentPage + 1} of {currentStory.pages.length} pages
          </p>
        </div>
      </div>
    </div>
  );
};
