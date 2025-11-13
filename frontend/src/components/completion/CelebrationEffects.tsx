import { motion } from 'framer-motion';
import { CelebrationFireworks } from '@/components/spooky/CelebrationFireworks';
import { ConfettiRain } from '@/components/spooky/ConfettiRain';
import { TrophyReveal } from '@/components/spooky/TrophyReveal';

export const CelebrationEffects = () => {
  return (
    <>
      {/* Celebration Effects */}
      <CelebrationFireworks />
      <ConfettiRain />

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
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

      {/* Decorative celebrating emojis */}
      <motion.div
        className="absolute top-10 left-10 text-6xl"
        animate={{
          rotate: [0, 20, -20, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎉
      </motion.div>
      <motion.div
        className="absolute top-10 right-10 text-6xl"
        animate={{
          rotate: [0, -20, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        🎊
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-20 text-5xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-20 text-5xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      >
        🎈
      </motion.div>
    </>
  );
};
