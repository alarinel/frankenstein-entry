import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryProgressWebSocket } from '@/api/websocket';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { GenerationProgress, StoryStatus } from '@/types';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingBats } from '@/components/spooky/FloatingBats';
import { GhostCluster } from '@/components/spooky/FloatingGhost';
import { MagicalCauldron } from '@/components/spooky/MagicalCauldron';
import { FlyingBooks } from '@/components/spooky/FlyingBooks';
import { LightningEffect } from '@/components/spooky/LightningEffect';
import { SpookyTitle } from '@/components/spooky/SpookyEffects';
import { fetchRandomQuote, Quote } from '@/api/quotable';
import { fetchSafeJoke, formatJoke, Joke } from '@/api/jokeApi';

const loadingMessages = [
  { emoji: '🧙', text: 'Mixing a pinch of magic with a dash of wonder...' },
  { emoji: '📖', text: 'Summoning words from the ether...' },
  { emoji: '🎨', text: 'Painting pictures with moonlight...' },
  { emoji: '🎵', text: 'Weaving melodies into the tale...' },
  { emoji: '✨', text: 'Sprinkling stardust on every page...' },
  { emoji: '🦇', text: 'Teaching bats to whisper your story...' },
  { emoji: '👻', text: 'Consulting friendly ghosts for ideas...' },
  { emoji: '🌙', text: 'Borrowing inspiration from the moon...' },
];

