import { motion } from 'framer-motion';

/**
 * Footer component for the story form
 * Displays a fun message with animated emojis
 */
export const FormFooter = () => {
  return (
    <motion.div
      className="text-center mt-8 text-spooky-purple-400 text-sm font-fun"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <p className="flex items-center justify-center gap-2">
        <span className="animate-pulse">👻</span>
        Creating magical stories since 2025
        <span className="animate-pulse">🎃</span>
      </p>
    </motion.div>
  );
};
