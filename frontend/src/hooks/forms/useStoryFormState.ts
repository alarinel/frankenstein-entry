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
  suggestions: readonly Suggestion[];
  emoji: string;
  type?: 'text' | 'theme-selector' | 'voice-selector';
}

interface UseStoryFormStateProps {
  formFields: readonly FormField[];
  setValue: UseFormSetValue<StoryInput>;
  handleSubmit: UseFormHandleSubmit<StoryInput>;
  getValues: () => StoryInput;
}

interface UseStoryFormStateReturn {
  currentStep: number;
  currentField: FormField;
  isLastStep: boolean;
  handleNext: (currentValue: string) => void;
  handleBack: () => void;
  jumpToStep: (stepIndex: number) => void;
  handleRandomize: () => void;
  handleClear: () => void;
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
  getValues,
}: UseStoryFormStateProps): UseStoryFormStateReturn => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { setCurrentInput } = useStoryStore();

  const currentField = formFields[currentStep];
  const isLastStep = currentStep === formFields.length - 1;

  // Handle next step or form submission
  const handleNext = (_currentValue: string) => {
    // Get the actual current value from form state (more reliable than watched value)
    const formValues = getValues();
    const actualValue = formValues[currentField.name];
    
    // For selector fields (theme, voiceType), just check if value exists
    const isSelector = currentField.name === 'theme' || currentField.name === 'voiceType';
    const isValid = isSelector ? !!actualValue : (actualValue && String(actualValue).trim());
    
    if (isValid) {
      if (isLastStep) {
        // Double-check all fields are filled before submitting
        const allFilled = formFields.every(field => {
          const value = formValues[field.name];
          return value && String(value).trim() !== '';
        });
        
        if (allFilled) {
          handleSubmit(onSubmit)();
        } else {
          toast.error('Please fill in all fields before creating your story 📝');
        }
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

  // Randomize only empty fields
  const handleRandomize = () => {
    const currentValues = getValues();
    let filledCount = 0;
    
    formFields.forEach((field) => {
      // Get current field value
      const currentValue = currentValues[field.name];
      
      // Skip if field already has a value
      if (currentValue && String(currentValue).trim()) {
        return;
      }
      
      filledCount++;
      
      // Handle theme field with suggestions
      if (field.name === 'theme' && field.suggestions && field.suggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * field.suggestions.length);
        const randomValue = field.suggestions[randomIndex].value;
        setValue(field.name, randomValue, { shouldValidate: true });
      }
      // Handle voiceType field
      else if (field.name === 'voiceType') {
        const voices = ['male', 'female'];
        const randomVoice = voices[Math.floor(Math.random() * voices.length)];
        setValue(field.name, randomVoice as any, { shouldValidate: true });
      }
      // Handle regular text fields with suggestions
      else if (field.suggestions && field.suggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * field.suggestions.length);
        const randomValue = field.suggestions[randomIndex].value;
        setValue(field.name, randomValue, { shouldValidate: true });
      }
    });
    
    if (filledCount === 0) {
      toast('All fields already filled! 🎉', { icon: '✨' });
    } else {
      toast.success(`🎲 Filled ${filledCount} empty field${filledCount > 1 ? 's' : ''}!`);
      // Jump to last step so user can immediately create story
      setCurrentStep(formFields.length - 1);
    }
  };

  // Clear all fields
  const handleClear = () => {
    formFields.forEach((field) => {
      setValue(field.name, '' as any, { shouldValidate: false });
    });
    setCurrentStep(0);
    toast.success('🧹 All fields cleared!');
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
    handleClear,
    handleSuggestionClick,
  };
};
