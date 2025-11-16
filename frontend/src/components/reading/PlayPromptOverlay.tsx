import { PromptOverlay } from '@/components/shared';
import { ActionButton } from '@/components/shared';

interface PlayPromptOverlayProps {
  show: boolean;
  onStart: () => void;
}

/**
 * Play prompt overlay for story reading
 * Displays a prompt to start reading the story with a start button
 * 
 * @param {PlayPromptOverlayProps} props - Component props
 * @param {boolean} props.show - Whether to show the overlay
 * @param {Function} props.onStart - Handler for starting the story
 */
export const PlayPromptOverlay = ({ show, onStart }: PlayPromptOverlayProps) => {
  return (
    <PromptOverlay
      show={show}
      title="Ready to Begin?"
      description="Click the button below to start your magical story"
      icon="📖"
      actionButton={
        <ActionButton onClick={onStart} variant="primary" size="lg">
          <span style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>▶️</span>
          <span>Start Reading</span>
          <span style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>✨</span>
        </ActionButton>
      }
    />
  );
};
