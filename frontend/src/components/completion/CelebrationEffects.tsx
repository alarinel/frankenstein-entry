import { motion } from 'framer-motion';
import { TrophyReveal } from '@/components/spooky/TrophyReveal';

/**
 * Simplified celebration effects for better performance
 * Removed heavy particle effects (fireworks, confetti)
 * Reduced infinite animations
 */
export const CelebrationEffects = () => {
  return (
    <>
      {/* Trophy and Book Closing Animation */}
      <div className="flex justify-center items-center gap-8 mb-8">
        {/* Book Closing Animation */}
        <motion.div
          initial={{ rotateY: 0, scale: 1 }}
          animate={{ rotateY: -90, scale: 0.8 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-8xl"
        >
          📕
        </motion.div>

        {/* Trophy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
        >
          <TrophyReveal />
        </motion.div>

        {/* Another book */}
        <motion.div
          initial={{ rotateY: 0, scale: 1 }}
          animate={{ rotateY: 90, scale: 0.8 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-8xl"
        >
          📗
        </motion.div>
      </div>

      {/* Simplified decorative emojis - only 2 with simpler animations */}
      <motion.div
        className="absolute top-10 left-10 text-6xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        🎉
      </motion.div>
      <motion.div
        className="absolute top-10 right-10 text-6xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
      >
        🎊
      </motion.div>
    </>
  );
};
