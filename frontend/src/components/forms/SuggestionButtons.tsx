import { memo } from 'react';
import { motion } from 'framer-motion';
import { ANIMATION_TIMINGS } from '@/pages/InputPage.constants';

interface Suggestion {
  label: string;
  value: string;
}

interface SuggestionButtonsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (value: string) => void;
}

export const SuggestionButtons = memo(({ suggestions, onSuggestionClick }: SuggestionButtonsProps) => {
  return (
    <div className="mt-6">
      <p className="text-sm text-spooky-purple-300 mb-3 font-fun font-semibold flex items-center gap-2">
        <span>💡</span>
        Quick suggestions:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.value}
            type="button"
            onClick={() => onSuggestionClick(suggestion.value)}
            className="px-4 py-2 bg-gradient-to-r from-spooky-purple-800/60 to-spooky-purple-700/60 hover:from-spooky-purple-700 hover:to-spooky-purple-600 border-2 border-spooky-purple-600/40 hover:border-spooky-purple-500 rounded-full text-sm text-spooky-purple-200 transition-all font-fun font-medium backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * ANIMATION_TIMINGS.SUGGESTION_STAGGER_DELAY }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {suggestion.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
});

SuggestionButtons.displayName = 'SuggestionButtons';
