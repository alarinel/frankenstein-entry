import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingBats } from '@/components/spooky/FloatingBats';
import { GhostCluster } from '@/components/spooky/FloatingGhost';
import { SpookyCard } from '@/components/spooky/SpookyCard';
import { SpookyButton } from '@/components/spooky/SpookyButton';
import { SpookyTitle, FloatingEmoji } from '@/components/spooky/SpookyEffects';
import {
  characterNameSuggestions,
  settingSuggestions,
  villainSuggestions,
  specialItemSuggestions,
  characterTraitSuggestions,
  goalSuggestions,
  timePeriodSuggestions,
  moodSuggestions,
} from '@/utils/suggestions';

const storySchema = z.object({
  characterName: z.string().min(1, 'Character name is required').max(50),
  setting: z.string().min(1, 'Setting is required').max(100),
  villain: z.string().min(1, 'Villain is required').max(50),
  specialItem: z.string().min(1, 'Special item is required').max(50),
  characterTrait: z.string().min(1, 'Character trait is required').max(50),
  goal: z.string().min(1, 'Goal is required').max(100),
  timePeriod: z.string().min(1, 'Time period is required').max(50),
  mood: z.string().min(1, 'Mood is required').max(50),
});

type StoryFormData = z.infer<typeof storySchema>;

const formFields = [
  {
    name: 'characterName' as const,
    label: "What's your hero's name?",
    placeholder: 'Enter a name...',
    suggestions: characterNameSuggestions,
    emoji: '🦸',
  },
  {
    name: 'setting' as const,
    label: 'Where does the adventure take place?',
    placeholder: 'Describe the setting...',
    suggestions: settingSuggestions,
    emoji: '🏰',
  },
  {
    name: 'villain' as const,
    label: 'Who is the villain?',
    placeholder: 'Name the antagonist...',
    suggestions: villainSuggestions,
    emoji: '👹',
  },
  {
    name: 'specialItem' as const,
    label: 'What magical item will help?',
    placeholder: 'Describe the item...',
    suggestions: specialItemSuggestions,
    emoji: '✨',
  },
  {
    name: 'characterTrait' as const,
    label: "What's your hero's special quality?",
    placeholder: 'Describe a trait...',
    suggestions: characterTraitSuggestions,
    emoji: '💪',
  },
  {
    name: 'goal' as const,
    label: 'What is the quest?',
    placeholder: 'Describe the goal...',
    suggestions: goalSuggestions,
    emoji: '🎯',
  },
  {
    name: 'timePeriod' as const,
    label: 'When does this story happen?',
    placeholder: 'Set the time period...',
    suggestions: timePeriodSuggestions,
    emoji: '⏰',
  },
  {
    name: 'mood' as const,
    label: 'What mood should the story have?',
    placeholder: 'Describe the mood...',
    suggestions: moodSuggestions,
    emoji: '🎭',
  },
];

