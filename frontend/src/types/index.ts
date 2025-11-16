export interface StoryInput {
  characterName: string;
  setting: string;
  villain: string;
  specialItem: string;
  characterTrait: string;
  goal: string;
  timePeriod: string;
  mood: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl: string;
  narrationUrl: string;
  soundEffects: string[];
  soundEffectUrls: string[];
  mood: string;
  duration: number;
}

export interface StoryMetadata {
  imageSeed: number;
  totalDuration: number;
  pageCount: number;
  estimatedReadTime: string;
}

export enum StoryStatus {
  PENDING = 'PENDING',
  GENERATING_STORY = 'GENERATING_STORY',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  GENERATING_AUDIO = 'GENERATING_AUDIO',
  ASSEMBLING = 'ASSEMBLING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Story {
  id: string;
  title: string;
  input: StoryInput;
  pages: StoryPage[];
  metadata: StoryMetadata;
  status: StoryStatus;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface GenerateStoryResponse {
  storyId: string;
  status: StoryStatus;
  message: string;
}

export interface GenerationProgress {
  storyId: string;
  status: StoryStatus;
  progressPercentage: number;
  stage: string;
  message: string;
}

export interface StoryStatusResponse {
  storyId: string;
  status: StoryStatus;
  progress: number;
}

// Suggestion type for input fields
export interface Suggestion {
  label: string;
  value: string;
}

// Audio playback state
export interface AudioPlaybackState {
  isPlaying: boolean;
  currentPage: number;
  currentTime: number;
  duration: number;
}

// Re-export specialized type modules
export * from './forms';
export * from './reading';
export * from './admin';
