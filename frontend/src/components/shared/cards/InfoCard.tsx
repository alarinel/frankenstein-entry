import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InfoCardProps {
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/**
 * Shared information card with optional title and icon
 * Used for displaying grouped information with a header
 */
export const InfoCard = ({
  title,
  children,
  icon,
  className = '',
}: InfoCardProps) => {
  return (
    <motion.div
      className={`
        bg-dark-800/60 backdrop-blur-md rounded-2xl p-6
        border border-spooky-purple-600/30 shadow-lg
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-3xl">{icon}</div>}
          {title && (
            <h3 className="text-xl font-spooky text-spooky-orange-400">
              {title}
            </h3>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};
