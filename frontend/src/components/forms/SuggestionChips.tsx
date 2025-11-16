import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Suggestion } from '@/types';

interface SuggestionChipsProps {
  suggestions: readonly Suggestion[];
  onSelect: (value: string) => void;
}

const MAX_SUGGESTIONS = 6;

/**
 * Randomly selects a subset of suggestions
 * Uses Fisher-Yates shuffle algorithm for fair randomization
 */
const getRandomSuggestions = (suggestions: readonly Suggestion[], count: number): Suggestion[] => {
  if (suggestions.length <= count) {
    return [...suggestions];
  }

  const shuffled = [...suggestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
};

/**
 * Suggestion chips component for quick form input
 * Renders animated suggestion buttons with click handlers
 * Displays a maximum of 6 random suggestions to save space
 */
export const SuggestionChips = ({ suggestions, onSelect }: SuggestionChipsProps) => {
  // Memoize random selection to prevent re-shuffling on every render
  const displayedSuggestions = useMemo(
    () => getRandomSuggestions(suggestions, MAX_SUGGESTIONS),
    [suggestions]
  );

  if (displayedSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-spooky-purple-300 mb-3 font-fun font-semibold flex items-center gap-2">
        <span>💡</span>
        Quick suggestions:
      </p>
      <div className="flex flex-wrap gap-2">
        {displayedSuggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.value}
            type="button"
            onClick={() => onSelect(suggestion.value)}
            className="px-4 py-2 bg-spooky-purple-800/60 hover:bg-spooky-purple-700 border-2 border-spooky-purple-600/40 hover:border-spooky-purple-500 rounded-full text-sm text-spooky-purple-200 transition-all duration-100 font-fun font-medium backdrop-blur-sm hover:scale-105 active:scale-95"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
          >
            {suggestion.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
