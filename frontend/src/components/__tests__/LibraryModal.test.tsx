import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LibraryModal } from '../LibraryModal';
import { storyApi } from '@/api/client';
import toast from 'react-hot-toast';

// Mock dependencies
vi.mock('@/api/client', () => ({
  storyApi: {
    getStoryList: vi.fn(),
    deleteStory: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LibraryModal', () => {
  const mockStories = [
    {
      id: 'story-1',
      title: 'The Brave Little Robot',
      createdAt: '2025-11-17T10:30:00',
    },
    {
      id: 'story-2',
      title: 'Mystery of the Haunted Castle',
      createdAt: '2025-11-16T15:20:00',
    },
  ];

  const renderModal = (isOpen = true, onClose = vi.fn()) => {
    return render(
      <BrowserRouter>
        <LibraryModal isOpen={isOpen} onClose={onClose} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      renderModal(false);
      expect(screen.queryByText('Story Library')).not.toBeInTheDocument();
    });

    it('should render modal header when isOpen is true', () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);
      renderModal(true);
      expect(screen.getByText('Story Library')).toBeInTheDocument();
    });

    it('should render close button', () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);
      renderModal(true);
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });

    it('should render admin dashboard link', () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);
      renderModal(true);
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should display loading spinner while fetching stories', async () => {
      vi.mocked(storyApi.getStoryList).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderModal(true);

      expect(screen.getByText('Loading stories...')).toBeInTheDocument();
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('should fetch stories when modal opens', async () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);

      renderModal(true);

      await waitFor(() => {
        expect(storyApi.getStoryList).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      vi.mocked(storyApi.getStoryList).mockRejectedValue(
        new Error('Network error')
      );

      renderModal(true);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to load stories. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('should show retry button on error', async () => {
      vi.mocked(storyApi.getStoryList).mockRejectedValue(
        new Error('Network error')
      );

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('should retry fetching stories when retry button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockStories);

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      const retryButton = screen.getByText('Retry');
      await user.click(retryButton);

      await waitFor(() => {
        expect(storyApi.getStoryList).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state message when no stories exist', async () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);

      renderModal(true);

      await waitFor(() => {
        expect(
          screen.getByText('No stories yet. Create your first story!')
        ).toBeInTheDocument();
      });
    });

    it('should show create story button in empty state', async () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('Create Story')).toBeInTheDocument();
      });
    });

    it('should close modal when create story button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);

      renderModal(true, onClose);

      await waitFor(() => {
        expect(screen.getByText('Create Story')).toBeInTheDocument();
      });

      const createButton = screen.getByText('Create Story');
      await user.click(createButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Story List', () => {
    it('should display list of stories', async () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
        expect(
          screen.getByText('Mystery of the Haunted Castle')
        ).toBeInTheDocument();
      });
    });

    it('should display formatted creation dates', async () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText(/Created: Nov 17, 2025/)).toBeInTheDocument();
        expect(screen.getByText(/Created: Nov 16, 2025/)).toBeInTheDocument();
      });
    });

    it('should display play and delete buttons for each story', async () => {
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);

      renderModal(true);

      await waitFor(() => {
        const playButtons = screen.getAllByText('Play');
        const deleteButtons = screen.getAllByText('Delete');
        expect(playButtons).toHaveLength(2);
        expect(deleteButtons).toHaveLength(2);
      });
    });
  });

  describe('Play Button Interaction', () => {
    it('should navigate to reading page when play button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
      });

      const playButtons = screen.getAllByText('Play');
      await user.click(playButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith('/read/story-1');
    });
  });

  describe('Delete Button Interaction', () => {
    it('should show confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText('Are you sure you want to delete this story?')
        ).toBeInTheDocument();
      });
    });

    it('should display story title in confirmation dialog', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText(/"The Brave Little Robot" will be permanently deleted/)
        ).toBeInTheDocument();
      });
    });

    it('should cancel deletion when cancel button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByText('Are you sure you want to delete this story?')
        ).not.toBeInTheDocument();
      });
    });

    it('should delete story when confirm button is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);
      vi.mocked(storyApi.deleteStory).mockResolvedValue();

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete Story')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Delete Story');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(storyApi.deleteStory).toHaveBeenCalledWith('story-1');
      });
    });

    it('should remove story from list after successful deletion', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);
      vi.mocked(storyApi.deleteStory).mockResolvedValue();

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Delete Story');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.queryByText('The Brave Little Robot')
        ).not.toBeInTheDocument();
      });
    });

    it('should show success toast after deletion', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);
      vi.mocked(storyApi.deleteStory).mockResolvedValue();

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Delete Story');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Story deleted successfully');
      });
    });

    it('should show error toast when deletion fails', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue(mockStories);
      vi.mocked(storyApi.deleteStory).mockRejectedValue(
        new Error('Deletion failed')
      );

      renderModal(true);

      await waitFor(() => {
        expect(screen.getByText('The Brave Little Robot')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      const confirmButton = screen.getByText('Delete Story');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to delete story. Please try again.'
        );
      });
    });
  });

  describe('Modal Close Behavior', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);

      renderModal(true, onClose);

      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);

      const { container } = renderModal(true, onClose);

      // Find the backdrop (first motion.div)
      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/60');
      if (backdrop) {
        await user.click(backdrop);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('should call onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);

      renderModal(true, onClose);

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Admin Link', () => {
    it('should navigate to admin page when admin link is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(storyApi.getStoryList).mockResolvedValue([]);

      renderModal(true);

      const adminLink = screen.getByText(/Admin Dashboard/i);
      await user.click(adminLink);

      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });
});
