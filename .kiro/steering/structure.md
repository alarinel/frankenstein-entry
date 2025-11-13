# Project Structure

## Repository Layout

```
frankenstein/
├── backend/          # Spring Boot application
├── frontend/         # React TypeScript application
└── docs/            # Project documentation (*.md files in root)
```

## Backend Structure

```
backend/src/main/java/com/frankenstein/story/
├── FrankensteinApplication.java          # Main Spring Boot entry point
├── config/                               # Spring configuration
│   ├── AsyncConfig.java                  # Async executor setup
│   ├── HttpClientConfig.java             # HTTP client beans
│   ├── WebConfig.java                    # CORS, MVC config
│   └── WebSocketConfig.java              # WebSocket/STOMP config
├── controller/                           # REST endpoints
│   ├── StoryController.java              # Story generation API
│   └── AssetController.java              # Static asset serving
├── service/                              # Business logic
│   ├── StoryOrchestrationService.java    # Main coordinator
│   ├── StoryGenerationService.java       # Claude integration
│   ├── ImageGenerationService.java       # Stability AI integration
│   ├── AudioGenerationService.java       # ElevenLabs integration
│   ├── FileStorageService.java           # File I/O operations
│   └── ProgressNotificationService.java  # WebSocket updates
├── model/                                # Data models
│   ├── Story.java                        # Main story entity
│   ├── StoryInput.java                   # User input DTO
│   ├── StoryPage.java                    # Individual page
│   ├── StoryMetadata.java                # Story metadata
│   ├── StoryStatus.java                  # Status enum
│   ├── StoryStructure.java               # Claude response structure
│   ├── GenerateStoryResponse.java        # API response
│   └── GenerationProgress.java           # Progress updates
└── exception/                            # Error handling
    ├── GlobalExceptionHandler.java       # @ControllerAdvice
    ├── StoryGenerationException.java
    ├── StoryNotFoundException.java
    ├── ResourceNotFoundException.java
    └── ErrorResponse.java
```

**Resources**:
- `application.yml` - Configuration
- `application-example.yml` - Config template

**Tests**: Mirror main structure under `src/test/java/`

## Frontend Structure

```
frontend/src/
├── main.tsx                    # Application entry point
├── App.tsx                     # Root component with routing
├── index.css                   # Global styles (Tailwind)
├── pages/                      # Route components
│   ├── InputPage.tsx           # Mad-lib form (/input)
│   ├── LoadingPage.tsx         # Generation progress (/loading/:id)
│   ├── ReadingPage.tsx         # Story playback (/read/:id)
│   └── CompletionPage.tsx      # Completion screen (/complete/:id)
├── components/                 # Reusable components
│   ├── ErrorBoundary.tsx
│   ├── ParticleBackground.tsx
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
│   └── websocket.ts            # WebSocket client
├── hooks/                      # Custom React hooks
│   ├── useApiWithRetry.ts      # Retry logic
│   └── useReducedMotion.ts     # Accessibility
├── types/                      # TypeScript definitions
│   └── index.ts                # Shared types
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
└── {storyId}/
    ├── metadata.json           # Story metadata
    ├── images/
    │   ├── page-1.png
    │   ├── page-2.png
    │   └── ...
    └── audio/
        ├── narration/
        │   ├── page-1.mp3
        │   └── ...
        └── effects/
            ├── thunder.mp3
            └── ...
```
