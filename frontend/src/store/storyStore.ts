import { create } from 'zustand';
import { Story, StoryInput, GenerationProgress } from '@/types';

interface StoryStore {
  currentStory: Story | null;
  currentInput: StoryInput | null;
  isGenerating: boolean;
  generationProgress: GenerationProgress | null;
  error: string | null;
  allStories: Story[];

  setCurrentStory: (story: Story | null) => void;
  setCurrentInput: (input: StoryInput | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: GenerationProgress | null) => void;
  setError: (error: string | null) => void;
  setAllStories: (stories: Story[]) => void;
  reset: () => void;
}

export const useStoryStore = create<StoryStore>((set) => ({
  currentStory: null,
  currentInput: null,
  isGenerating: false,
  generationProgress: null,
  error: null,
  allStories: [],

  setCurrentStory: (story) => set({ currentStory: story }),
  setCurrentInput: (input) => set({ currentInput: input }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setError: (error) => set({ error }),
  setAllStories: (stories) => set({ allStories: stories }),
  reset: () =>
    set({
      currentStory: null,
      currentInput: null,
      isGenerating: false,
      generationProgress: null,
      error: null,
    }),
}));
