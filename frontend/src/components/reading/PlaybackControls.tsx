import { ActionButton, PlayPauseButton } from '@/components/shared';

interface PlaybackControlsProps {
  isPlaying: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFlipping: boolean;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

/**
 * Playback controls component for story reading
 * Provides play/pause, previous, and next navigation buttons
 * Handles button states based on playback status and page availability
 * 
 * @param {PlaybackControlsProps} props - Component props
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 * @param {boolean} props.canGoNext - Whether next page is available
 * @param {boolean} props.canGoPrevious - Whether previous page is available
 * @param {boolean} props.isFlipping - Whether page flip animation is in progress
 * @param {Function} props.onTogglePlayPause - Handler for play/pause button
 * @param {Function} props.onNext - Handler for next button
 * @param {Function} props.onPrevious - Handler for previous button
 */
export const PlaybackControls = ({
  isPlaying,
  canGoNext,
  canGoPrevious,
  isFlipping,
  onTogglePlayPause,
  onNext,
  onPrevious,
}: PlaybackControlsProps) => {
  return (
    <div 
      className="relative z-20 flex justify-between items-center"
      style={{ gap: 'clamp(0.5rem, 1vw, 0.625rem)' }}
    >
      {/* Previous Button */}
      <ActionButton
        onClick={onPrevious}
        disabled={!canGoPrevious || isFlipping}
        variant="secondary"
        ariaLabel="Go to previous page"
      >
        <span 
          className="group-hover:animate-bounce"
          style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
        >🦇</span>
        <span className="hidden md:inline">Previous</span>
      </ActionButton>

      {/* Play/Pause Button */}
      <PlayPauseButton
        isPlaying={isPlaying}
        onClick={onTogglePlayPause}
        size="sm"
      />

      {/* Next Button */}
      <ActionButton
        onClick={onNext}
        disabled={isFlipping}
        variant="primary"
        ariaLabel={canGoNext ? 'Go to next page' : 'Complete story'}
      >
        <span className="hidden md:inline">{canGoNext ? 'Next' : 'Complete'}</span>
        <span 
          className="group-hover:animate-bounce"
          style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
        >
          {canGoNext ? '📖' : '✨'}
        </span>
      </ActionButton>
    </div>
  );
};
