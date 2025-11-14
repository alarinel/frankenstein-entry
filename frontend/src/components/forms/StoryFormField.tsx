import { motion, AnimatePresence } from 'framer-motion';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { SpookyCard } from '@/components/spooky/SpookyCard';
import { ANIMATION_TIMINGS } from '@/pages/InputPage.constants';

interface Suggestion {
  label: string;
  value: string;
}

interface FormField {
  name: string;
  label: string;
  placeholder: string;
  emoji: string;
  suggestions: Suggestion[];
}

interface StoryFormFieldProps {
  field: FormField;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSuggestionClick: (value: string) => void;
  onEnterPress: () => void;
}

export const StoryFormField = ({
  field,
  register,
  errors,
  onSuggestionClick,
  onEnterPress,
}: StoryFormFieldProps) => {
  return (
    <SpookyCard className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <motion.span
          className="text-5xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: ANIMATION_TIMINGS.EMOJI_ROTATION_DURATION, repeat: Infinity }}
        >
          {field.emoji}
        </motion.span>
        <label className="block text-3xl font-fun font-bold text-transparent bg-clip-text bg-gradient-to-r from-spooky-purple-300 to-spooky-pink-300">
          {field.label}
        </label>
      </div>

      <motion.input
        {...register(field.name)}
        type="text"
        placeholder={field.placeholder}
        className="w-full bg-dark-800/50 border-2 border-spooky-purple-600/50 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-spooky-purple-500/50 focus:border-spooky-purple-400 transition-all text-lg font-fun backdrop-blur-sm"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnterPress();
          }
        }}
        autoFocus
        whileFocus={{ scale: 1.02 }}
      />

      <AnimatePresence>
        {errors[field.name] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-sm mt-2 flex items-center gap-2"
          >
            <span>⚠️</span>
            {errors[field.name]?.message as string}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Suggestions */}
      <div className="mt-6">
        <p className="text-sm text-spooky-purple-300 mb-3 font-fun font-semibold flex items-center gap-2">
          <span>💡</span>
          Quick suggestions:
        </p>
        <div className="flex flex-wrap gap-2">
          {field.suggestions.map((suggestion, index) => (
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
    </SpookyCard>
  );
};
