# Frankenstein: AI-Powered Children's Story Generator

## Project Vision
Stitch together a chimera of technologies into one app - bringing together AI services, multimedia generation, and cinematic UI/UX to create a magical children's storybook experience.

## Overview
A full-stack application that transforms simple user inputs into immersive, multimedia children's stories complete with AI-generated text, images, narration, and sound effects, all presented through a movie-like interactive interface.

## System Architecture

### High-Level Flow
```
User Input (Mad-Lib Style)
    → Backend Orchestration
    → Claude (Story + Image Prompts + Sound Descriptions)
    → Parallel Generation:
        - Stability AI (Images with consistent seed)
        - ElevenLabs (Narration + Sound Effects)
    → Asset Assembly
    → Frontend Playback (Cinematic Experience)
```

### Technology Stack

#### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x with Maven
- **Configuration**: YAML-based
- **AI Integration**: Spring AI
- **Storage**: File-based (local filesystem)
- **APIs**:
  - Anthropic Claude (Sonnet 4.5) - Story generation
  - Stability AI - Image generation
  - ElevenLabs - Text-to-speech & sound effects

#### Frontend (React TypeScript)
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context + Hooks
- **Styling**: Tailwind CSS + Framer Motion
- **Animation**: Framer Motion, React Spring, GSAP
- **Audio**: Howler.js
- **UI Components**: Radix UI, Aceternity UI

## Core Features

### 1. Story Input Interface (Mad-Lib Style)
- **Theme**: Spooky/dark aesthetic
- **Input Fields**:
  - Character name
  - Setting/location
  - Villain/antagonist
  - Special object/item
  - Character trait
  - Adventure goal
  - Time period
  - Mood/tone
- **UX**: Each field appears sequentially with suggestions
- **Animations**: Smooth transitions, particle effects

### 2. Story Generation Workflow

#### Phase 1: Story Structure Generation
Claude generates:
```json
{
  "story": {
    "pages": [
      {
        "pageNumber": 1,
        "text": "Story text for this page...",
        "imagePrompt": "Detailed Stability AI prompt...",
        "soundEffects": ["ambient_forest", "owl_hoot"],
        "mood": "mysterious"
      }
    ],
    "metadata": {
      "title": "Generated title",
      "estimatedDuration": "3:45",
      "imageSeed": 12345
    }
  }
}
```

#### Phase 2: Parallel Asset Generation
- **Images**: Stability AI with consistent seed
- **Audio**: ElevenLabs TTS + sound effects
- **Progress Updates**: WebSocket for real-time status

#### Phase 3: Asset Assembly
- Combine all assets
- Generate manifest
- Return to frontend

### 3. Loading Experience
- **Theme**: Magical/mysterious workshop
- **Animations**:
  - Books flying and assembling
  - Ink spilling and forming characters
  - Lightning crackling
  - Progress indicators disguised as potion bottles
- **Updates**: Real-time generation status

### 4. Book Reading Interface

#### Visual Design
- **Layout**: 3D book with page-turning animation
- **Background**: Atmospheric dark theme with particles
- **Typography**: Beautiful serif fonts for story text
- **Images**: Full-bleed on left page, text on right

#### Audio-Visual Synchronization
- Text highlighting follows narration
- Word-by-word or phrase-by-phrase highlighting
- Sound effects triggered at precise moments
- Background ambient audio per page

#### Page Transitions
- 3D page flip animation
- Subtle sound effect (page rustle)
- Smooth crossfade of background music

### 5. Completion Screen
- Book closing animation
- Options:
  - "Create New Story" - returns to input
  - "Read Again" - replays current story
  - "Story Gallery" - view saved stories

## Third-Party Tools & Libraries

### Frontend Enhancement Libraries

#### 1. **Framer Motion** (https://www.framer.com/motion/)
- **Purpose**: Advanced animations, page transitions
- **Use Cases**: Page flips, loading animations, text reveals

