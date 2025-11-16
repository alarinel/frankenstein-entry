import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel: string;
  title?: string;
}

/**
 * Shared icon button component with consistent styling
 * Used for navigation, controls, and actions throughout the app
 */
export const IconButton = ({
  icon,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  title,
}: IconButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-br from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 hover:from-spooky-purple-500 hover:via-spooky-pink-500 hover:to-spooky-orange-500 shadow-purple-500/40',
    secondary: 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 shadow-gray-800/40',
    ghost: 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 shadow-purple-600/40',
    danger: 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 shadow-red-500/40',
    success: 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:via-green-500 hover:to-green-600 shadow-green-500/40',
  };

  const sizes = {
    sm: 'p-2 text-base',
    md: 'p-3 text-lg',
    lg: 'p-4 text-2xl',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative rounded-xl transition-all duration-200 text-white
        shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-105 active:scale-95
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      style={{
        boxShadow: `0 6px 20px ${variant === 'primary' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(0, 0, 0, 0.4)'}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      aria-label={ariaLabel}
      title={title}
    >
      <span className="group-hover:animate-pulse">{icon}</span>
    </motion.button>
  );
};
