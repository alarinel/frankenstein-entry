import { motion } from 'framer-motion';
import { UseFormWatch } from 'react-hook-form';
import { FormField } from '@/types/forms';
import { StepIndicator } from '@/components/shared';

interface FormProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  fields: readonly FormField[];
  watch: UseFormWatch<any>;
  onStepClick: (stepIndex: number) => void;
}

/**
 * Progress indicator component for multi-step form
 * Shows progress bar with percentage and clickable step indicators
 * Displays completion checkmarks for filled fields
 */
export const FormProgressIndicator = ({
  currentStep,
  totalSteps,
  fields,
  watch,
  onStepClick,
}: FormProgressIndicatorProps) => {
  const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Map fields to steps for StepIndicator
  const steps = fields.map((field) => {
    const fieldValue = watch(field.name);
    return {
      emoji: field.emoji,
      label: fieldValue && fieldValue.trim() ? fieldValue : undefined,
      completed: !!(fieldValue && fieldValue.trim()),
    };
  });

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Progress Text */}
      <div className="flex justify-between mb-2">
        <span className="text-sm text-spooky-purple-300 font-fun font-semibold">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-spooky-orange-400 font-fun font-semibold">
          {progressPercentage}% Complete
        </span>
      </div>

      {/* Progress Bar with shimmer effect */}
      <div className="h-3 bg-dark-800/80 rounded-full overflow-hidden border-2 border-spooky-purple-600/30 mb-3">
        <motion.div
          className="h-full bg-gradient-to-r from-spooky-purple-600 via-spooky-orange-500 to-spooky-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%]" />
        </motion.div>
      </div>

      {/* Step Indicators */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepClick}
      />
    </motion.div>
  );
};