#### 2. **GSAP (GreenSock)** (https://greensock.com/)
- **Purpose**: Timeline-based animations, scroll effects
- **Use Cases**: Complex sequences, synchronized animations

#### 3. **React Spring** (https://www.react-spring.dev/)
- **Purpose**: Physics-based animations
- **Use Cases**: Natural movements, interactive elements

#### 4. **Three.js + React Three Fiber** (https://threejs.org/)
- **Purpose**: 3D graphics and effects
- **Use Cases**: Book 3D model, particle systems, atmospheric effects

#### 5. **Howler.js** (https://howlerjs.com/)
- **Purpose**: Audio playback and management
- **Use Cases**: Multi-track audio, sound effects, narration sync

#### 6. **Aceternity UI** (https://ui.aceternity.com/)
- **Purpose**: Beautiful dark-themed UI components
- **Use Cases**: Input forms, buttons, cards, effects

#### 7. **Radix UI** (https://www.radix-ui.com/)
- **Purpose**: Accessible headless components
- **Use Cases**: Modals, tooltips, dropdowns

#### 8. **React Use** (https://github.com/streamich/react-use)
- **Purpose**: Essential React hooks collection
- **Use Cases**: Audio control, animations, lifecycle

#### 9. **Zustand** (https://github.com/pmndrs/zustand)
- **Purpose**: Lightweight state management
- **Use Cases**: Global app state, story data

#### 10. **Lottie React** (https://airbnb.io/lottie/)
- **Purpose**: After Effects animations
- **Use Cases**: Loading animations, micro-interactions

#### 11. **Particles.js / tsParticles** (https://particles.js.org/)
- **Purpose**: Particle effects
- **Use Cases**: Magical sparkles, atmospheric effects

#### 12. **React Hot Toast** (https://react-hot-toast.com/)
- **Purpose**: Beautiful notifications
- **Use Cases**: Error messages, success feedback

#### 13. **React Intersection Observer** (https://github.com/thebuilder/react-intersection-observer)
- **Purpose**: Scroll-based triggers
- **Use Cases**: Lazy loading, animation triggers

#### 14. **Rough Notation** (https://roughnotation.com/)
- **Purpose**: Hand-drawn style annotations
- **Use Cases**: Highlighting text, interactive elements

#### 15. **React Flip Toolkit** (https://github.com/aholachek/react-flip-toolkit)
- **Purpose**: FLIP animations
- **Use Cases**: Smooth layout transitions

### Backend Libraries

#### 16. **Spring AI** (https://spring.io/projects/spring-ai)
- **Purpose**: AI integration framework
- **Use Cases**: Claude API integration

#### 17. **OkHttp** (https://square.github.io/okhttp/)
- **Purpose**: HTTP client
- **Use Cases**: API calls to Stability AI, ElevenLabs

#### 18. **Jackson** (https://github.com/FasterXML/jackson)
- **Purpose**: JSON processing
- **Use Cases**: API request/response handling

#### 19. **Lombok** (https://projectlombok.org/)
- **Purpose**: Reduce boilerplate code
- **Use Cases**: POJOs, builders, logging

#### 20. **Spring Boot Actuator** (https://spring.io/guides/gs/actuator-service/)
- **Purpose**: Production-ready features
- **Use Cases**: Health checks, metrics

#### 21. **WebSocket (Spring)** (https://spring.io/guides/gs/messaging-stomp-websocket/)
- **Purpose**: Real-time communication
- **Use Cases**: Progress updates during generation

### Additional Enhancement Tools

#### 22. **Tailwind CSS** (https://tailwindcss.com/)
- **Purpose**: Utility-first CSS framework
- **Use Cases**: Rapid styling, responsive design

#### 23. **Vite** (https://vitejs.dev/)
- **Purpose**: Fast build tool
- **Use Cases**: Development server, production builds

#### 24. **TypeScript** (https://www.typescriptlang.org/)
- **Purpose**: Type safety
- **Use Cases**: Entire frontend codebase

