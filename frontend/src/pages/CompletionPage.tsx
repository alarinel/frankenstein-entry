import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStoryStore } from '@/store/storyStore';
import { ParticleBackground } from '@/components/ParticleBackground';
import { CelebrationFireworks } from '@/components/spooky/CelebrationFireworks';
import { ConfettiRain } from '@/components/spooky/ConfettiRain';
import { TrophyReveal } from '@/components/spooky/TrophyReveal';
import { FloatingBats } from '@/components/spooky/FloatingBats';
import { GhostCluster } from '@/components/spooky/FloatingGhost';
import { SpookyButton } from '@/components/spooky/SpookyButton';
import { SpookyCard } from '@/components/spooky/SpookyCard';
import { SpookyTitle } from '@/components/spooky/SpookyEffects';

export const CompletionPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { currentStory, reset } = useStoryStore();

  useEffect(() => {
    if (!currentStory && storyId) {
      // If we don't have the story in state, redirect to reading page
      navigate(`/read/${storyId}`);
    }
  }, [currentStory, storyId]);

  const handleNewStory = () => {
    reset();
    navigate('/');
  };

  const handleReadAgain = () => {
    if (storyId) {
      navigate(`/read/${storyId}`);
    }
  };

  if (!currentStory) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 flex items-center justify-center p-4 overflow-hidden relative">
      <ParticleBackground />
      <CelebrationFireworks />
      <ConfettiRain />
      <FloatingBats count={5} />
      <GhostCluster />

      {/* Decorative celebrating characters */}
      <motion.div
        className="absolute top-10 left-10 text-6xl"
        animate={{
          rotate: [0, 20, -20, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎉
      </motion.div>
      <motion.div
        className="absolute top-10 right-10 text-6xl"
        animate={{
          rotate: [0, -20, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        🎊
      </motion.div>
      <motion.div
        className="absolute bottom-10 left-20 text-5xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-20 text-5xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      >
        🎈
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full text-center z-10"
      >
        {/* Trophy and Book Closing */}
        <div className="flex justify-center items-center gap-8 mb-8">
          {/* Book Closing Animation */}
          <motion.div
            initial={{ rotateY: 0, scale: 1 }}
            animate={{ rotateY: -90, scale: 0.8 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-8xl"
          >
            📕
          </motion.div>

          {/* Trophy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <TrophyReveal />
          </motion.div>

          {/* Another book */}
          <motion.div
            initial={{ rotateY: 0, scale: 1 }}
            animate={{ rotateY: 90, scale: 0.8 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-8xl"
          >
            📗
          </motion.div>
        </div>

        {/* Completion Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <SpookyTitle>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎭
            </motion.span>
            {' '}Story Complete!{' '}
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              🎭
            </motion.span>
          </SpookyTitle>

          <motion.p
            className="text-2xl md:text-3xl text-gray-300 mb-8 font-serif italic"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            "{currentStory.title}"
          </motion.p>

          {/* Achievement Badges */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.2, type: 'spring' }}
              className="px-6 py-3 bg-gradient-to-r from-spooky-purple-600 to-spooky-pink-600 rounded-full shadow-lg"
            >
              <span className="text-2xl mr-2">📚</span>
              <span className="text-white font-fun font-bold">Story Master</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.4, type: 'spring' }}
              className="px-6 py-3 bg-gradient-to-r from-spooky-orange-600 to-spooky-pink-600 rounded-full shadow-lg"
            >
              <span className="text-2xl mr-2">⭐</span>
              <span className="text-white font-fun font-bold">Adventure Complete</span>
            </motion.div>
          </div>

          {/* Story Stats Card */}
          <SpookyCard glowColor="purple" className="mb-8">
            <h3 className="text-xl font-spooky text-spooky-orange-400 mb-6">Story Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.6 }}
                className="text-left"
              >
                <p className="text-gray-400 text-sm mb-2 font-fun">📄 Pages</p>
                <p className="text-white text-2xl font-bold">{currentStory.metadata.pageCount}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.7 }}
                className="text-left"
              >
                <p className="text-gray-400 text-sm mb-2 font-fun">⏱️ Duration</p>
                <p className="text-white text-2xl font-bold">
                  {currentStory.metadata.estimatedReadTime}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.8 }}
                className="text-left"
              >
                <p className="text-gray-400 text-sm mb-2 font-fun">👤 Character</p>
                <p className="text-white text-xl font-semibold">{currentStory.input.characterName}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.9 }}
                className="text-left"
              >
                <p className="text-gray-400 text-sm mb-2 font-fun">🗺️ Setting</p>
                <p className="text-white text-xl font-semibold">{currentStory.input.setting}</p>
              </motion.div>
            </div>
          </SpookyCard>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <SpookyButton onClick={handleReadAgain} variant="secondary" className="w-full md:w-auto">
              <span className="text-2xl mr-2">📖</span>
              Read Again
            </SpookyButton>

            <SpookyButton onClick={handleNewStory} variant="primary" className="w-full md:w-auto">
              <span className="text-2xl mr-2">✨</span>
              Create New Story
            </SpookyButton>
          </motion.div>

          {/* Fun message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
            className="mt-8 text-gray-400 font-fun italic"
          >
            "Every story is a new adventure waiting to be told..."
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};