export const InputPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { setCurrentInput } = useStoryStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
  });

  const currentField = formFields[currentStep];
  const currentValue = watch(currentField.name);
  const isLastStep = currentStep === formFields.length - 1;

  const handleNext = () => {
    if (currentValue && currentValue.trim()) {
      if (isLastStep) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast.error('Please fill in this field 👻');
    }
  };

  const handleSuggestionClick = (value: string) => {
    setValue(currentField.name, value, { shouldValidate: true });
    // Auto-advance to next step after setValue completes
    setTimeout(() => {
      if (isLastStep) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }, 300);
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRandomize = () => {
    // Fill all fields with random suggestions
    formFields.forEach((field) => {
      const randomIndex = Math.floor(Math.random() * field.suggestions.length);
      const randomValue = field.suggestions[randomIndex].value;
      setValue(field.name, randomValue, { shouldValidate: true });
    });
    
    // Jump to last step to show completion
    setCurrentStep(formFields.length - 1);
    toast.success('🎲 Random story created! Ready to generate!');
  };

  const onSubmit = async (data: StoryFormData) => {
    try {
      setCurrentInput(data);
      const response = await storyApi.generateStory(data);
      toast.success('✨ Story generation started!');
      navigate(`/loading/${response.storyId}`);
    } catch (error) {
      toast.error('Failed to start story generation 😞');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 flex items-center justify-center p-4 overflow-hidden relative">
      <ParticleBackground />
      <FloatingBats count={12} />
      <GhostCluster />

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 text-6xl animate-swing">🕷️</div>
      <div className="absolute top-4 right-4 text-6xl animate-swing" style={{ animationDelay: '0.5s' }}>
        🕸️
      </div>
      <div className="absolute bottom-4 left-4 text-6xl animate-bounce-subtle">🎃</div>
      <div className="absolute bottom-4 right-4 text-6xl animate-bounce-subtle" style={{ animationDelay: '0.7s' }}>
        🌙
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-12"
        >
          <SpookyTitle className="mb-4">
            <FloatingEmoji emoji="🧟" className="mr-4" />
            Frankenstein's Story Lab
            <FloatingEmoji emoji="📚" className="ml-4" />
          </SpookyTitle>
          <motion.p
            className="text-spooky-orange-400 text-xl font-fun"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Stitch together your magical tale...
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between mb-2">
            <span className="text-sm text-spooky-purple-300 font-fun font-semibold">
              Step {currentStep + 1} of {formFields.length}
            </span>
            <span className="text-sm text-spooky-orange-400 font-fun font-semibold">
              {Math.round(((currentStep + 1) / formFields.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-3 bg-dark-800/80 rounded-full overflow-hidden border-2 border-spooky-purple-600/30">
            <motion.div
              className="h-full bg-gradient-to-r from-spooky-purple-600 via-spooky-orange-500 to-spooky-pink-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / formFields.length) * 100}%`,
              }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%]" />
            </motion.div>
          </div>

          {/* Step indicators - clickable breadcrumbs */}
          <div className="flex justify-between mt-3">
            {formFields.map((field, index) => {
              const fieldValue = watch(field.name);
              const isCompleted = fieldValue && fieldValue.trim();
              
              return (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => jumpToStep(index)}
                  disabled={!isCompleted && index > currentStep}
                  className={`text-2xl transition-all relative group ${
                    index <= currentStep ? 'opacity-100 scale-110' : 'opacity-30'
                  } ${isCompleted ? 'cursor-pointer' : index > currentStep ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  animate={{
                    scale: index === currentStep ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: index === currentStep ? Infinity : 0 }}
                  whileHover={isCompleted || index <= currentStep ? { scale: 1.3 } : {}}
                  whileTap={isCompleted || index <= currentStep ? { scale: 0.9 } : {}}
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

        {/* Form Field */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -50, rotateY: 15 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
          >
            <SpookyCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <motion.span
                  className="text-5xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentField.emoji}
                </motion.span>
                <label className="block text-3xl font-fun font-bold text-transparent bg-clip-text bg-gradient-to-r from-spooky-purple-300 to-spooky-pink-300">
                  {currentField.label}
                </label>
              </div>

              <motion.input
                {...register(currentField.name)}
                type="text"
                placeholder={currentField.placeholder}
                className="w-full bg-dark-800/50 border-2 border-spooky-purple-600/50 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-spooky-purple-500/50 focus:border-spooky-purple-400 transition-all text-lg font-fun backdrop-blur-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                autoFocus
                whileFocus={{ scale: 1.02 }}
              />

              <AnimatePresence>
                {errors[currentField.name] && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm mt-2 flex items-center gap-2"
                  >
                    <span>⚠️</span>
                    {errors[currentField.name]?.message}
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
                  {currentField.suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.value}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.value)}
                      className="px-4 py-2 bg-gradient-to-r from-spooky-purple-800/60 to-spooky-purple-700/60 hover:from-spooky-purple-700 hover:to-spooky-purple-600 border-2 border-spooky-purple-600/40 hover:border-spooky-purple-500 rounded-full text-sm text-spooky-purple-200 transition-all font-fun font-medium backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {suggestion.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </SpookyCard>
          </motion.div>
        </AnimatePresence>

        {/* Randomizer Button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SpookyButton
            onClick={handleRandomize}
            variant="ghost"
            className="w-full"
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
          transition={{ delay: 0.5 }}
        >
          <SpookyButton
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="ghost"
            className="flex-1"
          >
            <span>⬅️</span>
            <span>Back</span>
          </SpookyButton>

          <SpookyButton
            onClick={handleNext}
            variant={isLastStep ? 'secondary' : 'primary'}
            className="flex-1"
          >
            <span>{isLastStep ? '✨ Create Story' : 'Next'}</span>
            <span>{isLastStep ? '🎃' : '➡️'}</span>
          </SpookyButton>
        </motion.div>

        {/* Fun footer */}
        <motion.div
          className="text-center mt-8 text-spooky-purple-400 text-sm font-fun"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="flex items-center justify-center gap-2">
            <span className="animate-pulse">👻</span>
            Creating magical stories since 2025
            <span className="animate-pulse">🎃</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
