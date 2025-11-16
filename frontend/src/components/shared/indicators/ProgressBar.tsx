import {motion} from 'framer-motion';

interface ProgressBarProps {
    progress: number;
    showPercentage?: boolean;
    height?: 'xs' | 'sm' | 'md' | 'lg';
    variant?: 'gradient' | 'solid';
    className?: string;
}

/**
 * Shared progress bar component
 * Used for displaying progress, loading states, and completion status
 */
export const ProgressBar = ({
                                progress,
                                height = 'md',
                                variant = 'gradient',
                                className = '',
                            }: ProgressBarProps) => {
    const heights = {
        xs: 'h-0.5',
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    const variants = {
        gradient: 'bg-gradient-to-r from-spooky-purple-500 via-spooky-pink-500 to-spooky-orange-500',
        solid: 'bg-spooky-purple-500',
    };

    return (
        <div className={className}>
            <div className={`${heights[height]} bg-dark-700 rounded-full overflow-hidden`}>
                <motion.div
                    className={`h-full ${variants[variant]} transition-all duration-100`}
                    initial={{width: 0}}
                    animate={{width: `${Math.min(100, Math.max(0, progress))}%`}}
                    transition={{duration: 0.3}}
                />
            </div>
        </div>
    );
};
