# Project Structure

## Repository Layout

```
frankenstein/
├── backend/          # Spring Boot application
├── frontend/         # React TypeScript application
├── kirodocs/         # Project documentation (organized by category)
├── .kiro/            # Kiro configuration and steering docs
└── storage/          # Generated story assets and API logs
```

## Backend Structure

```
backend/src/main/java/com/frankenstein/story/
├── FrankensteinApplication.java          # Main Spring Boot entry point
├── config/                               # Spring configuration
│   ├── AsyncConfig.java                  # Async executor setup
│   ├── DotenvConfig.java                 # .env file loader (ApplicationContextInitializer)
│   ├── HttpClientConfig.java             # HTTP client beans (OkHttp + RestClient with configurable timeouts)
│   ├── WebConfig.java                    # CORS, MVC config
│   └── WebSocketConfig.java              # WebSocket/STOMP config
├── controller/                           # REST endpoints
│   ├── StoryController.java              # Story generation API
│   ├── AssetController.java              # Static asset serving
│   └── AdminController.java              # Admin dashboard API
├── service/                              # Business logic
│   ├── StoryOrchestrationService.java    # Main coordinator
│   ├── StoryGenerationService.java       # Claude integration via Spring AI (outline + full story)
│   ├── ImageGenerationService.java       # Stability AI integration via Spring AI (left-third composition)
│   ├── AudioGenerationService.java       # ElevenLabs integration (voice selection)
│   ├── FileStorageService.java           # File I/O operations
│   ├── ProgressNotificationService.java  # WebSocket updates (outline + story stages)
│   ├── ApiTrackingService.java           # API cost tracking & configuration
│   ├── StoryIndexService.java            # Story index management (thread-safe operations)
│   └── orchestration/                    # Orchestration services
│       ├── AudioOrchestrationService.java
│       ├── AudioOrchestrationServiceImpl.java
│       ├── ImageOrchestrationService.java
│       ├── ImageOrchestrationServiceImpl.java
│       ├── ProgressCoordinatorService.java
│       ├── ProgressCoordinatorServiceImpl.java
│       ├── StoryAssemblyService.java
│       └── StoryAssemblyServiceImpl.java
├── model/                                # Data models
│   ├── Story.java                        # Main story entity
│   ├── StoryInput.java                   # User input DTO (theme + voiceType)
│   ├── StoryPage.java                    # Individual page
│   ├── StoryMetadata.java                # Story metadata
│   ├── StoryStatus.java                  # Status enum
│   ├── StoryStructure.java               # Claude response structure
│   ├── GenerateStoryResponse.java        # API response
│   ├── GenerationProgress.java           # Progress updates (GENERATING_OUTLINE stage)
│   ├── ApiCallLog.java                   # API call tracking record
│   ├── ApiConfiguration.java             # API cost & rate limit config (voice IDs)
│   ├── StoryIndexEntry.java              # Story index entry (id, title, createdAt)
│   ├── DeleteStoryResponse.java          # Delete operation response
│   └── orchestration/                    # Orchestration models
│       ├── AudioSet.java
│       └── ImageSet.java
└── exception/                            # Error handling
    ├── GlobalExceptionHandler.java       # @ControllerAdvice
    ├── StoryGenerationException.java
    ├── ImageGenerationException.java
    ├── AudioGenerationException.java
    ├── FileStorageException.java
    ├── StoryNotFoundException.java
    ├── ResourceNotFoundException.java
    └── ErrorResponse.java
```

**Resources**:
- `application.yml` - Configuration
- `application-example.yml` - Config template
- `META-INF/spring.factories` - Spring Boot auto-configuration (registers DotenvConfig)

**Tests**: Mirror main structure under `src/test/java/`

## Frontend Structure

```
frontend/src/
├── main.tsx                    # Application entry point
├── App.tsx                     # Root component with routing
├── index.css                   # Global styles (Tailwind)
├── pages/                      # Route components
│   ├── InputPage.tsx           # Mad-lib form with theme/voice selection (/)
│   ├── LoadingPage.tsx         # Generation progress with outline stage (/loading/:id)
│   ├── ReadingPage.tsx         # Story playback (/read/:id)
│   ├── CompletionPage.tsx      # Completion screen (/complete/:id)
│   └── AdminPage.tsx           # Admin dashboard with voice config (/admin)
├── components/                 # Reusable components
│   ├── ErrorBoundary.tsx
│   ├── ParticleBackground.tsx
│   ├── HighlightedWord.tsx     # Word-level text highlighting
│   ├── ThemeSelector.tsx       # Theme selection component
│   ├── VoiceSelector.tsx       # Voice selection component
│   ├── VoiceConfiguration.tsx  # Admin voice ID configuration
│   ├── LibraryModal.tsx        # Story library modal with play/delete functionality
│   └── spooky/                 # Themed UI components
│       ├── SpookyButton.tsx
│       ├── SpookyCard.tsx
│       ├── SpookyEffects.tsx
│       ├── BookPage3D.tsx      # 3D book component
│       ├── AudioVisualizer.tsx
│       ├── FloatingBats.tsx
│       ├── FloatingGhost.tsx
│       ├── FloatingCandles.tsx
│       ├── FlyingBooks.tsx
│       ├── LightningEffect.tsx
│       ├── MagicSparkles.tsx
│       ├── MagicalCauldron.tsx
│       ├── CelebrationFireworks.tsx
│       ├── ConfettiRain.tsx
│       └── TrophyReveal.tsx
├── store/                      # Zustand state management
│   ├── storyStore.ts           # Story state
│   └── audioStore.ts           # Audio playback state
├── api/                        # Backend communication
│   ├── client.ts               # Axios instance & API methods
│   └── websocket.ts            # WebSocket client (outline stage support)
├── hooks/                      # Custom React hooks
│   ├── useApiWithRetry.ts      # Retry logic
│   ├── useReducedMotion.ts     # Accessibility
│   ├── useStoryAudio.ts        # Audio playback management
│   ├── useTextHighlighting.ts  # Text sync with audio
│   └── usePageNavigation.ts    # Page navigation logic
├── constants/                  # Application constants
│   └── reading.ts              # Reading page timing & config
├── types/                      # TypeScript definitions
│   └── index.ts                # Shared types (theme, voiceType)
└── utils/                      # Helper functions
    ├── accessibility.ts        # A11y utilities
    ├── cn.ts                   # Class name merger
    ├── errorHandler.ts         # Error handling
    └── suggestions.ts          # Form suggestions data
```

