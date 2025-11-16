import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStoryStore } from '@/store/storyStore';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingBats } from '@/components/spooky/FloatingBats';
import { GhostCluster } from '@/components/spooky/FloatingGhost';
import { SpookyCard } from '@/components/spooky/SpookyCard';
import { SpookyTitle } from '@/components/spooky/SpookyEffects';
import { CelebrationEffects, CompletionActions } from '@/components/completion';
import { fetchRandomAdvice, Advice } from '@/api/adviceSlip';

export const CompletionPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { currentStory, reset } = useStoryStore();
  const [advice, setAdvice] = useState<Advice | null>(null);

  useEffect(() => {
    if (!currentStory && storyId) {
      // If we don't have the story in state, redirect to reading page
      navigate(`/read/${storyId}`);
    }
    
    // Fetch random advice for encouragement
    fetchRandomAdvice().then(setAdvice);
  }, [currentStory, storyId, navigate]);

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
      <FloatingBats count={5} />
      <GhostCluster />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full text-center z-10"
        style={{ maxWidth: 'min(90vw, 900px)', padding: '0 clamp(1rem, 3vw, 2rem)' }}
      >
        {/* Celebration Effects with Trophy and Books */}
        <CelebrationEffects />

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
            className="text-gray-300 font-serif italic"
            style={{ 
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              marginBottom: 'clamp(1.5rem, 3vh, 2rem)'
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            "{currentStory.title}"
          </motion.p>

          {/* Achievement Badges */}
          <div 
            className="flex justify-center flex-wrap"
            style={{ 
              gap: 'clamp(0.75rem, 1.5vw, 1rem)',
              marginBottom: 'clamp(1.5rem, 3vh, 2rem)'
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.2, type: 'spring' }}
              className="bg-gradient-to-r from-spooky-purple-600 to-spooky-pink-600 rounded-full shadow-lg"
              style={{ padding: 'clamp(0.5rem, 1vh, 0.75rem) clamp(1rem, 2vw, 1.25rem)' }}
            >
              <span style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', marginRight: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>📚</span>
              <span 
                className="text-white font-fun font-bold"
                style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
              >Story Master</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.4, type: 'spring' }}
              className="bg-gradient-to-r from-spooky-orange-600 to-spooky-pink-600 rounded-full shadow-lg"
              style={{ padding: 'clamp(0.5rem, 1vh, 0.75rem) clamp(1rem, 2vw, 1.25rem)' }}
            >
              <span style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', marginRight: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>⭐</span>
              <span 
                className="text-white font-fun font-bold"
                style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
              >Adventure Complete</span>
            </motion.div>
          </div>

          {/* Story Stats Card */}
          <SpookyCard glowColor="purple" style={{ marginBottom: 'clamp(1.5rem, 3vh, 2rem)', padding: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            <h3 
              className="font-spooky text-spooky-orange-400"
              style={{ 
                fontSize: 'clamp(1.125rem, 1.75vw, 1.25rem)',
                marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
              }}
            >Story Details</h3>
            <div 
              className="grid grid-cols-2"
              style={{ gap: 'clamp(1rem, 1.5vw, 1.5rem)' }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.6 }}
                className="text-left"
              >
                <p 
                  className="text-gray-400 font-fun"
                  style={{ 
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                    marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)'
                  }}
                >📄 Pages</p>
                <p 
                  className="text-white font-bold"
                  style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}
                >{currentStory.metadata.pageCount}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.7 }}
                className="text-left"
              >
                <p 
                  className="text-gray-400 font-fun"
                  style={{ 
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                    marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)'
                  }}
                >⏱️ Duration</p>
                <p 
                  className="text-white font-bold"
                  style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}
                >
                  {currentStory.metadata.estimatedReadTime}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.8 }}
                className="text-left"
              >
                <p 
                  className="text-gray-400 font-fun"
                  style={{ 
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                    marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)'
                  }}
                >👤 Character</p>
                <p 
                  className="text-white font-semibold"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
                >{currentStory.input.characterName}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.9 }}
                className="text-left"
              >
                <p 
                  className="text-gray-400 font-fun"
                  style={{ 
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                    marginBottom: 'clamp(0.25rem, 0.5vh, 0.5rem)'
                  }}
                >🗺️ Setting</p>
                <p 
                  className="text-white font-semibold"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
                >{currentStory.input.setting}</p>
              </motion.div>
            </div>
          </SpookyCard>

          {/* Action Buttons */}
          <CompletionActions onReadAgain={handleReadAgain} onNewStory={handleNewStory} />

          {/* Random Advice from API */}
          {advice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="bg-dark-800/60 backdrop-blur-md rounded-2xl p-6 border border-spooky-purple-600/30 shadow-lg">
                <div className="text-3xl mb-3 text-center">💡</div>
                <p className="text-gray-300 text-base leading-relaxed text-center italic">
                  "{advice.advice}"
                </p>
                <p className="text-spooky-purple-400 text-xs text-center mt-3 font-semibold">
                  — Advice for your next adventure
                </p>
              </div>
            </motion.div>
          )}

          {/* Fun message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4 }}
            className="mt-6 text-gray-400 font-fun italic"
          >
            "Every story is a new adventure waiting to be told..."
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};
