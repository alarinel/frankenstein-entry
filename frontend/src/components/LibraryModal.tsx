import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { storyApi } from '@/api/client';
import { StoryIndexEntry } from '@/types';
import { SpookyButton } from '@/components/spooky/SpookyButton';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LibraryModal = ({ isOpen, onClose }: LibraryModalProps) => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<StoryIndexEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch stories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStories();
    }
  }, [isOpen]);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storyApi.getStoryList();
      setStories(data);
    } catch (err) {
      setError('Failed to load stories. Please try again.');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Focus management and focus trap
  useEffect(() => {
    if (isOpen) {
      // Store the element that had focus before modal opened
      const previouslyFocusedElement = document.activeElement as HTMLElement;
      
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      // Return focus to previously focused element when modal closes
      return () => {
        previouslyFocusedElement?.focus();
      };
    }
  }, [isOpen]);

  // Handle escape key to close modal and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab on first element -> focus last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // Tab on last element -> focus first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePlayStory = (storyId: string) => {
    navigate(`/read/${storyId}`);
  };

  const handleDeleteClick = (storyId: string) => {
    setDeleteConfirm(storyId);
    // Announce to screen readers
    const story = stories.find(s => s.id === storyId);
    if (story) {
      announceToScreenReader(`Delete confirmation dialog opened for ${story.title}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const story = stories.find(s => s.id === deleteConfirm);
    const storyTitle = story?.title || 'Story';

    try {
      await storyApi.deleteStory(deleteConfirm);
      // Remove story from local state
      setStories(stories.filter(story => story.id !== deleteConfirm));
      setDeleteConfirm(null);
      toast.success('Story deleted successfully');
      announceToScreenReader(`${storyTitle} has been deleted successfully`);
    } catch (err) {
      toast.error('Failed to delete story. Please try again.');
      announceToScreenReader('Failed to delete story. Please try again.');
      console.error('Error deleting story:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
    announceToScreenReader('Delete cancelled');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  // Helper function to announce messages to screen readers
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div
              ref={modalRef}
              className="bg-dark-900/95 border-2 border-spooky-purple-600/50 rounded-xl shadow-2xl shadow-spooky-purple-600/30 max-w-2xl w-full max-h-[80vh] flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-spooky-purple-600/30">
                <h2 id="modal-title" className="text-3xl font-bold text-white">Story Library</h2>
                
                {/* Close Button */}
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-dark-800/50 rounded-lg"
                  aria-label="Close story library modal"
                  title="Close (Escape)"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Admin Link */}
              <div className="px-6 pt-4">
                <button
                  onClick={handleAdminClick}
                  className="text-spooky-purple-400 hover:text-spooky-purple-300 transition-colors flex items-center gap-2 text-sm font-medium"
                  aria-label="Navigate to admin dashboard"
                  title="Admin Dashboard"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Admin Dashboard →
                </button>
              </div>

              {/* Content Area */}
              <div 
                id="modal-description" 
                className="flex-1 overflow-y-auto p-6"
                role="region"
                aria-label="Story list content"
              >
                {/* Loading State */}
                {loading && (
                  <div 
                    className="flex flex-col items-center justify-center py-12"
                    role="status"
                    aria-live="polite"
                    aria-label="Loading stories"
                  >
                    <div className="w-12 h-12 border-4 border-spooky-purple-600 border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true" />
                    <p className="text-gray-400">Loading stories...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div 
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                    role="alert"
                    aria-live="assertive"
                  >
                    <svg
                      className="w-16 h-16 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-400 font-semibold">{error}</p>
                    <SpookyButton 
                      onClick={fetchStories} 
                      variant="secondary"
                      aria-label="Retry loading stories"
                    >
                      Retry
                    </SpookyButton>
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && stories.length === 0 && (
                  <div 
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                    role="status"
                    aria-label="No stories available"
                  >
                    <svg
                      className="w-20 h-20 text-spooky-purple-600/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p className="text-gray-400 text-lg font-medium">
                      No stories yet. Create your first story!
                    </p>
                    <SpookyButton 
                      onClick={onClose} 
                      variant="primary"
                      aria-label="Close modal and create your first story"
                    >
                      Create Story
                    </SpookyButton>
                  </div>
                )}
                
                {/* Story List */}
                {!loading && !error && stories.length > 0 && (
                  <div 
                    className="space-y-4"
                    role="list"
                    aria-label={`${stories.length} ${stories.length === 1 ? 'story' : 'stories'} available`}
                  >
                    {stories.map((story) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.15 }}
                        className="bg-dark-800/80 border border-spooky-purple-600/30 rounded-lg p-4 hover:border-spooky-purple-400/50 hover:shadow-lg hover:shadow-spooky-purple-600/20 transition-all"
                        role="listitem"
                      >
                        {/* Delete Confirmation Dialog */}
                        {deleteConfirm === story.id ? (
                          <div 
                            className="space-y-4"
                            role="alertdialog"
                            aria-labelledby={`delete-confirm-title-${story.id}`}
                            aria-describedby={`delete-confirm-desc-${story.id}`}
                          >
                            <div className="flex items-center gap-2 text-yellow-400">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                              </svg>
                              <p id={`delete-confirm-title-${story.id}`} className="font-semibold">
                                Are you sure you want to delete this story?
                              </p>
                            </div>
                            <p id={`delete-confirm-desc-${story.id}`} className="text-sm text-gray-400">
                              "{story.title}" will be permanently deleted. This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={handleDeleteCancel}
                                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors font-medium"
                                aria-label="Cancel deletion"
                                autoFocus
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
                                aria-label={`Confirm deletion of ${story.title}`}
                              >
                                Delete Story
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 
                                className="text-lg font-semibold text-white truncate"
                                id={`story-title-${story.id}`}
                              >
                                {story.title}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                Created: {formatDate(story.createdAt)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0" role="group" aria-label={`Actions for ${story.title}`}>
                              {/* Play Button */}
                              <button
                                onClick={() => handlePlayStory(story.id)}
                                className="px-4 py-2 bg-spooky-purple-600 hover:bg-spooky-purple-500 text-white rounded-lg transition-colors flex items-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-spooky-purple-400 focus:ring-offset-2 focus:ring-offset-dark-900"
                                aria-label={`Play ${story.title}`}
                                title={`Play ${story.title}`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                                <span>Play</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteClick(story.id)}
                                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-dark-900"
                                aria-label={`Delete ${story.title}`}
                                title={`Delete ${story.title}`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
