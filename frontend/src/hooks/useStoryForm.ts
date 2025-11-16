import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { FORM_FIELDS, ANIMATION_TIMINGS, TOAST_MESSAGES } from '@/pages/InputPage.constants';
import { storySchema, StoryFormData } from '@/types/storyForm';

export const useStoryForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { setCurrentInput } = useStoryStore();

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
  });

  const { handleSubmit, setValue, watch } = form;

  const currentField = FORM_FIELDS[currentStep];
  const currentValue = watch(currentField.name as any);
  const isLastStep = currentStep === FORM_FIELDS.length - 1;

  const validateAndAdvance = () => {
    // For selector fields (theme, voiceType), just check if value exists
    const isSelector = currentField.name === 'theme' || currentField.name === 'voiceType';
    const isValid = isSelector ? !!currentValue : (currentValue && (currentValue as string).trim());
    
    if (isValid) {
      if (isLastStep) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast.error(TOAST_MESSAGES.FIELD_REQUIRED);
    }
  };

  const handleNext = () => {
    validateAndAdvance();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleSuggestionClick = (value: string) => {
    setValue(currentField.name as any, value, { shouldValidate: true });
    
    // Auto-advance after setValue completes
    setTimeout(() => {
      if (isLastStep) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }, ANIMATION_TIMINGS.AUTO_ADVANCE_DELAY);
  };

  const handleRandomize = () => {
    FORM_FIELDS.forEach((field) => {
      // Handle theme field
      if (field.name === 'theme') {
        const themes = ['spooky', 'adventure', 'fantasy'];
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        setValue(field.name as any, randomTheme, { shouldValidate: true });
      }
      // Handle voiceType field
      else if (field.name === 'voiceType') {
        const voices = ['male', 'female'];
        const randomVoice = voices[Math.floor(Math.random() * voices.length)];
        setValue(field.name as any, randomVoice, { shouldValidate: true });
      }
      // Handle regular text fields with suggestions
      else if (field.suggestions && field.suggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * field.suggestions.length);
        const randomValue = field.suggestions[randomIndex].value;
        setValue(field.name as any, randomValue, { shouldValidate: true });
      }
    });
    
    setCurrentStep(FORM_FIELDS.length - 1);
    toast.success(TOAST_MESSAGES.RANDOM_SUCCESS);
  };

  const onSubmit = async (data: StoryFormData) => {
    try {
      setCurrentInput(data);
      const response = await storyApi.generateStory(data);
      toast.success(TOAST_MESSAGES.GENERATION_STARTED);
      navigate(`/loading/${response.storyId}`);
    } catch (error) {
      toast.error(TOAST_MESSAGES.GENERATION_FAILED);
      console.error(error);
    }
  };

  return {
    form,
    currentStep,
    currentField,
    currentValue,
    isLastStep,
    handleNext,
    handleBack,
    jumpToStep,
    handleSuggestionClick,
    handleRandomize,
    onSubmit,
  };
};
