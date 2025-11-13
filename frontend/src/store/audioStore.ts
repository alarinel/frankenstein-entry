import { create } from 'zustand';
import { Howl } from 'howler';

interface AudioStore {
  currentPageAudio: Howl | null;
  soundEffects: Howl[];
  isPlaying: boolean;
  currentPage: number;
  currentTime: number;

  setCurrentPageAudio: (audio: Howl | null) => void;
  setSoundEffects: (effects: Howl[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentPage: (page: number) => void;
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  cleanup: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  currentPageAudio: null,
  soundEffects: [],
  isPlaying: false,
  currentPage: 0,
  currentTime: 0,

  setCurrentPageAudio: (audio) => set({ currentPageAudio: audio }),
  setSoundEffects: (effects) => set({ soundEffects: effects }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setCurrentTime: (time) => set({ currentTime: time }),

  play: () => {
    const { currentPageAudio } = get();
    if (currentPageAudio) {
      currentPageAudio.play();
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const { currentPageAudio } = get();
    if (currentPageAudio) {
      currentPageAudio.pause();
      set({ isPlaying: false });
    }
  },

  stop: () => {
    const { currentPageAudio, soundEffects } = get();
    if (currentPageAudio) {
      currentPageAudio.stop();
    }
    soundEffects.forEach((effect) => effect.stop());
    set({ isPlaying: false, currentTime: 0 });
  },

  cleanup: () => {
    const { currentPageAudio, soundEffects } = get();
    if (currentPageAudio) {
      currentPageAudio.unload();
    }
    soundEffects.forEach((effect) => effect.unload());
    set({
      currentPageAudio: null,
      soundEffects: [],
      isPlaying: false,
      currentPage: 0,
      currentTime: 0,
    });
  },
}));
