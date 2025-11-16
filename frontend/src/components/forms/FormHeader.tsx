import { motion } from 'framer-motion';
import { SpookyTitle, FloatingEmoji } from '@/components/spooky/SpookyEffects';

/**
 * Header component for the story form
 * Displays the title and subtitle with animations
 */
export const FormHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="text-center mb-8 z-10 w-full"
    >
      <SpookyTitle className="mb-4">
        <FloatingEmoji emoji="🧟" className="mr-4" />
        Frankenstein's Story Lab
        <FloatingEmoji emoji="📚" className="ml-4" />
      </SpookyTitle>
      <motion.p
        className="text-spooky-orange-400 text-xl font-fun"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Stitch together your magical tale...
      </motion.p>
    </motion.div>
  );
};