#### 25. **Axios** (https://axios-http.com/)
- **Purpose**: HTTP client
- **Use Cases**: API calls to backend

#### 26. **React Router** (https://reactrouter.com/)
- **Purpose**: Client-side routing
- **Use Cases**: Navigation between views

#### 27. **React Hook Form** (https://react-hook-form.com/)
- **Purpose**: Form management
- **Use Cases**: Mad-lib input validation

#### 28. **Zod** (https://zod.dev/)
- **Purpose**: Schema validation
- **Use Cases**: Runtime type checking, API responses

## Data Models

### Story Input
```typescript
interface StoryInput {
  characterName: string;
  setting: string;
  villain: string;
  specialItem: string;
  characterTrait: string;
  goal: string;
  timePeriod: string;
  mood: string;
}
```

### Story Page
```typescript
interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
  narrationUrl: string;
  soundEffects: string[];
  duration: number;
  mood: string;
}
```

### Story
```typescript
interface Story {
  id: string;
  title: string;
  input: StoryInput;
  pages: StoryPage[];
  metadata: {
    createdAt: string;
    duration: number;
    imageSeed: number;
  };
}
```

## API Endpoints

### POST /api/stories/generate
- **Request**: StoryInput
- **Response**: { storyId: string, status: string }
- **Description**: Initiates story generation

### GET /api/stories/{storyId}/status
- **Response**: { status: string, progress: number, stage: string }
- **Description**: Checks generation status

### GET /api/stories/{storyId}
- **Response**: Story
- **Description**: Retrieves complete story with assets

### GET /api/stories
- **Response**: Story[]
- **Description**: Lists all saved stories

### WS /ws/story-progress
- **Purpose**: Real-time progress updates

## File Storage Structure

```
storage/
├── stories/
│   ├── {story-id}/
│   │   ├── metadata.json
│   │   ├── images/
│   │   │   ├── page-1.png
│   │   │   ├── page-2.png
│   │   │   └── ...
│   │   ├── audio/
│   │   │   ├── narration/
│   │   │   │   ├── page-1.mp3
│   │   │   │   └── ...
│   │   │   └── effects/
│   │   │       ├── thunder.mp3
│   │   │       └── ...
│   │   └── story.json
```

## Performance Considerations

1. **Parallel Processing**: Generate images and audio simultaneously
2. **Streaming**: Stream assets as they're generated
3. **Caching**: Cache generated stories
4. **Lazy Loading**: Load assets on-demand in frontend
5. **Optimization**: Compress images and audio appropriately

## Security Considerations

1. **API Keys**: Store in environment variables
2. **Rate Limiting**: Prevent abuse of generation endpoint
3. **Input Validation**: Sanitize all user inputs
4. **File Storage**: Implement size limits
5. **CORS**: Configure properly for frontend

## Testing Strategy

### Backend
- Unit tests for services
- Integration tests for API endpoints
- Mock external API calls

### Frontend
- Component tests with React Testing Library
- E2E tests with Playwright
- Visual regression tests

## Future Enhancements

1. **User Accounts**: Save stories per user
2. **Story Templates**: Pre-defined story structures
3. **Sharing**: Share stories via link
4. **Customization**: User-selected voice actors, art styles
5. **Mobile App**: React Native version
6. **Multiplayer**: Collaborative story creation
7. **AR/VR**: Immersive reading experience
8. **Print Export**: Generate PDF/printable books
9. **Translations**: Multi-language support
10. **Analytics**: Track engagement, popular themes

## Success Metrics

1. **Generation Time**: < 2 minutes for complete story
2. **Quality**: High-quality, coherent stories
3. **User Experience**: Smooth, engaging interface
4. **Reliability**: 99% uptime, error handling
5. **Performance**: Fast loading, smooth animations

## Development Timeline

See ROADMAP.md for detailed implementation phases.
