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
  },
  {
    name: 'setting' as const,
    label: 'Where does the adventure take place?',
    placeholder: 'Describe the setting...',
    suggestions: settingSuggestions,
  },
  {
    name: 'villain' as const,
    label: 'Who is the villain?',
    placeholder: 'Name the antagonist...',
    suggestions: villainSuggestions,
  },
  {
    name: 'specialItem' as const,
    label: 'What magical item will help?',
    placeholder: 'Describe the item...',
    suggestions: specialItemSuggestions,
  },
  {
    name: 'characterTrait' as const,
    label: "What's your hero's special quality?",
    placeholder: 'Describe a trait...',
    suggestions: characterTraitSuggestions,
  },
  {
    name: 'goal' as const,
    label: 'What is the quest?',
    placeholder: 'Describe the goal...',
    suggestions: goalSuggestions,
  },
  {
    name: 'timePeriod' as const,
    label: 'When does this story happen?',
    placeholder: 'Set the time period...',
    suggestions: timePeriodSuggestions,
  },
  {
    name: 'mood' as const,
    label: 'What mood should the story have?',
    placeholder: 'Describe the mood...',
    suggestions: moodSuggestions,
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
      toast.error('Please fill in this field');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: StoryFormData) => {
    try {
      setCurrentInput(data);
      const response = await storyApi.generateStory(data);
      toast.success('Story generation started!');
      navigate(`/loading/${response.storyId}`);
    } catch (error) {
      toast.error('Failed to start story generation');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-spooky-950 to-dark-900 flex items-center justify-center p-4 overflow-hidden">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-spooky text-spooky-400 mb-4">
            Frankenstein's Story Lab
          </h1>
          <p className="text-gray-400 text-lg">
            Stitch together your magical tale...
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {formFields.length}
            </span>
            <span className="text-sm text-spooky-400">
              {Math.round(((currentStep + 1) / formFields.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-spooky-600 to-spooky-400"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / formFields.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Field */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-dark-900/50 backdrop-blur-sm border border-spooky-700/30 rounded-2xl p-8 shadow-2xl"
          >
            <label className="block text-2xl font-serif text-spooky-300 mb-6">
              {currentField.label}
            </label>

            <input
              {...register(currentField.name)}
              type="text"
              placeholder={currentField.placeholder}
              className="w-full bg-dark-800 border border-spooky-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spooky-500 transition-all"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNext();
                }
              }}
              autoFocus
            />

            {errors[currentField.name] && (
              <p className="text-red-400 text-sm mt-2">
                {errors[currentField.name]?.message}
              </p>
            )}

            {/* Suggestions */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {currentField.suggestions.map((suggestion) => (
                  <button
                    key={suggestion.value}
                    type="button"
                    onClick={() => setValue(currentField.name, suggestion.value)}
                    className="px-3 py-1.5 bg-spooky-800/50 hover:bg-spooky-700/50 border border-spooky-600/30 rounded-full text-sm text-spooky-300 transition-all hover:scale-105"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-dark-800 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-spooky-600 to-spooky-500 hover:from-spooky-500 hover:to-spooky-400 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-spooky-500/50"
          >
            {isLastStep ? 'Create Story' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
