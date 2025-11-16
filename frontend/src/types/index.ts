export interface StoryInput {
  theme: string; // Life lesson/moral theme (e.g., "honesty", "friendship", "courage")
  voiceType: 'male' | 'female';
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
  GENERATING_OUTLINE = 'GENERATING_OUTLINE',
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

// Story outline types (two-phase generation)
export interface CharacterProfile {
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting';
  appearance: string;
  personality: string;
}

export interface BeginningSection {
  summary: string;
  keyEvents: string[];
  pageCount: number;
}

export interface MiddleSection {
  summary: string;
  keyEvents: string[];
  conflict: string;
  pageCount: number;
}

export interface EndSection {
  summary: string;
  keyEvents: string[];
  resolution: string;
  pageCount: number;
}

export interface StoryOutline {
  title: string;
  theme: string;
  targetPages: number;
  beginning: BeginningSection;
  middle: MiddleSection;
  end: EndSection;
  characters: CharacterProfile[];
  narrativeArc: string;
  imageSeed: number;
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
