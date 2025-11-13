import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStoryStore } from '@/store/storyStore';
import { ParticleBackground } from '@/components/ParticleBackground';

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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-spooky-950 to-dark-900 flex items-center justify-center p-4">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Book Closing Animation */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -90 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-9xl mb-8"
        >
          📕
        </motion.div>

        {/* Completion Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <h1 className="text-5xl font-spooky text-spooky-400 mb-4">The End</h1>

          <p className="text-2xl text-gray-300 mb-8 font-serif italic">
            "{currentStory.title}"
          </p>

          <div className="bg-dark-900/50 backdrop-blur-sm border border-spooky-700/30 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-gray-500 text-sm mb-1">Pages</p>
                <p className="text-white text-xl">{currentStory.metadata.pageCount}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Duration</p>
                <p className="text-white text-xl">
                  {currentStory.metadata.estimatedReadTime}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Character</p>
                <p className="text-white text-xl">{currentStory.input.characterName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Setting</p>
                <p className="text-white text-xl">{currentStory.input.setting}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleReadAgain}
              className="px-8 py-4 bg-dark-800 hover:bg-dark-700 border border-spooky-600/50 rounded-lg text-white transition-all shadow-lg hover:shadow-spooky-500/30"
            >
              📖 Read Again
            </button>

            <button
              onClick={handleNewStory}
              className="px-8 py-4 bg-gradient-to-r from-spooky-600 to-spooky-500 hover:from-spooky-500 hover:to-spooky-400 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-spooky-500/50"
            >
              ✨ Create New Story
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
