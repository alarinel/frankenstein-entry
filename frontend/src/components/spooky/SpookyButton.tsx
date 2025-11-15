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
      hover:shadow-2xl hover:shadow-spooky-purple-500/70
      border-2 border-spooky-purple-400/30
      hover:border-spooky-purple-300/50
    `,
    secondary: `
      bg-gradient-to-r from-spooky-orange-600 to-spooky-orange-500
      hover:from-spooky-orange-500 hover:to-spooky-orange-400
      text-white font-bold
      shadow-lg shadow-spooky-orange-600/50
      hover:shadow-2xl hover:shadow-spooky-orange-500/70
      border-2 border-spooky-orange-400/30
      hover:border-spooky-orange-300/50
    `,
    ghost: `
      bg-dark-800/70
      hover:bg-dark-700/90
      border-2 border-spooky-purple-600/50
      hover:border-spooky-purple-400
      text-white
      shadow-md shadow-spooky-purple-600/30
      hover:shadow-lg hover:shadow-spooky-purple-500/50
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
        disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale
        cursor-pointer
        ${variants[variant]}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.08, y: -3 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span className="flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
