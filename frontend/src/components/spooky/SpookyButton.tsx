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
      bg-spooky-purple-600
      hover:bg-spooky-purple-500
      text-white font-bold
      shadow-lg shadow-spooky-purple-600/50
      border-2 border-spooky-purple-400/30
    `,
    secondary: `
      bg-spooky-orange-600
      hover:bg-spooky-orange-500
      text-white font-bold
      shadow-lg shadow-spooky-orange-600/50
      border-2 border-spooky-orange-400/30
    `,
    ghost: `
      bg-dark-800/70
      hover:bg-dark-700/90
      border-2 border-spooky-purple-600/50
      hover:border-spooky-purple-400
      text-white
      shadow-md shadow-spooky-purple-600/30
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-3 rounded-xl
        transition-all duration-150
        disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale
        cursor-pointer
        ${!disabled ? 'hover:scale-105 active:scale-95' : ''}
        ${variants[variant]}
        ${className}
      `}
    >
      <span className="flex items-center gap-2">{children}</span>
    </button>
  );
};
