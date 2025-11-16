import {motion} from 'framer-motion';
import {SpookyTitle} from '@/components/spooky/SpookyEffects';

/**
 * Header component for the story form
 * Displays the title and subtitle with animations
 */
export const FormHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center mb-8 z-10 w-full"
    >
      <SpookyTitle className="mb-2">
        Frankenbook Story Lab
      </SpookyTitle>
      <motion.p
        className="text-spooky-orange-400 text-xl font-fun"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Stitch together your magical tale...
      </motion.p>
    </motion.div>
  );
};
