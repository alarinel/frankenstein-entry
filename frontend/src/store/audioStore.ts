import { create } from 'zustand';
import { Howl } from 'howler';

interface AudioStore {
  currentPageAudio: Howl | null;
  backgroundMusic: Howl | null;
  isPlaying: boolean;
  currentPage: number;
  currentTime: number;

  setCurrentPageAudio: (audio: Howl | null) => void;
  setBackgroundMusic: (music: Howl | null) => void;
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
  backgroundMusic: null,
  isPlaying: false,
  currentPage: 0,
  currentTime: 0,

  setCurrentPageAudio: (audio) => set({ currentPageAudio: audio }),
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setCurrentTime: (time) => set({ currentTime: time }),

  play: () => {
    const { currentPageAudio, backgroundMusic } = get();
    if (currentPageAudio) {
      currentPageAudio.play();
      set({ isPlaying: true });
    }
    if (backgroundMusic && !backgroundMusic.playing()) {
      backgroundMusic.play();
    }
  },

  pause: () => {
    const { currentPageAudio, backgroundMusic } = get();
    if (currentPageAudio) {
      currentPageAudio.pause();
      set({ isPlaying: false });
    }
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
  },

  stop: () => {
    const { currentPageAudio, backgroundMusic } = get();
    if (currentPageAudio) {
      currentPageAudio.stop();
    }
    if (backgroundMusic) {
      backgroundMusic.stop();
    }
    set({ isPlaying: false, currentTime: 0 });
  },

  cleanup: () => {
    const { currentPageAudio, backgroundMusic } = get();
    if (currentPageAudio) {
      currentPageAudio.unload();
    }
    if (backgroundMusic) {
      backgroundMusic.unload();
    }
    set({
      currentPageAudio: null,
      backgroundMusic: null,
      isPlaying: false,
      currentPage: 0,
      currentTime: 0,
    });
  },
}));
