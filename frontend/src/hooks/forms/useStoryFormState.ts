import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseFormSetValue, UseFormHandleSubmit } from 'react-hook-form';
import toast from 'react-hot-toast';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { StoryInput, Suggestion } from '@/types';

interface FormField {
  name: keyof StoryInput;
  label: string;
  placeholder: string;
  suggestions: Suggestion[];
  emoji: string;
}

interface UseStoryFormStateProps {
  formFields: readonly FormField[];
  setValue: UseFormSetValue<StoryInput>;
  handleSubmit: UseFormHandleSubmit<StoryInput>;
}

interface UseStoryFormStateReturn {
  currentStep: number;
  currentField: FormField;
  isLastStep: boolean;
  handleNext: (currentValue: string) => void;
  handleBack: () => void;
  jumpToStep: (stepIndex: number) => void;
  handleRandomize: () => void;
  handleSuggestionClick: (value: string) => void;
}

/**
 * Custom hook for managing story form state and navigation
 * Handles step navigation, randomization, and form submission logic
 */
export const useStoryFormState = ({
  formFields,
  setValue,
  handleSubmit,
}: UseStoryFormStateProps): UseStoryFormStateReturn => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { setCurrentInput } = useStoryStore();

  const currentField = formFields[currentStep];
  const isLastStep = currentStep === formFields.length - 1;

  // Handle next step or form submission
  const handleNext = (currentValue: string) => {
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

  // Handle back navigation
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Jump to specific step
  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Handle suggestion click with auto-advance
  const handleSuggestionClick = (value: string) => {
    setValue(currentField.name, value, { shouldValidate: true });
    
    setTimeout(() => {
      if (isLastStep) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }, 150);
  };

  // Randomize all fields
  const handleRandomize = () => {
    formFields.forEach((field) => {
      const randomIndex = Math.floor(Math.random() * field.suggestions.length);
      const randomValue = field.suggestions[randomIndex].value;
      setValue(field.name, randomValue, { shouldValidate: true });
    });
    
    const targetStep = formFields.length - 1;
    if (currentStep !== targetStep) {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= targetStep - 1) {
            clearInterval(stepInterval);
            return targetStep;
          }
          return prev + 1;
        });
      }, 60);
    }
    
    toast.success('🎲 Random story created! Ready to generate!');
  };

  // Form submission handler
  const onSubmit = async (data: StoryInput) => {
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

  return {
    currentStep,
    currentField,
    isLastStep,
    handleNext,
    handleBack,
    jumpToStep,
    handleRandomize,
    handleSuggestionClick,
  };
};
