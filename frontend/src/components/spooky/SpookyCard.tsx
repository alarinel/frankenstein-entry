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
    purple: 'shadow-glow-purple',
    orange: 'shadow-glow-orange',
    green: 'shadow-glow-green',
  };

  return (
    <div
      className={`
        bg-gradient-to-br from-dark-900/90 to-dark-800/90
        backdrop-blur-md
        border-2 border-spooky-purple-600/50
        rounded-2xl
        shadow-xl
        ${glowColors[glowColor]}
        transition-shadow duration-300
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
};
