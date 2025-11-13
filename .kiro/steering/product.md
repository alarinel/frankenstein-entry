# Product Overview

Frankenstein is an AI-powered children's story generator that creates immersive, multimedia stories with a spooky/magical theme. The application transforms user inputs into complete 8-page stories with AI-generated text, images, narration, and sound effects.

## Core Experience

1. **Mad-Lib Input**: Sequential form where users provide 8 story elements (character name, setting, villain, special item, trait, goal, time period, mood)
2. **Real-time Generation**: Live progress updates via WebSocket as AI services create the story
3. **Cinematic Playback**: 3D book interface with synchronized narration, word-level text highlighting, and atmospheric effects
4. **Completion**: Story summary with options to replay or create new stories
5. **Admin Dashboard**: Monitor API usage, costs, and configure pricing (accessible at /admin)

## Key Features

- AI story generation using Claude (Sonnet 4.5)
- Image generation via Stability AI with consistent visual style (seed-based)
- Audio narration and sound effects from ElevenLabs
- 3D page-turning animations with Three.js
- Real-time WebSocket progress updates
- Word-level text highlighting synchronized with narration
- Spooky/magical dark theme with particle effects
- Admin dashboard for API cost tracking and configuration
- Fully responsive design

## Target Audience

Children's stories with family-friendly content, presented through an engaging, movie-like interface with horror/fantasy aesthetics.

## Technical Philosophy

"Stitch together a chimera of technologies" - integrates 40+ third-party tools and 3 AI services into one cohesive experience. Emphasizes parallel processing, real-time updates, and cinematic user experience.
