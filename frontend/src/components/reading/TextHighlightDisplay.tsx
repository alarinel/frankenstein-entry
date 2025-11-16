import { StoryPage, Story } from '@/types';
import { TextPosition } from '@/types/reading';

interface TextHighlightDisplayProps {
  words: string[];
  highlightedWords: Set<number>;
  textPosition: TextPosition;
  currentPage: StoryPage;
  story: Story;
}

/**
 * Text highlight display component for synchronized reading
 * Renders story text with word-by-word highlighting synchronized to audio
 * Supports left, right, or hidden text positioning
 * 
 * @param {TextHighlightDisplayProps} props - Component props
 * @param {string[]} props.words - Array of words from current page text
 * @param {Set<number>} props.highlightedWords - Set of word indices to highlight
 * @param {TextPosition} props.textPosition - Position of text overlay ('left' | 'right' | 'hidden')
 * @param {StoryPage} props.currentPage - Current story page data
 * @param {Story} props.story - Complete story data
 */
export const TextHighlightDisplay = ({
  words,
  highlightedWords,
  textPosition,
  currentPage,
  story,
}: TextHighlightDisplayProps) => {
  if (textPosition === 'hidden') {
    return null;
  }

  return (
    <div 
      className={`absolute top-0 bottom-0 w-full md:w-1/2 flex items-end justify-center z-20 transition-all duration-300 ${
        textPosition === 'right' ? 'right-0' : 'left-0'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'translateZ(15px)',
        padding: 'clamp(0.375rem, 1.2vw, 0.75rem)',
      }}
    >
      <div className="w-full">
        <div className="flex flex-col" style={{ gap: 'clamp(0.25rem, 0.75vh, 0.375rem)' }}>
          {/* Text Content */}
          <div 
            className="relative bg-gradient-to-br from-amber-50/98 via-yellow-50/98 to-orange-50/98 backdrop-blur-md rounded-xl shadow-2xl border border-amber-300/60"
            style={{ padding: 'clamp(0.375rem, 1.2vw, 0.75rem)' }}
          >
            <div 
              className="relative font-serif leading-snug"
              style={{ fontSize: 'clamp(0.7rem, 0.8vw, 0.85rem)' }}
            >
              {words.map((word, index) => (
                <span
                  key={`word-${currentPage.pageNumber}-${index}`}
                  className={`inline-block transition-colors duration-150 ${
                    highlightedWords.has(index)
                      ? 'text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text'
                      : 'text-gray-600'
                  }`}
                  style={{
                    marginRight: 'clamp(0.25rem, 0.4vw, 0.375rem)',
                    marginBottom: 'clamp(0.125rem, 0.3vh, 0.25rem)',
                    fontWeight: 500,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Page Number */}
          <div 
            className="flex flex-col items-center bg-gradient-to-br from-amber-100/95 via-yellow-100/95 to-orange-100/95 backdrop-blur-md rounded-lg shadow-lg border border-amber-300/50"
            style={{ 
              gap: 'clamp(0.125rem, 0.5vh, 0.25rem)',
              padding: 'clamp(0.25rem, 0.75vh, 0.375rem)'
            }}
          >
            <div className="flex items-center" style={{ gap: 'clamp(0.125rem, 0.3vw, 0.25rem)' }}>
              <div 
                className="rounded-full bg-gradient-to-r from-spooky-purple-500 to-spooky-pink-500 animate-pulse" 
                style={{ 
                  width: 'clamp(3px, 0.3vw, 5px)',
                  height: 'clamp(3px, 0.3vw, 5px)'
                }}
              />
              <div 
                className="text-center text-gray-800 font-serif italic font-bold tracking-wide"
                style={{ fontSize: 'clamp(0.5rem, 0.7vw, 0.7rem)' }}
              >
                Page {currentPage.pageNumber} of {story.pages.length}
              </div>
              <div 
                className="rounded-full bg-gradient-to-r from-spooky-pink-500 to-spooky-orange-500 animate-pulse" 
                style={{ 
                  animationDelay: '0.5s',
                  width: 'clamp(3px, 0.3vw, 5px)',
                  height: 'clamp(3px, 0.3vw, 5px)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
