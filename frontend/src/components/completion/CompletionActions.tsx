import { motion } from 'framer-motion';
import { SpookyButton } from '@/components/spooky/SpookyButton';

interface CompletionActionsProps {
  onReadAgain: () => void;
  onNewStory: () => void;
}

/**
 * Completion actions component for story completion screen
 * Provides buttons to replay the story or create a new one
 * 
 * @param {CompletionActionsProps} props - Component props
 * @param {Function} props.onReadAgain - Handler for replaying the current story
 * @param {Function} props.onNewStory - Handler for creating a new story
 */
export const CompletionActions = ({ onReadAgain, onNewStory }: CompletionActionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3 }}
      className="flex flex-col md:flex-row gap-4 justify-center"
    >
      <SpookyButton onClick={onReadAgain} variant="secondary" className="w-full md:w-auto">
        <span className="text-2xl mr-2">📖</span>
        Read Again
      </SpookyButton>

      <SpookyButton onClick={onNewStory} variant="primary" className="w-full md:w-auto">
        <span className="text-2xl mr-2">✨</span>
        Create New Story
      </SpookyButton>
    </motion.div>
  );
};
