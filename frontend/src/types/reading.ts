/**
 * Type definitions for reading page components
 * Centralizes reading state, playback, and navigation types
 */

/**
 * Text position for reading display
 * Controls where text overlay appears relative to the book
 */
export type TextPosition = 'left' | 'right' | 'hidden';

/**
 * Time of day for theme selection
 * Determines background gradient and atmosphere
 */
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Reading page state
 * Tracks all state related to story playback and navigation
 */
export interface ReadingState {
  currentPage: number;
  isPlaying: boolean;
  isFlipping: boolean;
  textPosition: TextPosition;
  audioProgress: number;
  countdown: number;
  isCountingDown: boolean;
  showPlayPrompt: boolean;
}

/**
 * Playback control state
 * Tracks audio playback and navigation capabilities
 */
export interface PlaybackState {
  isPlaying: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFlipping: boolean;
}

/**
 * Audio progress information
 * Tracks current audio playback progress and timing
 */
export interface AudioProgress {
  progress: number;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

/**
 * Text highlighting state
 * Tracks which words should be highlighted during narration
 */
export interface TextHighlightState {
  highlightedWords: Set<number>;
  totalWords: number;
  currentWordIndex: number;
}

/**
 * Page navigation capabilities
 * Indicates which navigation actions are available
 */
export interface NavigationCapabilities {
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}
