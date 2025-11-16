import { IconButton } from '@/components/shared';
import { TextPosition } from '@/types/reading';

interface PageNavigationButtonsProps {
  textPosition: TextPosition;
  onToggleTextPosition: () => void;
}

/**
 * Page navigation buttons component for text position control
 * Provides button to toggle text overlay position (left/right/hidden)
 * 
 * @param {PageNavigationButtonsProps} props - Component props
 * @param {TextPosition} props.textPosition - Current text position
 * @param {Function} props.onToggleTextPosition - Handler for toggling text position
 */
export const PageNavigationButtons = ({
  textPosition,
  onToggleTextPosition,
}: PageNavigationButtonsProps) => {
  const icon = textPosition === 'right' ? '➡️' : textPosition === 'left' ? '⬅️' : '👁️';
  const title = `Text: ${textPosition === 'right' ? 'Right' : textPosition === 'left' ? 'Left' : 'Hidden'}`;

  return (
    <IconButton
      icon={icon}
      onClick={onToggleTextPosition}
      variant="ghost"
      size="md"
      ariaLabel={`Text position: ${textPosition}`}
      title={title}
    />
  );
};
