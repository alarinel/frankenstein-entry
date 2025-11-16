import {ProgressBar, StatusIndicator} from '@/components/shared';

interface AudioProgressDisplayProps {
    progress: number;
    isPlaying: boolean;
    isCountingDown: boolean;
    countdown: number;
}

/**
 * Audio progress display component for story reading
 * Shows progress bar and status indicator for audio playback
 * Displays countdown timer when transitioning between pages
 *
 * @param {AudioProgressDisplayProps} props - Component props
 * @param {number} props.progress - Current playback progress (0-100)
 * @param {boolean} props.isPlaying - Whether audio is currently playing
 * @param {boolean} props.isCountingDown - Whether countdown is active
 * @param {number} props.countdown - Countdown value in seconds
 */
export const AudioProgressDisplay = ({
                                         progress,
                                         isPlaying,
                                         isCountingDown,
                                         countdown,
                                     }: AudioProgressDisplayProps) => {
    const status = isPlaying ? 'playing' : isCountingDown ? 'countdown' : 'paused';

    return (
        <div
            className="relative z-20 w-full"
            style={{
                maxWidth: 'min(100%, 800px)',
                marginTop: 'clamp(0.5rem, 1.5vh, 1rem)'
            }}
        >
            <div
                className="bg-dark-800/80 backdrop-blur-sm rounded-lg border border-spooky-purple-600/30"
                style={{padding: 'clamp(0.2rem, 0.5vh, 0.25rem)'}}
            >
                {/* Progress Bar */}
                <ProgressBar progress={progress} height="xs" variant="gradient"/>

                {/* Status Text */}
                <div style={{marginTop: 'clamp(0.25rem, 0.5vh, 0.375rem)'}}>
                    <StatusIndicator progress={progress} status={status} countdown={countdown}/>
                </div>
            </div>
        </div>
    );
};
