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
  const backgroundMusicRef = useRef<Howl | null>(null);
  const hasUserInteracted = useRef(false);

  // Preload all audio files (narration and background music)
  const preloadAllAudio = useCallback(() => {
    if (!story) return;

    // Background music tracks - randomly selected from available options
    const musicTracks: Record<string, string[]> = {
      scary: [
        'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_OesQJ.mp3',
        'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_OFLTe.mp3',
        'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_PiUyE.mp3',
        'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_uSPAM.mp3',
        'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_UtScb.mp3',
      ],
      action: [
        'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_cPbvx.mp3',
        'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_egdsJ.mp3',
        'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_LNSpQ.mp3',
        'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_mbeeB.mp3',
        'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_QeKYo.mp3',
      ],
      awesome: [
        'https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_BmMyL.mp3',
        'https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_HPLsD.mp3',
        'https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_Ynyvv.mp3',
        'https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_ZVbpi.mp3',
      ],
      journey: [
        'https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_aGoQz.mp3',
        'https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_CdABs.mp3',
        'https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_nVrDU.mp3',
        'https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_WXTfj.mp3',
      ],
    };

    story.pages.forEach((page, index) => {
      // Load narration
      const audioUrl = storyApi.getAssetUrl(page.narrationUrl);

      const howl = new Howl({
        src: [audioUrl],
        html5: READING_CONSTANTS.AUDIO.HTML5,
        preload: READING_CONSTANTS.AUDIO.PRELOAD,
        volume: 1.0, // Maximum volume for narration
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

    // Load background music based on first page's music type
    if (story.pages.length > 0) {
      // Default to 'journey' if backgroundMusic is null or undefined
      const musicType = story.pages[0].backgroundMusic || 'journey';
      const musicOptions = musicTracks[musicType];
      
      console.log('Loading background music:', { 
        musicType, 
        wasNull: !story.pages[0].backgroundMusic,
        hasOptions: !!musicOptions 
      });
      
      if (musicOptions && musicOptions.length > 0) {
        const musicSrc = musicOptions[Math.floor(Math.random() * musicOptions.length)];
        console.log('Selected music track:', musicSrc);
        
        backgroundMusicRef.current = new Howl({
          src: [musicSrc],
          format: ['mp3'],
          html5: true,
          preload: true,
          loop: true,
          volume: 0.10, // Subtle background music (10%)
          onload: () => {
            console.log('Background music loaded successfully');
          },
          onloaderror: (_id: number, error: unknown) => {
            console.error('Background music load error:', error);
          },
          onplay: () => {
            console.log('Background music started playing');
          },
        });
      } else {
        console.warn('No music options found for type:', musicType);
      }
    } else {
      console.warn('No pages in story');
    }

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
            
            // Start background music if not already playing
            console.log('switchToPage - checking background music:', {
              exists: !!backgroundMusicRef.current,
              isPlaying: backgroundMusicRef.current?.playing(),
            });
            
            if (backgroundMusicRef.current && !backgroundMusicRef.current.playing()) {
              try {
                backgroundMusicRef.current.play();
                console.log('Background music play() called from switchToPage');
              } catch (error) {
                console.error('Error playing background music in switchToPage:', error);
              }
            }
          }, READING_CONSTANTS.ANIMATION.AUDIO_START_DELAY);
        }
      }
    },
    [isFlipping]
  );

  // Play current audio and background music
  const play = useCallback(() => {
    if (audioRef.current) {
      hasUserInteracted.current = true;
      audioRef.current.play();
      
      // Start background music
      console.log('Attempting to play background music:', {
        exists: !!backgroundMusicRef.current,
        isPlaying: backgroundMusicRef.current?.playing(),
      });
      
      if (backgroundMusicRef.current && !backgroundMusicRef.current.playing()) {
        try {
          backgroundMusicRef.current.play();
          console.log('Background music play() called');
        } catch (error) {
          console.error('Error playing background music:', error);
        }
      }
    }
  }, []);

  // Pause current audio and background music
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
  }, []);

  // Stop current audio and background music
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.stop();
    }
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.stop();
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
      
      // Cleanup background music
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unload();
        backgroundMusicRef.current = null;
      }
      
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
