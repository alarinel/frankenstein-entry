import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface FullScreenOverlayProps {
  show: boolean;
  onClose?: () => void;
  children: ReactNode;
  closeOnBackdropClick?: boolean;
  className?: string;
}

/**
 * Shared full-screen overlay component with backdrop
 * Used for modals, prompts, and full-screen interactions
 */
export const FullScreenOverlay = ({
  show,
  onClose,
  children,
  closeOnBackdropClick = true,
  className = '',
}: FullScreenOverlayProps) => {
  const handleBackdropClick = () => {
    if (closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
