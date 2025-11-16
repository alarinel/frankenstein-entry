# Product Overview

Frankenstein is an AI-powered children's story generator that creates immersive, multimedia stories with educational moral themes. The application transforms user inputs into complete 10-15 page stories with AI-generated text, images, narration, and sound effects.

## Core Experience

1. **Moral Theme Selection**: Choose from 15 educational themes (honesty, friendship, courage, etc.) that teach important life lessons
2. **Voice Selection**: Select male or female narrator with configurable voice IDs
3. **Flexible Story Input**: Non-linear form where users provide 8 story elements in any order (character name, setting, villain, special item, trait, goal, time period, mood)
4. **Two-Phase Generation**: Live progress updates showing outline generation followed by full story creation
5. **Cinematic Playback**: 3D book interface with synchronized narration, word-level text highlighting, and dynamic atmospheric effects
6. **Completion**: Story summary with options to replay or create new stories
7. **Admin Dashboard**: Monitor API usage, costs, and configure voice IDs and pricing (accessible at /admin)

## Key Features

### Story Creation
- **Educational Moral Themes**: 15 pre-defined life lessons naturally woven into stories
- **Voice Selection**: Male or female narrator with configurable ElevenLabs voice IDs
- **Non-Linear Form**: Jump to any field, smart randomization, clear all functionality
- **Two-Phase Story Generation**: Outline creation followed by full story development
- **Extended Stories**: 10-15 pages with modern, punchy writing style
- **Consistent Visuals**: Seed-based image generation for character consistency

### Playback Experience
- **3D Book Display**: Realistic page-turning with Three.js
- **Synchronized Audio**: Word-level text highlighting with narration
- **Dynamic Themes**: Time-of-day based color schemes (sunrise, day, sunset, night)
- **Atmospheric Effects**: Optimized particle effects and animations
- **Auto-Play**: Seamless page transitions with countdown

### Technical Features
- AI story generation using Claude (Sonnet 4.5)
- Image generation via Stability AI (SDXL 1024)
- Audio narration and sound effects from ElevenLabs
- Real-time WebSocket progress updates
- Admin dashboard for API cost tracking and configuration
- Fully responsive design optimized for performance

## Target Audience

Children's stories with family-friendly content, presented through an engaging, movie-like interface with horror/fantasy aesthetics.

## Technical Philosophy

"Stitch together a chimera of technologies" - integrates 40+ third-party tools and 3 AI services into one cohesive experience. Emphasizes parallel processing, real-time updates, and cinematic user experience.
