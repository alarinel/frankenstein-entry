import { motion, AnimatePresence } from 'framer-motion';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { SpookyCard } from '@/components/spooky/SpookyCard';
import { SuggestionChips } from './SuggestionChips';
import { ThemeSelector } from '@/components/ThemeSelector';
import { VoiceSelector } from '@/components/VoiceSelector';
import { FormField } from '@/types/forms';

interface StoryFormFieldProps {
  field: FormField;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSuggestionClick: (value: string) => void;
  onNext: () => void;
  setValue?: UseFormSetValue<any>;
  currentValue?: any;
}

/**
 * Individual form field component for story input
 * Renders emoji, label, input field, error display, and suggestions
 * Handles Enter key navigation and custom selector components
 */
export const StoryFormField = ({
  field,
  register,
  errors,
  onSuggestionClick,
  onNext,
  setValue,
  currentValue,
}: StoryFormFieldProps) => {
  const fieldType = field.type || 'text';

  return (
    <SpookyCard style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
      {/* Field Label with Emoji */}
      <div 
        className="flex items-center"
        style={{ 
          gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
          marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
        }}
      >
        <motion.span
          style={{ fontSize: 'clamp(2.5rem, 5vw, 3rem)' }}
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          {field.emoji}
        </motion.span>
        <label 
          className="block font-fun font-bold text-transparent bg-clip-text bg-gradient-to-r from-spooky-purple-300 to-spooky-pink-300"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)' }}
        >
          {field.label}
        </label>
      </div>

      {/* Conditional Field Rendering */}
      {fieldType === 'theme-selector' && setValue ? (
        <>
          {/* Hidden input for form validation */}
          <input
            {...register(field.name)}
            type="hidden"
            value={currentValue || ''}
          />
          <ThemeSelector
            selectedTheme={currentValue}
            onSelect={(theme) => {
              setValue(field.name, theme, { shouldValidate: true });
              // Auto-advance after selection
              setTimeout(() => onNext(), 300);
            }}
          />
        </>
      ) : fieldType === 'voice-selector' && setValue ? (
        <>
          {/* Hidden input for form validation */}
          <input
            {...register(field.name)}
            type="hidden"
            value={currentValue || ''}
          />
          <VoiceSelector
            selectedVoice={currentValue}
            onSelect={(voice) => {
              // Set the value first
              setValue(field.name, voice, { shouldValidate: true });
              // Auto-advance after selection - no need to wait for watch to update
              // The form state will have the value even if watch hasn't updated yet
              setTimeout(() => onNext(), 300);
            }}
          />
        </>
      ) : (
        <>
          {/* Text Input Field */}
          <input
            {...register(field.name)}
            type="text"
            placeholder={field.placeholder}
            className="w-full bg-dark-800/50 border-2 border-spooky-purple-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-spooky-purple-500/50 focus:border-spooky-purple-400 transition-colors font-fun backdrop-blur-sm"
            style={{ 
              padding: 'clamp(0.75rem, 1.5vh, 1rem) clamp(1rem, 2vw, 1.25rem)',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onNext();
              }
            }}
            autoFocus
          />

          {/* Suggestion Chips */}
          <SuggestionChips
            suggestions={field.suggestions}
            onSelect={onSuggestionClick}
          />
        </>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {errors[field.name] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 flex items-center"
            style={{ 
              fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
              marginTop: 'clamp(0.25rem, 0.5vh, 0.5rem)',
              gap: 'clamp(0.25rem, 0.5vw, 0.5rem)'
            }}
          >
            <span>⚠️</span>
            {errors[field.name]?.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </SpookyCard>
  );
};
