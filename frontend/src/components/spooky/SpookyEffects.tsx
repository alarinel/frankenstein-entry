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
