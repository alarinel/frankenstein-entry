/**
 * Custom hook for managing story audio playback with Howler.js
 * 
 * @author alarinel@gmail.com
 */

import { useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';
import { Story } from '@/types';
import { storyApi } from '@/api/client';
import { READING_CONSTANTS } from '@/constants/reading';

interface UseStoryAudioOptions {
  story: Story | null;
  isFlipping: boolean;
  onPlayStart: (pageIndex: number) => void;
  onPlayEnd: (pageIndex: number) => void;
  onError: (error: unknown, context: string) => void;
}

export const useStoryAudio = ({
  story,
  isFlipping,
  onPlayStart,
  onPlayEnd,
  onError,
}: UseStoryAudioOptions) => {
  const audioRef = useRef<Howl | null>(null);
  const allAudioRef = useRef<Map<number, Howl>>(new Map());
  const hasUserInteracted = useRef(false);

  // Preload all audio files
  const preloadAllAudio = useCallback(() => {
    if (!story) return;

    story.pages.forEach((page, index) => {
      const audioUrl = storyApi.getAssetUrl(page.narrationUrl);

      const howl = new Howl({
        src: [audioUrl],
        html5: READING_CONSTANTS.AUDIO.HTML5,
        preload: READING_CONSTANTS.AUDIO.PRELOAD,
        onplay: () => {
          onPlayStart(index);
        },
        onend: () => {
          onPlayEnd(index);
        },
        onloaderror: (_id: number, error: unknown) => {
          onError(error, `Audio load error for page ${index + 1}`);
        },
        onplayerror: (_id: number, error: unknown) => {
          onError(error, `Audio playback error for page ${index + 1}`);
        },
      });

      allAudioRef.current.set(index, howl);
    });

    // Set first page as current
    if (allAudioRef.current.has(0)) {
      audioRef.current = allAudioRef.current.get(0)!;
    }
  }, [story, onPlayStart, onPlayEnd, onError]);

  // Switch to a specific page's audio
  const switchToPage = useCallback(
    (pageIndex: number) => {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.stop();
      }

      // Switch to new page audio
      const newAudio = allAudioRef.current.get(pageIndex);
      if (newAudio) {
        audioRef.current = newAudio;

        // Auto-play if user has interacted and not currently flipping
        if (hasUserInteracted.current && !isFlipping) {
          setTimeout(() => {
            newAudio.play();
          }, READING_CONSTANTS.ANIMATION.AUDIO_START_DELAY);
        }
      }
    },
    [isFlipping]
  );

  // Play current audio
  const play = useCallback(() => {
    if (audioRef.current) {
      hasUserInteracted.current = true;
      audioRef.current.play();
    }
  }, []);

  // Pause current audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Stop current audio
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.stop();
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(
    (isPlaying: boolean) => {
      hasUserInteracted.current = true;
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    },
    [play, pause]
  );

  // Mark user as having interacted
  const markUserInteracted = useCallback(() => {
    hasUserInteracted.current = true;
  }, []);

  // Cleanup all audio on unmount
  useEffect(() => {
    return () => {
      const audioMap = allAudioRef.current;
      audioMap.forEach((howl) => {
        howl.unload();
      });
      audioMap.clear();
      audioRef.current = null;
    };
  }, []);

  // Preload audio when story changes
  useEffect(() => {
    if (story && story.pages.length > 0) {
      preloadAllAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id]);

  return {
    audioRef,
    play,
    pause,
    stop,
    togglePlayPause,
    switchToPage,
    markUserInteracted,
    hasInteracted: hasUserInteracted.current,
  };
};
