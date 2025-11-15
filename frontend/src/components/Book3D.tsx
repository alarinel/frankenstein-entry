import { motion } from 'framer-motion';
import { Story, StoryPage } from '@/types';

interface Book3DProps {
  currentPage: StoryPage;
  story: Story;
  imageUrl: string;
  textPosition: 'left' | 'right' | 'hidden';
  words: string[];
  highlightedWords: Set<number>;
}

export const Book3D = ({
  currentPage,
  story,
  imageUrl,
  textPosition,
  words,
  highlightedWords,
}: Book3DProps) => {
  return (
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
      {/* Book Shadow */}
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

      {/* Book Wrapper */}
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
        <div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(12deg)',
          }}
        >
          {/* Stacked Page Layers */}
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

          {/* Main Book Pages */}
          <div
            className="relative bg-amber-50 rounded-3xl overflow-hidden min-h-[700px]"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(1px)',
            }}
          >
            {/* Image */}
            <div className="absolute inset-0 z-5 rounded-3xl overflow-hidden bg-amber-100">
              <img
                src={imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E'}
                alt={`Page ${currentPage?.pageNumber || 0}`}
                className="w-full h-full object-cover"
                style={{ display: imageUrl ? 'block' : 'none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
            </div>

            {/* V-Shape Effect */}
            <div 
              className="absolute inset-0 z-15 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 100px 100% at 50% 50%, rgba(0,0,0,0.7) 0%, transparent 100%)`,
              }}
            />

            {/* Spine */}
            <div 
              className="absolute left-1/2 top-0 bottom-0 w-6 transform -translate-x-1/2 z-30"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateX(-50%) translateZ(-10px)',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.9) 100%)',
                boxShadow: `inset 0 0 20px rgba(0, 0, 0, 1), 0 0 30px rgba(0, 0, 0, 0.8)`,
              }}
            />

            {/* Text Overlay */}
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
                    {/* Text Content */}
                    <div className="relative bg-gradient-to-br from-amber-50/98 via-yellow-50/98 to-orange-50/98 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-amber-300/60">
                      <div className="relative font-serif text-base md:text-xl leading-loose">
                        {words.map((word, index) => (
                          <span
                            key={`word-${currentPage.pageNumber}-${index}`}
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

                    {/* Page Number */}
                    <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-amber-100/95 via-yellow-100/95 to-orange-100/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-amber-300/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-spooky-purple-500 to-spooky-pink-500 animate-pulse" />
                        <div className="text-center text-gray-800 font-serif italic text-base font-bold tracking-wide">
                          Page {currentPage.pageNumber} of {story.pages.length}
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
  );
};
