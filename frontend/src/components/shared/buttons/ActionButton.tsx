import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

/**
 * Shared action button component with text and optional icons
 * Used for primary actions like navigation, form submission, etc.
 */
export const ActionButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
}: ActionButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-br from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 hover:from-spooky-purple-500 hover:via-spooky-pink-500 hover:to-spooky-orange-500 shadow-purple-500/40',
    secondary: 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 shadow-gray-800/40',
    ghost: 'bg-dark-900/95 hover:bg-dark-800/95 border border-gray-700/50 hover:border-gray-600/50 shadow-black/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative rounded-xl transition-all duration-200 text-white font-medium
        shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-105 active:scale-95 backdrop-blur-sm
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      aria-label={ariaLabel}
    >
      <span className="flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
