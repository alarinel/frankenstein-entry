import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoryProgressWebSocket } from '@/api/websocket';
import { storyApi } from '@/api/client';
import { useStoryStore } from '@/store/storyStore';
import { GenerationProgress, StoryStatus } from '@/types';
import { ParticleBackground } from '@/components/ParticleBackground';
import Lottie from 'lottie-react';

// You would import actual Lottie animations here
// For now, we'll use a placeholder
const bookAnimation = null;

export const LoadingPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { setCurrentStory, setGenerationProgress, generationProgress } = useStoryStore();
  const [websocket] = useState(() => new StoryProgressWebSocket());

  useEffect(() => {
    if (!storyId) {
      navigate('/');
      return;
    }

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

    return () => {
      websocket.disconnect();
      clearInterval(interval);
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
        return 'text-blue-400';
      case StoryStatus.GENERATING_IMAGES:
        return 'text-purple-400';
      case StoryStatus.GENERATING_AUDIO:
        return 'text-pink-400';
      case StoryStatus.ASSEMBLING:
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-spooky-950 to-dark-900 flex items-center justify-center p-4">
      <ParticleBackground />

      <div className="max-w-2xl w-full text-center">
        {/* Animation Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          {bookAnimation ? (
            <Lottie animationData={bookAnimation} loop className="w-64 h-64 mx-auto" />
          ) : (
            <div className="w-64 h-64 mx-auto flex items-center justify-center">
              <motion.div
                className="text-8xl"
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 1, repeat: Infinity },
                }}
              >
                📚
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-spooky text-spooky-400 mb-4"
        >
          Crafting Your Story...
        </motion.h1>

        {/* Stage */}
        {generationProgress && (
          <motion.p
            key={generationProgress.stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xl mb-8 ${getStageColor(generationProgress.status)}`}
          >
            {generationProgress.stage}
          </motion.p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-3 bg-dark-800 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-spooky-600 via-spooky-500 to-spooky-400"
              initial={{ width: 0 }}
              animate={{
                width: `${generationProgress?.progressPercentage || 0}%`,
              }}
              transition={{ duration: 0.5 }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
          <p className="text-spooky-400 text-sm mt-2">
            {generationProgress?.progressPercentage || 0}% Complete
          </p>
        </div>

        {/* Message */}
        {generationProgress?.message && (
          <motion.p
            key={generationProgress.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 text-sm"
          >
            {generationProgress.message}
          </motion.p>
        )}

        {/* Fun Loading Messages */}
        <motion.div
          className="mt-12 space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-500 text-sm italic">
            "Mixing a pinch of magic with a dash of wonder..."
          </p>
        </motion.div>
      </div>
    </div>
  );
};
