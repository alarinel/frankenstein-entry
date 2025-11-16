/**
 * Type definitions for form-related components
 * Centralizes form field, suggestion, and form state types
 */

import { Suggestion } from './index';

/**
 * Form field definition for story input
 * Defines structure for each step in the multi-step form
 */
export interface FormField {
  name: string;
  label: string;
  placeholder: string;
  emoji: string;
  suggestions: Suggestion[];
}

/**
 * Form navigation state
 * Tracks current position and validation state in multi-step form
 */
export interface FormNavigationState {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
}

/**
 * Form progress information
 * Used for displaying progress indicators and completion status
 */
export interface FormProgress {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  completedFields: string[];
}
