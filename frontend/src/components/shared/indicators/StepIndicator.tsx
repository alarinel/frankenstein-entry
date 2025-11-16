import { motion } from 'framer-motion';

interface Step {
  emoji: string;
  label?: string;
  completed?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

/**
 * Shared step indicator component for multi-step processes
 * Shows progress through steps with emojis and optional labels
 */
export const StepIndicator = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
}: StepIndicatorProps) => {
  return (
    <div className={`flex justify-between ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = step.completed;
        const isCurrent = index === currentStep;
        const isClickable = !!onStepClick; // All steps are now clickable

        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={`text-2xl transition-all relative group ${
              isCurrent ? 'opacity-100 scale-110' : isCompleted ? 'opacity-80' : 'opacity-40'
            } ${isClickable ? 'cursor-pointer hover:scale-125 active:scale-90' : 'cursor-not-allowed'}`}
            animate={{
              scale: isCurrent ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0 }}
          >
            {step.emoji}
            {/* Completion Checkmark - only show if field has value */}
            {isCompleted && (
              <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">✓</span>
            )}
            {/* Tooltip */}
            {step.label && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {step.label}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
