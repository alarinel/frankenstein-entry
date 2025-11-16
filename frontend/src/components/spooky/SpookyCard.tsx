import { motion } from 'framer-motion';
import { ReactNode, CSSProperties } from 'react';

interface SpookyCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'purple' | 'orange' | 'green';
  style?: CSSProperties;
}

export const SpookyCard = ({ children, className = '', glowColor = 'purple', style }: SpookyCardProps) => {
  const glowColors = {
    purple: 'shadow-glow-purple hover:shadow-glow-purple',
    orange: 'shadow-glow-orange hover:shadow-glow-orange',
    green: 'shadow-glow-green hover:shadow-glow-green',
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-br from-dark-900/90 to-dark-800/90
        backdrop-blur-md
        border-2 border-spooky-purple-600/50
        rounded-2xl
        shadow-xl
        ${glowColors[glowColor]}
        transition-all duration-300
        ${className}
      `}
      style={style}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
};
