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
}: FormNavigationProps) => {
  return (
    <>
      {/* Randomizer Button */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <SpookyButton
          onClick={onRandomize}
          variant="ghost"
          className="w-full"
          disabled={isLoading}
        >
          <span>🎲</span>
          <span>Surprise Me! (Random Story)</span>
          <span>✨</span>
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

        <SpookyButton
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          variant={isLastStep ? 'secondary' : 'primary'}
          className="flex-1"
        >
          <span>{isLastStep ? '✨ Create Story' : 'Next'}</span>
          <span>{isLastStep ? '🎃' : '➡️'}</span>
        </SpookyButton>
      </motion.div>
    </>
  );
};
