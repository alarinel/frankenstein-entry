# Product Overview

Frankenstein is an AI-powered children's story generator that creates immersive, multimedia stories with customizable themes. The application transforms user inputs into complete 10-15 page stories with AI-generated text, images, narration, and sound effects.

## Core Experience

1. **Story Customization**: Select theme (Spooky, Adventure, Fantasy) and narrator voice (Male, Female)
2. **Mad-Lib Input**: Sequential form where users provide 8 story elements (character name, setting, villain, special item, trait, goal, time period, mood)
3. **Two-Phase Generation**: Live progress updates showing outline generation (5%) followed by full story creation
4. **Cinematic Playback**: 3D book interface with synchronized narration, word-level text highlighting, and atmospheric effects
5. **Completion**: Story summary with options to replay or create new stories
6. **Admin Dashboard**: Monitor API usage, costs, and configure voice IDs and pricing (accessible at /admin)

## Key Features

- **Customizable Themes**: Choose from Spooky, Adventure, or Fantasy story styles
- **Voice Selection**: Male or female narrator with configurable voice IDs
- **Two-Phase Story Generation**: Outline creation followed by full story development
- **Extended Stories**: 10-15 pages with modern, punchy writing style
- **Left-Third Image Composition**: Consistent visual layout optimized for text overlay
- AI story generation using Claude (Sonnet 4.5)
- Image generation via Stability AI with consistent visual style (seed-based)
- Audio narration and sound effects from ElevenLabs
- 3D page-turning animations with Three.js
- Real-time WebSocket progress updates with detailed stages
- Word-level text highlighting synchronized with narration
- Spooky/magical dark theme with particle effects
- Admin dashboard for API cost tracking and voice configuration
- Fully responsive design

## Target Audience

Children's stories with family-friendly content, presented through an engaging, movie-like interface with horror/fantasy aesthetics.

## Technical Philosophy

"Stitch together a chimera of technologies" - integrates 40+ third-party tools and 3 AI services into one cohesive experience. Emphasizes parallel processing, real-time updates, and cinematic user experience.
