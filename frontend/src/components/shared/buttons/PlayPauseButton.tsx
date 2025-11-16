import { motion } from 'framer-motion';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Specialized play/pause toggle button for audio/video controls
 * Automatically switches between play and pause states
 */
export const PlayPauseButton = ({
  isPlaying,
  onClick,
  size = 'md',
  className = '',
}: PlayPauseButtonProps) => {
  const sizes = {
    sm: 'p-2 text-lg',
    md: 'p-4 text-2xl',
    lg: 'p-6 text-3xl',
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-full transition-all duration-100
        hover:scale-105 active:scale-95
        ${isPlaying 
          ? 'bg-red-600 hover:bg-red-500' 
          : 'bg-green-600 hover:bg-green-500'
        }
        ${sizes[size]}
        ${className}
      `}
      style={{
        boxShadow: `0 8px 25px ${isPlaying ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
      }}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      aria-pressed={isPlaying}
    >
      <span className="text-white">
        {isPlaying ? '⏸️' : '▶️'}
      </span>
    </button>
  );
};
