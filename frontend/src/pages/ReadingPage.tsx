import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { useAudioStore } from '@/store/audioStore';
import { Story } from '@/types';
import { ParticleBackground } from '@/components/ParticleBackground';
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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-spooky-950 to-dark-900 flex items-center justify-center p-8">
      <ParticleBackground />

      <div className="max-w-6xl w-full">
        {/* Book Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl shadow-2xl p-12 min-h-[600px]">
            {/* Left Page - Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${currentPage}`}
                initial={{ opacity: 0, rotateY: isFlipping ? -90 : 0 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center"
              >
                <img
                  src={storyApi.getAssetUrl(page.imageUrl)}
                  alt={`Page ${page.pageNumber}`}
                  className="w-full h-auto rounded-lg shadow-lg object-cover max-h-[500px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Right Page - Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentPage}`}
                initial={{ opacity: 0, rotateY: isFlipping ? 90 : 0 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center"
              >
                <div className="font-serif text-gray-800 text-xl leading-relaxed">
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      className={`inline-block mr-1 transition-all duration-300 ${
                        highlightedWords.includes(index)
                          ? 'text-spooky-600 font-bold scale-110'
                          : ''
                      }`}
                      animate={
                        highlightedWords.includes(index)
                          ? { y: [-5, 0], transition: { duration: 0.3 } }
                          : {}
                      }
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>

                {/* Page Number */}
                <div className="mt-8 text-center text-gray-600 font-serif">
                  Page {page.pageNumber}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="px-6 py-3 bg-spooky-700 hover:bg-spooky-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white transition-all shadow-lg"
            >
              ← Previous
            </button>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">{currentStory.title}</p>
              <p className="text-spooky-400">
                {currentPage + 1} / {currentStory.pages.length}
              </p>
            </div>

            <button
              onClick={handleNextPage}
              className="px-6 py-3 bg-spooky-700 hover:bg-spooky-600 rounded-lg text-white transition-all shadow-lg"
            >
              Next →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
