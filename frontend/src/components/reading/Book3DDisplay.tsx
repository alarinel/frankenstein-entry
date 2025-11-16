import { motion } from 'framer-motion';
import { Story, StoryPage } from '@/types';
import { TextHighlightDisplay } from './TextHighlightDisplay';

interface Book3DDisplayProps {
  currentPage: StoryPage;
  story: Story;
  imageUrl: string;
  textPosition: 'left' | 'right' | 'hidden';
  words: string[];
  highlightedWords: Set<number>;
}

export const Book3DDisplay = ({
  currentPage,
  story,
  imageUrl,
  textPosition,
  words,
  highlightedWords,
}: Book3DDisplayProps) => {
  return (
    <motion.div
      className="relative z-20"
      style={{
        perspective: '3000px',
        perspectiveOrigin: 'center bottom',
        maxWidth: 'min(90vw, 1200px)',
        width: '100%',
        margin: '0 auto',
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
          {/* Main Book Pages - Define size here */}
          <div
            className="relative bg-amber-50 rounded-3xl overflow-hidden mx-auto"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(1px)',
              height: 'clamp(500px, min(70vh, 750px), 1400px)',
              width: 'min(100%, calc((clamp(500px, min(70vh, 750px), 1400px)) * 4 / 3))',
              maxWidth: '1700px',
            }}
          >
            {/* Stacked Page Layers - positioned relative to main book */}
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
              className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 z-30"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateX(-50%) translateZ(-10px)',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.9) 100%)',
                boxShadow: `inset 0 0 20px rgba(0, 0, 0, 1), 0 0 30px rgba(0, 0, 0, 0.8)`,
                width: 'clamp(4px, 0.5vw, 24px)',
              }}
            />

            {/* Text Overlay */}
            <TextHighlightDisplay
              words={words}
              highlightedWords={highlightedWords}
              textPosition={textPosition}
              currentPage={currentPage}
              story={story}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
