import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '@/store/storyStore';
import {
  StoryFormField,
  FormProgressIndicator,
  FormNavigation,
  FormHeader,
  FormDecorations,
  FormFooter,
  FormBackground,
} from '@/components/forms';
import { useStoryFormState } from '@/hooks/forms';
import { STORY_SCHEMA, FORM_FIELDS } from './InputPage.constants';

type StoryFormData = z.infer<typeof STORY_SCHEMA>;

export const InputPage = () => {
  const { reset } = useStoryStore();

  // Clear any previous errors when component mounts
  useEffect(() => {
    reset();
  }, [reset]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(STORY_SCHEMA),
  });

  const {
    currentStep,
    currentField,
    isLastStep,
    handleNext,
    handleBack,
    jumpToStep,
    handleRandomize,
    handleSuggestionClick,
  } = useStoryFormState({
    formFields: FORM_FIELDS,
    setValue,
    handleSubmit,
  });

  const currentValue = watch(currentField.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <FormBackground />
      <FormDecorations />
      <FormHeader />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full z-10"
      >
        <FormProgressIndicator
          currentStep={currentStep}
          totalSteps={FORM_FIELDS.length}
          fields={FORM_FIELDS}
          watch={watch}
          onStepClick={jumpToStep}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <StoryFormField
              field={currentField}
              register={register}
              errors={errors}
              onSuggestionClick={handleSuggestionClick}
              onNext={() => handleNext(currentValue)}
            />
          </motion.div>
        </AnimatePresence>

        <FormNavigation
          canGoBack={currentStep > 0}
          canGoNext={true}
          isLastStep={isLastStep}
          onBack={handleBack}
          onNext={() => handleNext(currentValue)}
          onRandomize={handleRandomize}
        />

        <FormFooter />
      </motion.div>
    </div>
  );
};
