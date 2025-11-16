# Component Architecture

## Overview

The Frankenstein application follows a component-based architecture with clear separation of concerns.

## Component Hierarchy

### Pages (Route Components)
```
App.tsx
├── InputPage.tsx          # Mad-lib form (/)
├── LoadingPage.tsx        # Generation progress (/loading/:id)
├── ReadingPage.tsx        # Story playback (/read/:id)
├── CompletionPage.tsx     # Completion screen (/complete/:id)
└── AdminPage.tsx          # Admin dashboard (/admin)
```

### Shared Components

#### UI Components
```
components/
├── Book3D.tsx                    # 3D book display with text/images
├── AudioProgressBar.tsx          # Audio progress visualization
├── NavigationControls.tsx        # Navigation buttons
├── SubtleParticleBackground.tsx  # Ambient particles
├── ParticleBackground.tsx        # Full particle system
├── HighlightedWord.tsx           # Word highlighting
└── ErrorBoundary.tsx             # Error handling
```

#### Spooky Components
```
components/spooky/
├── FloatingBats.tsx          # Horizontal flying bats
├── FloatingSpiders.tsx       # Vertical crawling spiders
├── FloatingCandles.tsx       # Floating candles
├── FloatingGhost.tsx         # Ghost cluster
├── FlyingBooks.tsx           # Flying books
├── MagicSparkles.tsx         # Sparkle effects
├── LightningEffect.tsx       # Lightning flashes
├── MagicalCauldron.tsx       # Cauldron animation
├── AudioVisualizer.tsx       # Audio visualization
├── BookPage3D.tsx            # 3D page component
├── CelebrationFireworks.tsx  # Fireworks effect
├── ConfettiRain.tsx          # Confetti animation
├── TrophyReveal.tsx          # Trophy animation
├── SpookyButton.tsx          # Themed button
├── SpookyCard.tsx            # Themed card
└── SpookyEffects.tsx         # Various effects
```

### Custom Hooks

```
hooks/
├── useStoryAudio.ts          # Audio playback management
├── useTextHighlighting.ts    # Word highlighting sync
├── usePageNavigation.ts      # Page navigation logic
├── useAutoPlay.ts            # Auto-advance logic
├── useApiWithRetry.ts        # API retry logic
└── useReducedMotion.ts       # Accessibility
```

### State Management

```
store/
├── storyStore.ts             # Story state (Zustand)
└── audioStore.ts             # Audio state (Zustand)
```

### API Clients

```
api/
├── client.ts                 # Main API client (Axios)
├── websocket.ts              # WebSocket client (STOMP)
├── quotable.ts               # ZenQuotes API
├── sunriseSunset.ts          # Sunrise-Sunset API
├── adviceSlip.ts             # Advice Slip API
├── jokeApi.ts                # JokeAPI
├── randomUser.ts             # Random User API
├── boredApi.ts               # Bored API
└── agify.ts                  # Agify API
```

## Data Flow

### Story Generation Flow
```
InputPage
  ↓ (form submit)
Backend API
  ↓ (WebSocket updates)
LoadingPage
  ↓ (completion)
ReadingPage
  ↓ (finish)
CompletionPage
```

### Reading Page Data Flow
```
ReadingPage (orchestrator)
  ├→ usePageNavigation (page state)
  ├→ useStoryAudio (audio management)
  ├→ useTextHighlighting (word sync)
  ├→ useAutoPlay (auto-advance)
  ├→ Book3D (display)
  ├→ AudioProgressBar (progress)
  └→ NavigationControls (buttons)
```

## Component Communication

### Props Down, Events Up
- Parent components pass data via props
- Child components emit events via callbacks
- No direct child-to-child communication

### State Management
- **Local State**: Component-specific UI state
- **Zustand Stores**: Shared application state
- **Custom Hooks**: Reusable stateful logic

## Design Principles

### 1. Single Responsibility
Each component has ONE clear purpose:
- `Book3D`: Display the book
- `AudioProgressBar`: Show progress
- `NavigationControls`: Handle navigation

### 2. Composition
Build complex UIs from simple components:
```tsx
<ReadingPage>
  <Book3D />
  <AudioProgressBar />
  <NavigationControls />
</ReadingPage>
```

### 3. Separation of Concerns
- **Components**: UI rendering
- **Hooks**: Business logic
- **Stores**: Global state
- **API**: External communication

### 4. Prop Drilling Prevention
- Use Zustand for deeply nested state
- Custom hooks for shared logic
- Context for theme/config

## Component Size Guidelines

| Type | Max Lines | Ideal Lines |
|------|-----------|-------------|
| Page Component | 250 | 150-200 |
| UI Component | 200 | 100-150 |
| Hook | 150 | 50-100 |
| Utility | 100 | 50-75 |

## Testing Strategy

### Component Tests
- Test UI rendering
- Test user interactions
- Mock external dependencies

### Hook Tests
- Test state changes
- Test side effects
- Test cleanup

### Integration Tests
- Test component composition
- Test data flow
- Test error handling

## Performance Optimization

### Memoization
- `useMemo` for expensive calculations
- `useCallback` for stable function references
- `React.memo` for pure components

### Code Splitting
- Route-based splitting (automatic with React Router)
- Lazy loading for heavy components
- Dynamic imports for optional features

### Animation Performance
- Hardware acceleration (`translateZ(0)`)
- Reduced motion support
- FPS limiting for particles

## Related Documentation

- [Guidelines](../../.kiro/steering/guidelines.md) - Coding standards
- [Structure](../../.kiro/steering/structure.md) - File organization
- [Refactoring](../development/REFACTORING_SUMMARY.md) - Refactoring details