**Configuration**:
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind customization
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies & scripts

## Naming Conventions

### Backend (Java)
- **Classes**: PascalCase (e.g., `StoryOrchestrationService`)
- **Methods**: camelCase (e.g., `generateStoryAsync`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Packages**: lowercase (e.g., `com.frankenstein.story.service`)
- **DTOs**: Suffix with purpose (e.g., `StoryInput`, `GenerateStoryResponse`)
- **Exceptions**: Suffix with `Exception` (e.g., `StoryGenerationException`)

### Frontend (TypeScript/React)
- **Components**: PascalCase (e.g., `InputPage`, `SpookyButton`)
- **Files**: Match component name (e.g., `InputPage.tsx`)
- **Hooks**: Prefix with `use` (e.g., `useStoryStore`, `useApiWithRetry`)
- **Types/Interfaces**: PascalCase (e.g., `Story`, `StoryInput`)
- **Functions**: camelCase (e.g., `generateStory`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE or camelCase for config

## Architecture Patterns

### Backend
- **Service Layer Pattern**: Controllers delegate to services
- **Orchestration Pattern**: `StoryOrchestrationService` coordinates multiple services
- **Async Processing**: `@Async` methods with `CompletableFuture` for parallel operations
- **Builder Pattern**: Lombok `@Builder` for model construction
- **Exception Handling**: Global `@ControllerAdvice` for consistent error responses

### Frontend
- **Component Composition**: Small, focused components
- **Custom Hooks**: Extract reusable logic
- **State Management**: Zustand stores for global state
- **Route-based Code Splitting**: Pages as route components
- **Render Props**: For animation wrappers (Framer Motion)

## File Storage Structure

```
storage/
├── {storyId}/                  # Individual story assets
│   ├── metadata.json           # Story metadata
│   ├── images/
│   │   ├── page-1.png
│   │   ├── page-2.png
│   │   └── ...
│   └── audio/
│       ├── narration/
│       │   ├── page-1.mp3
│       │   └── ...
│       └── effects/
│           ├── thunder.mp3
│           └── ...
├── api-tracking/               # API call logs
│   └── {timestamp}_{logId}.json
├── api-config.json             # API cost & rate limit configuration
└── story-index.json            # Story index (id, title, createdAt)
```

## Data Models

### Story Input
```typescript
interface StoryInput {
  theme: string;           // "spooky" | "adventure" | "fantasy"
  voiceType: string;       // "male" | "female"
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
  backgroundMusic: string; // scary, action, awesome, or journey
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

### Story Endpoints

#### POST /api/stories/generate
- **Request**: StoryInput
- **Response**: { storyId: string, status: string }
- **Description**: Initiates story generation

#### GET /api/stories/{storyId}/status
- **Response**: { status: string, progress: number, stage: string }
- **Description**: Checks generation status

#### GET /api/stories/{storyId}
- **Response**: Story
- **Description**: Retrieves complete story with assets

#### GET /api/stories
- **Response**: Story[]
- **Description**: Lists all saved stories (deprecated - use /api/stories/list)

#### GET /api/stories/list
- **Response**: StoryIndexEntry[]
- **Description**: Retrieves all stories from the index (sorted by date desc)

#### DELETE /api/stories/{storyId}
- **Response**: DeleteStoryResponse
- **Description**: Deletes story from index and filesystem

### Admin Endpoints

#### GET /api/admin/logs
- **Response**: ApiCallLog[]
- **Description**: Retrieves all API call logs

#### GET /api/admin/logs/story/{storyId}
- **Response**: ApiCallLog[]
- **Description**: Retrieves logs for a specific story

#### DELETE /api/admin/logs/{logId}
- **Description**: Deletes a specific log entry

#### DELETE /api/admin/logs/old/{days}
- **Description**: Deletes logs older than specified days

#### GET /api/admin/statistics
- **Response**: Statistics object with totals, costs, success rates
- **Description**: Retrieves aggregated API usage statistics

#### GET /api/admin/configuration
- **Response**: ApiConfiguration
- **Description**: Retrieves current API cost and rate limit configuration

#### PUT /api/admin/configuration
- **Request**: ApiConfiguration
- **Response**: ApiConfiguration
- **Description**: Updates API cost and rate limit configuration

### WebSocket

#### WS /ws/story-progress
- **Purpose**: Real-time progress updates during story generation
