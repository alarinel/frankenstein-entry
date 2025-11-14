import { motion } from 'framer-motion';
import { UseFormWatch } from 'react-hook-form';
import { ANIMATION_TIMINGS } from '@/pages/InputPage.constants';

interface FormField {
  name: string;
  emoji: string;
}

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  fields: readonly FormField[];
  watch: UseFormWatch<any>;
  onStepClick: (stepIndex: number) => void;
}

export const FormProgressBar = ({
  currentStep,
  totalSteps,
  fields,
  watch,
  onStepClick,
}: FormProgressBarProps) => {
  const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);

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

      {/* Progress Bar */}
      <div className="h-3 bg-dark-800/80 rounded-full overflow-hidden border-2 border-spooky-purple-600/30">
        <motion.div
          className="h-full bg-gradient-to-r from-spooky-purple-600 via-spooky-orange-500 to-spooky-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: ANIMATION_TIMINGS.PROGRESS_BAR_DURATION, type: 'spring' }}
        >
          <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%]" />
        </motion.div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mt-3">
        {fields.map((field, index) => {
          const fieldValue = watch(field.name);
          const isCompleted = fieldValue && fieldValue.trim();
          const isClickable = isCompleted || index <= currentStep;

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
                scale: index === currentStep ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: index === currentStep ? Infinity : 0 }}
              whileHover={isClickable ? { scale: 1.3 } : {}}
              whileTap={isClickable ? { scale: 0.9 } : {}}
            >
              {field.emoji}
              {isCompleted && (
                <span className="absolute -top-1 -right-1 text-xs">✓</span>
              )}
              {/* Tooltip */}
              {isCompleted && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {fieldValue}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
