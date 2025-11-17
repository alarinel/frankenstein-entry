import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {AnimatePresence, motion} from 'framer-motion';
import {useStoryStore} from '@/store/storyStore';
import {FormBackground, FormDecorations, FormFooter, FormHeader, FormNavigation, FormProgressIndicator, StoryFormField,} from '@/components/forms';
import {useStoryFormState} from '@/hooks/forms';
import {FORM_FIELDS, STORY_SCHEMA} from './InputPage.constants';
import {LibraryModal} from '@/components/LibraryModal';
import {SpookyButton} from '@/components/spooky/SpookyButton';

type StoryFormData = z.infer<typeof STORY_SCHEMA>;

export const InputPage = () => {
  const { reset } = useStoryStore();
  const [libraryOpen, setLibraryOpen] = useState(false);

  // Clear any previous errors when component mounts
  useEffect(() => {
    reset();
  }, [reset]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
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
    handleClear,
    handleSuggestionClick,
  } = useStoryFormState({
    formFields: FORM_FIELDS,
    setValue,
    handleSubmit,
    getValues,
  });

  const currentValue = watch(currentField.name);

  // Check if all fields are filled for the last step
  const allFieldsFilled = () => {
    if (!isLastStep) return true;
    
    const values = getValues();
    return FORM_FIELDS.every(field => {
      const value = values[field.name];
      return value && String(value).trim() !== '';
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <FormBackground />
      <FormDecorations />
      <FormHeader />

      {/* Library Button */}
      <div className="absolute top-4 left-4 z-20">
        <SpookyButton
          onClick={() => setLibraryOpen(true)}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Library
        </SpookyButton>
      </div>

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
              setValue={setValue}
              currentValue={currentValue}
            />
          </motion.div>
        </AnimatePresence>

        <FormNavigation
          canGoBack={currentStep > 0}
          canGoNext={allFieldsFilled()}
          isLastStep={isLastStep}
          onBack={handleBack}
          onNext={() => handleNext(currentValue)}
          onRandomize={handleRandomize}
          onClear={handleClear}
        />

        <FormFooter />
      </motion.div>

      {/* Library Modal */}
      <LibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
      />
    </div>
  );
};
