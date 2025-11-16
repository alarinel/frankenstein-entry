import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  valueColor?: string;
  className?: string;
}

/**
 * Shared statistics card component
 * Used for displaying metrics, counts, and key values
 */
export const StatCard = ({
  label,
  value,
  icon,
  valueColor = 'text-white',
  className = '',
}: StatCardProps) => {
  return (
    <motion.div
      className={`bg-dark-800/80 rounded-lg p-6 ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="text-gray-400 text-sm mb-2 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
    </motion.div>
  );
};
