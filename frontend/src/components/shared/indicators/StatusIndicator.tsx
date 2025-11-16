import {ReactNode} from 'react';

interface StatusIndicatorProps {
    status: 'playing' | 'paused' | 'loading' | 'countdown' | 'complete';
    label?: string;
    icon?: ReactNode;
    countdown?: number;
    className?: string;
    progress: number;
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
                                    progress,
                                    className = '',
                                }: StatusIndicatorProps) => {
    const statusConfig = {
        playing: {icon: icon || '🎵', defaultLabel: 'Playing...'},
        paused: {icon: icon || '⏸️', defaultLabel: 'Paused'},
        loading: {icon: icon || '⏳', defaultLabel: 'Loading...'},
        countdown: {icon: icon || '⏳', defaultLabel: countdown ? `Next in ${countdown}s` : 'Waiting...'},
        complete: {icon: icon || '✅', defaultLabel: 'Complete'},
    };

    const config = statusConfig[status];

    return (
        <div className={`flex items-center justify-between gap-2 text-gray-400 text-sm px-2 ${className}`}>
            <div className="text-left text-sm text-spooky-purple-300 font-mono">
                <span className="mr-1">{config.icon}</span>
                <span>{label || config.defaultLabel}</span>
            </div>
            <div className="text-right text-sm text-spooky-purple-300 font-mono">
                {Math.floor(progress)}%
            </div>
        </div>
    );
};
