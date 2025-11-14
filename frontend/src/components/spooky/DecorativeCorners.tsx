import { motion } from 'framer-motion';

interface CornerDecoration {
  emoji: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  animation: 'swing' | 'bounce-subtle';
  delay?: number;
}

const CORNER_DECORATIONS: CornerDecoration[] = [
  { emoji: '🕷️', position: 'top-left', animation: 'swing' },
  { emoji: '🕸️', position: 'top-right', animation: 'swing', delay: 0.5 },
  { emoji: '🎃', position: 'bottom-left', animation: 'bounce-subtle' },
  { emoji: '🌙', position: 'bottom-right', animation: 'bounce-subtle', delay: 0.7 },
];

const POSITION_CLASSES = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
} as const;

export const DecorativeCorners = () => {
  return (
    <>
      {CORNER_DECORATIONS.map((decoration, index) => (
        <motion.div
          key={`${decoration.position}-${index}`}
          className={`absolute ${POSITION_CLASSES[decoration.position]} text-6xl animate-${decoration.animation}`}
          style={decoration.delay ? { animationDelay: `${decoration.delay}s` } : undefined}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.2, type: 'spring' }}
        >
          {decoration.emoji}
        </motion.div>
      ))}
    </>
  );
};
