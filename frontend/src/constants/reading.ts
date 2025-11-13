/**
 * Constants for the reading page experience
 * 
 * @author alarinel@gmail.com
 */

export const READING_CONSTANTS = {
  ANIMATION: {
    PAGE_FLIP_DURATION: 800,
    AUTO_ADVANCE_DELAY: 5000, // 5 seconds between pages
    AUDIO_START_DELAY: 300,
  },
  AUDIO: {
    PRELOAD: true,
    HTML5: true,
  },
  BOOK_3D: {
    STACKED_PAGE_COUNT: 5,
    Z_SPACING: 2,
    BASE_OPACITY: 0.4,
    OPACITY_DECAY: 0.07,
    SHADOW_BASE: 0.2,
    SHADOW_INCREMENT: 0.04,
  },
  Z_INDEX: {
    IMAGE_LAYER: 10,
    PAGE_LIGHTING: 15,
    TEXT_CONTENT: 20,
    NAVIGATION: 20,
    PAGE_EDGES: 40,
    PLAY_PROMPT: 50,
  },
  STYLES: {
    BOOK_BORDER_RADIUS: 'rounded-3xl',
  },
} as const;
