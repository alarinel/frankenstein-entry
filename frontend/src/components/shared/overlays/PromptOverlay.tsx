import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { FullScreenOverlay } from './FullScreenOverlay';

interface PromptOverlayProps {
  show: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  actionButton: ReactNode;
  onClose?: () => void;
}

/**
 * Shared prompt overlay for user confirmations and actions
 * Displays a centered prompt with title, description, icon, and action button
 */
export const PromptOverlay = ({
  show,
  title,
  description,
  icon,
  actionButton,
  onClose,
}: PromptOverlayProps) => {
  return (
    <FullScreenOverlay show={show} onClose={onClose} closeOnBackdropClick={false}>
      {icon && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          {icon}
        </motion.div>
      )}
      <h2 className="text-4xl font-spooky text-transparent bg-gradient-to-r from-spooky-purple-400 via-spooky-pink-400 to-spooky-orange-400 bg-clip-text mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-gray-300 text-lg mb-8 font-fun">{description}</p>
      )}
      {actionButton}
    </FullScreenOverlay>
  );
};
