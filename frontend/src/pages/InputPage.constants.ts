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

export const FORM_FIELDS = [
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
] as const;

export const ANIMATION_TIMINGS = {
  AUTO_ADVANCE_DELAY: 300,
  STEP_TRANSITION_DURATION: 0.4,
  PROGRESS_BAR_DURATION: 0.5,
  EMOJI_ROTATION_DURATION: 2,
  SUGGESTION_STAGGER_DELAY: 0.05,
} as const;

export const VALIDATION_LIMITS = {
  CHARACTER_NAME_MAX: 50,
  SETTING_MAX: 100,
  VILLAIN_MAX: 50,
  SPECIAL_ITEM_MAX: 50,
  CHARACTER_TRAIT_MAX: 50,
  GOAL_MAX: 100,
  TIME_PERIOD_MAX: 50,
  MOOD_MAX: 50,
} as const;

export const TOAST_MESSAGES = {
  FIELD_REQUIRED: 'Please fill in this field 👻',
  RANDOM_SUCCESS: '🎲 Random story created! Ready to generate!',
  GENERATION_STARTED: '✨ Story generation started!',
  GENERATION_FAILED: 'Failed to start story generation 😞',
} as const;
