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
    <div className="h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-spooky-purple-950 flex items-center justify-center overflow-hidden relative">
      {/* Reduced effects for better performance */}
      <FloatingBats count={2} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full flex flex-col items-center justify-center text-center z-10 overflow-y-auto"
        style={{ 
          maxWidth: 'min(90vw, 900px)', 
          padding: 'clamp(1rem, 2vh, 2rem) clamp(1rem, 3vw, 2rem)',
        }}
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
            <span>🎭</span>
            {' '}Story Complete!{' '}
            <span>🎭</span>
          </SpookyTitle>

          <p
            className="text-gray-300 font-serif italic"
            style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)'
            }}
          >
            "{currentStory.title}"
          </p>

          {/* Achievement Badges */}
          <div 
            className="flex justify-center flex-wrap"
            style={{ 
              gap: 'clamp(0.5rem, 1vw, 0.75rem)',
              marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)'
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.2, type: 'spring' }}
              className="bg-gradient-to-r from-spooky-purple-600 to-spooky-pink-600 rounded-full shadow-lg"
              style={{ padding: 'clamp(0.375rem, 0.75vh, 0.5rem) clamp(0.75rem, 1.5vw, 1rem)' }}
            >
              <span style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', marginRight: 'clamp(0.25rem, 0.5vw, 0.375rem)' }}>📚</span>
              <span 
                className="text-white font-fun font-bold"
                style={{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }}
              >Story Master</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.4, type: 'spring' }}
              className="bg-gradient-to-r from-spooky-orange-600 to-spooky-pink-600 rounded-full shadow-lg"
              style={{ padding: 'clamp(0.375rem, 0.75vh, 0.5rem) clamp(0.75rem, 1.5vw, 1rem)' }}
            >
              <span style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', marginRight: 'clamp(0.25rem, 0.5vw, 0.375rem)' }}>⭐</span>
              <span 
                className="text-white font-fun font-bold"
                style={{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }}
              >Adventure Complete</span>
            </motion.div>
          </div>

          {/* Story Stats Card */}
          <SpookyCard glowColor="purple" style={{ marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)', padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
            <h3 
              className="font-spooky text-spooky-orange-400"
              style={{ 
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)'
              }}
            >Story Details</h3>
            <div 
              className="grid grid-cols-2"
              style={{ gap: 'clamp(0.75rem, 1.25vw, 1rem)' }}
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
                    fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                    marginBottom: 'clamp(0.125rem, 0.25vh, 0.25rem)'
                  }}
                >📄 Pages</p>
                <p 
                  className="text-white font-bold"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
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
                    fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                    marginBottom: 'clamp(0.125rem, 0.25vh, 0.25rem)'
                  }}
                >⏱️ Duration</p>
                <p 
                  className="text-white font-bold"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
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
                    fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                    marginBottom: 'clamp(0.125rem, 0.25vh, 0.25rem)'
                  }}
                >👤 Character</p>
                <p 
                  className="text-white font-semibold"
                  style={{ fontSize: 'clamp(0.875rem, 1.25vw, 1rem)' }}
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
                    fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                    marginBottom: 'clamp(0.125rem, 0.25vh, 0.25rem)'
                  }}
                >🗺️ Setting</p>
                <p 
                  className="text-white font-semibold"
                  style={{ fontSize: 'clamp(0.875rem, 1.25vw, 1rem)' }}
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
              style={{ marginTop: 'clamp(0.75rem, 1.5vh, 1rem)' }}
            >
              <div 
                className="bg-dark-800/60 backdrop-blur-md rounded-2xl border border-spooky-purple-600/30 shadow-lg"
                style={{ padding: 'clamp(0.75rem, 1.5vw, 1rem)' }}
              >
                <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: 'clamp(0.375rem, 0.75vh, 0.5rem)', textAlign: 'center' }}>💡</div>
                <p 
                  className="text-gray-300 leading-relaxed text-center italic"
                  style={{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }}
                >
                  "{advice.advice}"
                </p>
                <p 
                  className="text-spooky-purple-400 text-center font-semibold"
                  style={{ 
                    fontSize: 'clamp(0.625rem, 0.85vw, 0.75rem)',
                    marginTop: 'clamp(0.375rem, 0.75vh, 0.5rem)'
                  }}
                >
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
            className="text-gray-400 font-fun italic"
            style={{ 
              marginTop: 'clamp(0.5rem, 1vh, 0.75rem)',
              fontSize: 'clamp(0.75rem, 1vw, 0.875rem)'
            }}
          >
            "Every story is a new adventure waiting to be told..."
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};
