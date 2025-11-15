interface AudioProgressBarProps {
  audioProgress: number;
  isPlaying: boolean;
  isCountingDown: boolean;
  countdown: number;
}

export const AudioProgressBar = ({
  audioProgress,
  isPlaying,
  isCountingDown,
  countdown,
}: AudioProgressBarProps) => {
  return (
    <div className="relative z-20 w-full max-w-2xl mt-4">
      <div className="bg-dark-800/80 backdrop-blur-sm rounded-xl p-4 border border-spooky-purple-600/30">
        {/* Progress Bar */}
        <div className="h-2 bg-dark-700 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-spooky-purple-500 via-spooky-pink-500 to-spooky-orange-500 transition-all duration-100"
            style={{
              width: `${audioProgress}%`,
            }}
          />
        </div>
        
        {/* Status Text */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">
            {isPlaying ? '🎵 Playing...' : isCountingDown ? `⏳ Next page in ${countdown}s` : '⏸️ Paused'}
          </span>
          <span className="text-spooky-purple-300 font-mono">
            {Math.floor(audioProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
};
