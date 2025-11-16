import { z } from 'zod';
import { VALIDATION_LIMITS } from '@/pages/InputPage.constants';

export const storySchema = z.object({
  theme: z.enum(['spooky', 'adventure', 'fantasy'], {
    required_error: 'Please select a theme',
  }),
  voiceType: z.enum(['male', 'female'], {
    required_error: 'Please select a narrator voice',
  }),
  characterName: z.string().min(1, 'Character name is required').max(VALIDATION_LIMITS.CHARACTER_NAME_MAX),
  setting: z.string().min(1, 'Setting is required').max(VALIDATION_LIMITS.SETTING_MAX),
  villain: z.string().min(1, 'Villain is required').max(VALIDATION_LIMITS.VILLAIN_MAX),
  specialItem: z.string().min(1, 'Special item is required').max(VALIDATION_LIMITS.SPECIAL_ITEM_MAX),
  characterTrait: z.string().min(1, 'Character trait is required').max(VALIDATION_LIMITS.CHARACTER_TRAIT_MAX),
  goal: z.string().min(1, 'Goal is required').max(VALIDATION_LIMITS.GOAL_MAX),
  timePeriod: z.string().min(1, 'Time period is required').max(VALIDATION_LIMITS.TIME_PERIOD_MAX),
  mood: z.string().min(1, 'Mood is required').max(VALIDATION_LIMITS.MOOD_MAX),
});

export type StoryFormData = z.infer<typeof storySchema>;
