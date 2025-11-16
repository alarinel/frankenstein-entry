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
    <motion.button
      onClick={onClick}
      className={`
        group relative rounded-full transition-all duration-300
        transform hover:scale-110 active:scale-95
        ${isPlaying 
          ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 shadow-red-500/30' 
          : 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:via-green-500 hover:to-green-600 shadow-green-500/30'
        }
        ${sizes[size]}
        ${className}
      `}
      style={{
        boxShadow: `0 8px 25px ${isPlaying ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      aria-pressed={isPlaying}
    >
      <span className={`text-white transition-transform duration-200 ${
        isPlaying ? 'group-hover:scale-110' : 'group-hover:scale-110 group-hover:translate-x-0.5'
      }`}>
        {isPlaying ? '⏸️' : '▶️'}
      </span>
    </motion.button>
  );
};
