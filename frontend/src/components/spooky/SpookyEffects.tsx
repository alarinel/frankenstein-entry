import { motion } from 'framer-motion';

export const SpookyTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.h1
      className={`text-6xl font-spooky text-transparent bg-clip-text bg-gradient-to-r from-spooky-purple-400 via-spooky-orange-400 to-spooky-pink-400 ${className}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
    >
      {children}
    </motion.h1>
  );
};

export const FloatingEmoji = ({ emoji, className = '' }: { emoji: string; className?: string }) => {
  return (
    <motion.span
      className={`inline-block ${className}`}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.span>
  );
};

export const PulsingGlow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      className={`${className}`}
      animate={{
        boxShadow: [
          '0 0 20px rgba(168, 85, 247, 0.5)',
          '0 0 40px rgba(168, 85, 247, 0.8)',
          '0 0 20px rgba(168, 85, 247, 0.5)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};
