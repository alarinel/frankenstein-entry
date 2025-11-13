import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { useAudioStore } from '@/store/audioStore';
import { Story } from '@/types';
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
  const audioRef = useRef<Howl | null>(null);

  useEffect(() => {
    loadStory();
    return () => {
      cleanup();
    };
  }, [storyId]);

  useEffect(() => {
    if (currentStory && currentStory.pages.length > 0) {
      loadPageAudio(currentPage);
    }
  }, [currentPage, currentStory]);

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

    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.unload();
    }

    const page = currentStory.pages[pageIndex];
    const audioUrl = storyApi.getAssetUrl(page.narrationUrl);

    const howl = new Howl({
      src: [audioUrl],
      html5: true,
      onplay: () => {
        setIsPlaying(true);
        startTextHighlighting(page.text, page.duration);
      },
      onend: () => {
        setIsPlaying(false);
        setHighlightedWords([]);

        // Auto-advance to next page
        setTimeout(() => {
          handleNextPage();
        }, 2000);
      },
      onerror: (id, error) => {
        console.error('Audio playback error:', error);
        toast.error('Audio playback failed');
      },
    });

    audioRef.current = howl;
    setCurrentPageAudio(howl);

    // Auto-play
    setTimeout(() => {
      howl.play();
    }, 500);
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
    if (!currentStory) return;

    if (currentPage < currentStory.pages.length - 1) {
      setIsFlipping(true);
      setHighlightedWords([]);

      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 1000);
    } else {
      // Story complete
      navigate(`/complete/${storyId}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true);
      setHighlightedWords([]);

      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 1000);
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

          {/* Book Shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-spooky-purple-900/40 to-spooky-pink-900/40 rounded-3xl blur-3xl transform translate-y-8" />

          {/* Book Pages */}
          <div
            className="relative grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-1 bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50 rounded-3xl shadow-2xl overflow-hidden min-h-[600px]"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Book Spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 transform -translate-x-1/2 hidden md:block shadow-lg z-20" />

            {/* Left Page - Image */}
            <div className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
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

            {/* Right Page - Text */}
            <div className="relative p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-50">
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
                      <div className="font-serif text-gray-800 text-lg md:text-xl leading-relaxed">
                        {words.map((word, index) => (
                          <motion.span
                            key={index}
                            className={`inline-block mr-1.5 transition-all duration-300 ${
                              highlightedWords.includes(index)
                                ? 'text-transparent bg-gradient-to-r from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 bg-clip-text font-bold scale-110'
                                : 'text-gray-700'
                            }`}
                            style={{
                              textShadow: highlightedWords.includes(index)
                                ? '0 0 20px rgba(168, 85, 247, 0.5)'
                                : 'none',
                            }}
                            animate={
                              highlightedWords.includes(index)
                                ? {
                                    y: [-8, 0],
                                    scale: [1, 1.15, 1.1],
                                    transition: { duration: 0.4, type: 'spring' },
                                  }
                                : {}
                            }
                          >
                            {word}
                          </motion.span>
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
              disabled={currentPage === 0}
              variant="secondary"
              className="w-full md:w-auto"
            >
              <span className="text-xl mr-2">🦇</span>
              Previous Page
            </SpookyButton>

            <div className="flex items-center gap-4 text-center">
              <motion.div
                className="px-6 py-3 bg-dark-800/80 backdrop-blur-sm rounded-full border-2 border-spooky-purple-600/30 shadow-lg"
                animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
              >
                <p className="text-spooky-purple-300 font-fun text-sm">
                  {isPlaying ? '🎵 Playing...' : '⏸️ Paused'}
                </p>
              </motion.div>
            </div>

            <SpookyButton
              onClick={handleNextPage}
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