export const LoadingPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { setCurrentStory, setGenerationProgress, generationProgress } = useStoryStore();
  const [websocket] = useState(() => new StoryProgressWebSocket());
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [joke, setJoke] = useState<Joke | null>(null);

  useEffect(() => {
    if (!storyId) {
      navigate('/');
      return;
    }

    // Fetch a random quote and joke on mount
    fetchRandomQuote().then(setQuote);
    fetchSafeJoke().then(setJoke);

    // Connect to WebSocket for progress updates
    websocket.connect(storyId, handleProgress);

    // Poll for story completion as backup
    const interval = setInterval(async () => {
      try {
        const story = await storyApi.getStory(storyId);
        if (story.status === StoryStatus.COMPLETED) {
          setCurrentStory(story);
          navigate(`/read/${storyId}`);
        } else if (story.status === StoryStatus.FAILED) {
          navigate('/', { state: { error: story.errorMessage } });
        }
      } catch (error) {
        // Story might not exist yet, keep waiting
      }
    }, 2000);

    // Rotate loading messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 4000);

    return () => {
      websocket.disconnect();
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [storyId]);

  const handleProgress = (progress: GenerationProgress) => {
    setGenerationProgress(progress);

    if (progress.status === StoryStatus.COMPLETED) {
      setTimeout(() => {
        navigate(`/read/${storyId}`);
      }, 1000);
    } else if (progress.status === StoryStatus.FAILED) {
      navigate('/', { state: { error: progress.message } });
    }
  };

  const getStageColor = (status: StoryStatus) => {
    switch (status) {
      case StoryStatus.GENERATING_STORY:
        return 'from-spooky-purple-400 to-spooky-pink-400';
      case StoryStatus.GENERATING_IMAGES:
        return 'from-spooky-orange-400 to-spooky-pink-400';
      case StoryStatus.GENERATING_AUDIO:
        return 'from-spooky-green-400 to-spooky-purple-400';
      case StoryStatus.ASSEMBLING:
        return 'from-spooky-pink-400 to-spooky-orange-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStageEmoji = (status: StoryStatus) => {
    switch (status) {
      case StoryStatus.GENERATING_STORY:
        return '📝';
      case StoryStatus.GENERATING_IMAGES:
        return '🎨';
      case StoryStatus.GENERATING_AUDIO:
        return '🎵';
      case StoryStatus.ASSEMBLING:
        return '🔧';
      default:
        return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 flex items-center justify-center p-4 overflow-hidden relative">
      <ParticleBackground />
      <FloatingBats count={4} />
      <GhostCluster />
      <FlyingBooks />
      <LightningEffect />

      {/* Decorative corners */}
      <div 
        className="absolute animate-float-slow"
        style={{ 
          top: 'clamp(0.75rem, 2vh, 1.25rem)',
          left: 'clamp(0.75rem, 2vw, 1.25rem)',
          fontSize: 'clamp(2rem, 4vw, 2.5rem)'
        }}
      >🕯️</div>
      <div 
        className="absolute animate-float" 
        style={{ 
          animationDelay: '0.5s',
          top: 'clamp(0.75rem, 2vh, 1.25rem)',
          right: 'clamp(0.75rem, 2vw, 1.25rem)',
          fontSize: 'clamp(2rem, 4vw, 2.5rem)'
        }}
      >
        🔮
      </div>
      <div 
        className="absolute animate-bounce-subtle"
        style={{ 
          bottom: 'clamp(0.75rem, 2vh, 1.25rem)',
          left: 'clamp(0.75rem, 2vw, 1.25rem)',
          fontSize: 'clamp(2rem, 4vw, 2.5rem)'
        }}
      >⚗️</div>
      <div 
        className="absolute animate-bounce-subtle" 
        style={{ 
          animationDelay: '0.7s',
          bottom: 'clamp(0.75rem, 2vh, 1.25rem)',
          right: 'clamp(0.75rem, 2vw, 1.25rem)',
          fontSize: 'clamp(2rem, 4vw, 2.5rem)'
        }}
      >
        📜
      </div>

      <div className="w-full text-center z-10" style={{ maxWidth: 'min(90vw, 900px)', padding: '0 clamp(1rem, 3vw, 2rem)' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SpookyTitle>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              ⚡
            </motion.span>
            {' '}Brewing Your Story{' '}
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              ⚡
            </motion.span>
          </SpookyTitle>
        </motion.div>

        {/* Cauldron Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <MagicalCauldron progress={generationProgress?.progressPercentage || 0} />
        </motion.div>

        {/* Stage Badge */}
        <AnimatePresence mode="wait">
          {generationProgress && (
            <motion.div
              key={generationProgress.status}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}
              className="inline-block"
            >
              <div 
                className={`bg-gradient-to-r ${getStageColor(generationProgress.status)} rounded-full shadow-lg shadow-spooky-purple-500/50 backdrop-blur-sm`}
                style={{ 
                  padding: 'clamp(0.5rem, 1vh, 0.75rem) clamp(1rem, 2vw, 1.25rem)'
                }}
              >
                <span style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', marginRight: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
                  {getStageEmoji(generationProgress.status)}
                </span>
                <span 
                  className="text-white font-fun font-bold"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}
                >
                  {generationProgress.stage}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mx-auto" style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)', maxWidth: 'min(95%, 600px)' }}>
          <div 
            className="bg-dark-800/80 rounded-full overflow-hidden border-2 border-spooky-purple-600/30 relative shadow-inner"
            style={{ height: 'clamp(10px, 1.2vh, 14px)' }}
          >
            <motion.div
              className={`h-full bg-gradient-to-r ${getStageColor(generationProgress?.status || StoryStatus.PENDING)}`}
              initial={{ width: 0 }}
              animate={{
                width: `${generationProgress?.progressPercentage || 0}%`,
              }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%]" />
            </motion.div>

            {/* Sparkles on progress bar */}
            {generationProgress && generationProgress.progressPercentage > 0 && (
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2"
                style={{ 
                  left: `${generationProgress.progressPercentage}%`,
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)'
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ✨
              </motion.div>
            )}
          </div>
          <motion.p
            className="text-spooky-purple-300 font-fun font-semibold"
            style={{ 
              marginTop: 'clamp(0.5rem, 1.5vh, 0.75rem)',
              fontSize: 'clamp(1rem, 2vw, 1.125rem)'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {generationProgress?.progressPercentage || 0}% Complete
          </motion.p>
        </div>

        {/* Message */}
        <AnimatePresence mode="wait">
          {generationProgress?.message && (
            <motion.div
              key={generationProgress.message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <p className="text-spooky-orange-300 text-base font-fun bg-dark-800/50 backdrop-blur-sm py-3 px-6 rounded-full inline-block border border-spooky-purple-600/30">
                {generationProgress.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rotating Fun Loading Messages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
              >
                {loadingMessages[currentMessageIndex].emoji}
              </motion.span>
              <p className="text-gray-400 text-sm italic font-fun max-w-md">
                "{loadingMessages[currentMessageIndex].text}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Inspirational Quote */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="bg-dark-800/60 backdrop-blur-md rounded-2xl p-6 border border-spooky-purple-600/30 shadow-lg">
              <div className="text-4xl mb-3 text-center">📜</div>
              <p className="text-gray-300 text-base italic leading-relaxed text-center mb-3">
                "{quote.content}"
              </p>
              <p className="text-spooky-purple-400 text-sm text-center font-semibold">
                — {quote.author}
              </p>
            </div>
          </motion.div>
        )}

        {/* Fun Joke */}
        {joke && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 max-w-2xl mx-auto"
          >
            <div className="bg-dark-800/60 backdrop-blur-md rounded-2xl p-6 border border-spooky-orange-600/30 shadow-lg">
              <div className="text-4xl mb-3 text-center">😄</div>
              <p className="text-gray-300 text-base leading-relaxed text-center">
                {formatJoke(joke)}
              </p>
              <p className="text-spooky-orange-400 text-xs text-center mt-3 font-semibold">
                — A little humor while you wait
              </p>
            </div>
          </motion.div>
        )}

        {/* Stage Steps Indicator */}
        <div 
          className="flex justify-center flex-wrap"
          style={{ 
            marginTop: 'clamp(2rem, 4vh, 2.5rem)',
            gap: 'clamp(0.75rem, 2vw, 1rem)'
          }}
        >
          {[
            { status: StoryStatus.GENERATING_STORY, emoji: '📝', label: 'Story' },
            { status: StoryStatus.GENERATING_IMAGES, emoji: '🎨', label: 'Images' },
            { status: StoryStatus.GENERATING_AUDIO, emoji: '🎵', label: 'Audio' },
            { status: StoryStatus.ASSEMBLING, emoji: '🔧', label: 'Assembly' },
          ].map((stage) => {
            const isActive = generationProgress?.status === stage.status;
            const isPast =
              generationProgress &&
              Object.values(StoryStatus).indexOf(generationProgress.status) >
                Object.values(StoryStatus).indexOf(stage.status);

            return (
              <motion.div
                key={stage.status}
                className={`flex flex-col items-center transition-all ${
                  isActive || isPast ? 'opacity-100' : 'opacity-30'
                }`}
                style={{ gap: 'clamp(0.25rem, 0.75vh, 0.5rem)' }}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
              >
                <div
                  className={`rounded-full flex items-center justify-center border-2 ${
                    isPast
                      ? 'bg-spooky-green-600 border-spooky-green-400'
                      : isActive
                      ? 'bg-spooky-purple-600 border-spooky-purple-400 shadow-lg shadow-spooky-purple-500/50'
                      : 'bg-dark-800 border-dark-700'
                  }`}
                  style={{ 
                    width: 'clamp(3rem, 6vw, 3.5rem)',
                    height: 'clamp(3rem, 6vw, 3.5rem)',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)'
                  }}
                >
                  {isPast ? '✅' : stage.emoji}
                </div>
                <span 
                  className="text-gray-400 font-fun"
                  style={{ fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)' }}
                >
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
