interface NavigationControlsProps {
  canGoPrevious: boolean;
  canGoNext: boolean;
  isFlipping: boolean;
  isPlaying: boolean;
  textPosition: 'left' | 'right' | 'hidden';
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlayPause: () => void;
  onToggleTextPosition: () => void;
}

export const NavigationControls = ({
  canGoPrevious,
  canGoNext,
  isFlipping,
  isPlaying,
  textPosition,
  onPrevious,
  onNext,
  onTogglePlayPause,
  onToggleTextPosition,
}: NavigationControlsProps) => {
  return (
    <div className="relative z-20 flex flex-col md:flex-row justify-between items-center mt-3 gap-3">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious || isFlipping}
        className="group relative px-6 py-3 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
        }}
        aria-label="Go to previous page"
      >
        <span className="text-xl mr-2 group-hover:animate-bounce">🦇</span>
        <span className="hidden md:inline">Previous</span>
      </button>

      {/* Center Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlayPause}
          className={`group relative p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isPlaying 
              ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 shadow-red-500/30' 
              : 'bg-gradient-to-br from-green-500 via-green-600 to-green-700 hover:from-green-400 hover:via-green-500 hover:to-green-600 shadow-green-500/30'
          }`}
          style={{
            boxShadow: `0 8px 25px ${isPlaying ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
          }}
          aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
          aria-pressed={isPlaying}
        >
          <span className={`text-2xl text-white transition-transform duration-200 ${
            isPlaying ? 'group-hover:scale-110' : 'group-hover:scale-110 group-hover:translate-x-0.5'
          }`}>
            {isPlaying ? '⏸️' : '▶️'}
          </span>
        </button>
        
        {/* Text Position Toggle */}
        <button
          onClick={onToggleTextPosition}
          className="group relative p-3 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 rounded-xl transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          style={{
            boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
          aria-label={`Text position: ${textPosition}`}
          title={`Text: ${textPosition === 'right' ? 'Right' : textPosition === 'left' ? 'Left' : 'Hidden'}`}
        >
          <span className="text-lg group-hover:animate-pulse">
            {textPosition === 'right' ? '➡️' : textPosition === 'left' ? '⬅️' : '👁️'}
          </span>
        </button>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={isFlipping}
        className="group relative px-6 py-3 bg-gradient-to-br from-spooky-purple-600 via-spooky-pink-600 to-spooky-orange-600 hover:from-spooky-purple-500 hover:via-spooky-pink-500 hover:to-spooky-orange-500 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
        }}
        aria-label={canGoNext ? 'Go to next page' : 'Complete story'}
      >
        <span className="hidden md:inline">{canGoNext ? 'Next' : 'Complete'}</span>
        <span className="text-xl ml-2 group-hover:animate-bounce">
          {canGoNext ? '📖' : '✨'}
        </span>
      </button>
    </div>
  );
};
