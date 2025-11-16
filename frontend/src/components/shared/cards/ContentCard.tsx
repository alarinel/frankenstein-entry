import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ContentCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'purple' | 'orange' | 'green' | 'blue';
  hoverable?: boolean;
}

/**
 * Shared content card component with glow effects
 * Used for grouping related content with consistent styling
 */
export const ContentCard = ({
  children,
  className = '',
  glowColor = 'purple',
  hoverable = true,
}: ContentCardProps) => {
  const glowColors = {
    purple: 'shadow-glow-purple hover:shadow-glow-purple border-spooky-purple-600/50',
    orange: 'shadow-glow-orange hover:shadow-glow-orange border-spooky-orange-600/50',
    green: 'shadow-glow-green hover:shadow-glow-green border-green-600/50',
    blue: 'shadow-glow-blue hover:shadow-glow-blue border-blue-600/50',
  };

  return (
    <motion.div
      className={`
        bg-gradient-to-br from-dark-900/90 to-dark-800/90
        backdrop-blur-md
        border-2
        rounded-2xl
        shadow-xl
        transition-all duration-300
        ${glowColors[glowColor]}
        ${className}
      `}
      whileHover={hoverable ? { scale: 1.02, y: -5 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
};
