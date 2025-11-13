import { motion, AnimatePresence } from 'framer-motion';

interface MagicSparklesProps {
  isActive: boolean;
}

export const MagicSparkles = ({ isActive }: MagicSparklesProps) => {
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 400,
    delay: Math.random() * 0.5,
  }));

  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute top-1/2 left-1/2 text-2xl"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: sparkle.x,
                y: sparkle.y,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                delay: sparkle.delay,
                ease: 'easeOut',
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
