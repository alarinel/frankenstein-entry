import { motion } from 'framer-motion';
import { SpookyButton } from '@/components/spooky/SpookyButton';

interface FormNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  isLoading?: boolean;
  onBack: () => void;
  onNext: () => void;
  onRandomize: () => void;
  onClear: () => void;
}

/**
 * Form navigation component with Back, Next, and Randomize buttons
 * Handles button states (disabled, loading) and step navigation
 */
export const FormNavigation = ({
  canGoBack,
  canGoNext,
  isLastStep,
  isLoading = false,
  onBack,
  onNext,
  onRandomize,
  onClear,
}: FormNavigationProps) => {
  return (
    <>
      {/* Randomizer and Clear Buttons */}
      <motion.div
        className="mt-8 flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <SpookyButton
          onClick={onRandomize}
          variant="ghost"
          className="flex-1"
          disabled={isLoading}
        >
          <span>🎲</span>
          <span>Fill Empty</span>
        </SpookyButton>
        <SpookyButton
          onClick={onClear}
          variant="ghost"
          className="flex-1"
          disabled={isLoading}
        >
          <span>🧹</span>
          <span>Clear All</span>
        </SpookyButton>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex justify-between mt-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <SpookyButton
          onClick={onBack}
          disabled={!canGoBack || isLoading}
          variant="ghost"
          className="flex-1"
        >
          <span>⬅️</span>
          <span>Back</span>
        </SpookyButton>

        <div className="flex-1 relative">
          <SpookyButton
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            variant={isLastStep ? 'secondary' : 'primary'}
            className="w-full"
          >
            <span>{isLastStep ? '✨ Create Story' : 'Next'}</span>
            <span>{isLastStep ? '🎃' : '➡️'}</span>
          </SpookyButton>
          {isLastStep && !canGoNext && !isLoading && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-8 left-0 right-0 text-center text-xs text-spooky-orange-400 font-fun"
            >
              Fill all fields to create story
            </motion.p>
          )}
        </div>
      </motion.div>
    </>
  );
};
