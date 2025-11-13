import { memo } from 'react';

interface HighlightedWordProps {
  word: string;
  isHighlighted: boolean;
  pageIndex: number;
  wordIndex: number;
}

const BASE_CLASSES = 'inline-block mr-2 mb-1 transition-all duration-200';
const HIGHLIGHTED_CLASSES = 'text-transparent bg-gradient-to-r from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 bg-clip-text font-bold scale-105 [text-shadow:0_0_20px_rgba(168,85,247,0.5)]';
const NORMAL_CLASSES = 'text-gray-800 scale-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]';

export const HighlightedWord = memo(({ word, isHighlighted }: HighlightedWordProps) => {
  return (
    <span
      className={`${BASE_CLASSES} ${isHighlighted ? HIGHLIGHTED_CLASSES : NORMAL_CLASSES}`}
    >
      {word}
    </span>
  );
});

HighlightedWord.displayName = 'HighlightedWord';
