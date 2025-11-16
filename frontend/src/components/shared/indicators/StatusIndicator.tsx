import { ReactNode } from 'react';

interface StatusIndicatorProps {
  status: 'playing' | 'paused' | 'loading' | 'countdown' | 'complete';
  label?: string;
  icon?: ReactNode;
  countdown?: number;
  className?: string;
}

/**
 * Shared status indicator component
 * Displays current state with icon and optional label
 */
export const StatusIndicator = ({
  status,
  label,
  icon,
  countdown,
  className = '',
}: StatusIndicatorProps) => {
  const statusConfig = {
    playing: { icon: icon || '🎵', defaultLabel: 'Playing...' },
    paused: { icon: icon || '⏸️', defaultLabel: 'Paused' },
    loading: { icon: icon || '⏳', defaultLabel: 'Loading...' },
    countdown: { icon: icon || '⏳', defaultLabel: countdown ? `Next in ${countdown}s` : 'Waiting...' },
    complete: { icon: icon || '✅', defaultLabel: 'Complete' },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 text-gray-400 text-sm ${className}`}>
      <span>{config.icon}</span>
      <span>{label || config.defaultLabel}</span>
    </div>
  );
};
