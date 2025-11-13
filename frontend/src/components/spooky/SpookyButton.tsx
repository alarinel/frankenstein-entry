import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SpookyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
}

export const SpookyButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  type = 'button',
}: SpookyButtonProps) => {
  const variants = {
    primary: `
      bg-gradient-to-r from-spooky-purple-600 to-spooky-purple-500
      hover:from-spooky-purple-500 hover:to-spooky-purple-400
      text-white font-bold
      shadow-lg shadow-spooky-purple-600/50
      hover:shadow-xl hover:shadow-spooky-purple-500/60
    `,
    secondary: `
      bg-gradient-to-r from-spooky-orange-600 to-spooky-orange-500
      hover:from-spooky-orange-500 hover:to-spooky-orange-400
      text-white font-bold
      shadow-lg shadow-spooky-orange-600/50
      hover:shadow-xl hover:shadow-spooky-orange-500/60
    `,
    ghost: `
      bg-dark-800/50
      hover:bg-dark-700/70
      border-2 border-spooky-purple-600/50
      hover:border-spooky-purple-500
      text-white
    `,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 rounded-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span className="flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
