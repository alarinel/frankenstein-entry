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
        const isCompleted = step.completed || index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || isCurrent);

        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={`text-2xl transition-all relative group ${
              index <= currentStep ? 'opacity-100 scale-110' : 'opacity-30'
            } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            animate={{
              scale: isCurrent ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0 }}
            className={isClickable ? 'hover:scale-125 active:scale-90 transition-transform duration-150' : ''}
          >
            {step.emoji}
            {/* Completion Checkmark */}
            {isCompleted && (
              <span className="absolute -top-1 -right-1 text-xs">✓</span>
            )}
            {/* Tooltip */}
            {step.label && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {step.label}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
