# Frankenstein Story Generator - Frontend

React + TypeScript + Vite frontend for the AI-powered children's story generator.

> **📚 Full Documentation**: See [kirodocs/](../kirodocs/) for complete architecture, features, and development guides.

## Quick Start

## Tech Stack

### Core
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Animation
- Framer Motion
- GSAP
- React Spring
- Lottie React
- tsParticles

### 3D Graphics
- Three.js
- React Three Fiber
- Drei

### Audio
- Howler.js

### State & Data
- Zustand
- React Router
- Axios
- React Hook Form
- Zod

### UI Components
- Radix UI
- React Hot Toast

## Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment** (optional)

   Create `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8083/api
   VITE_WS_URL=http://localhost:8083/ws/story-progress
   ```

   **Note**: The Vite config includes proxy settings for `/api` and `/ws` endpoints, so you can also use relative URLs. The config also includes a fix for sockjs-client compatibility by defining `global` as `globalThis`.

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:3000

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── api/              # API clients
│   ├── client.ts     # REST API client
│   └── websocket.ts  # WebSocket client
├── components/       # Reusable components
│   ├── forms/            # Form-related components
│   │   ├── StoryFormField.tsx          # Individual form field with emoji, label, input
│   │   ├── FormProgressIndicator.tsx   # Progress bar with step indicators
│   │   ├── SuggestionChips.tsx         # Quick suggestion buttons
│   │   ├── FormNavigation.tsx          # Back/Next/Randomize buttons
│   │   └── index.ts                    # Barrel exports
│   ├── reading/          # Reading page components
│   │   ├── PlaybackControls.tsx        # Play/pause, previous, next buttons
│   │   ├── AudioProgressDisplay.tsx    # Progress bar with countdown
│   │   ├── TextHighlightDisplay.tsx    # Synchronized text highlighting
│   │   ├── PageNavigationButtons.tsx   # Text position toggle
│   │   ├── PlayPromptOverlay.tsx       # Start reading prompt
│   │   └── index.ts                    # Barrel exports
│   ├── admin/            # Admin dashboard components
│   │   ├── StatisticsCards.tsx         # API usage statistics grid
│   │   ├── ConfigurationEditor.tsx     # API pricing configuration
│   │   ├── LogsTable.tsx               # API call logs table
│   │   ├── LogsActions.tsx             # Bulk log operations
│   │   └── index.ts                    # Barrel exports
│   ├── completion/       # Completion page components
│   │   ├── CelebrationEffects.tsx      # Fireworks, confetti, trophy
│   │   ├── CompletionActions.tsx       # Replay/new story buttons
│   │   └── index.ts                    # Barrel exports
│   ├── shared/           # Shared component library
│   │   ├── buttons/          # Button components
│   │   │   ├── ActionButton.tsx        # Primary action button
│   │   │   ├── IconButton.tsx          # Icon-only button
│   │   │   ├── PlayPauseButton.tsx     # Play/pause toggle
│   │   │   └── index.ts
│   │   ├── cards/            # Card components
│   │   │   ├── ContentCard.tsx         # Content container with glow
│   │   │   ├── InfoCard.tsx            # Info card with title/icon
│   │   │   ├── StatCard.tsx            # Statistics display card
│   │   │   └── index.ts
│   │   ├── indicators/       # Progress/status indicators
│   │   │   ├── ProgressBar.tsx         # Progress bar component
│   │   │   ├── StatusIndicator.tsx     # Status display
│   │   │   ├── StepIndicator.tsx       # Step progress indicator
│   │   │   └── index.ts
│   │   ├── overlays/         # Modal/overlay components
│   │   │   ├── FullScreenOverlay.tsx   # Full-screen backdrop
│   │   │   ├── PromptOverlay.tsx       # Prompt with action
│   │   │   └── index.ts
│   │   └── index.ts              # Main barrel export
│   ├── spooky/           # Themed UI components
│   │   ├── SpookyButton.tsx
│   │   ├── SpookyCard.tsx
│   │   ├── SpookyEffects.tsx
│   │   ├── BookPage3D.tsx
│   │   ├── AudioVisualizer.tsx
│   │   ├── FloatingBats.tsx
│   │   ├── FloatingGhost.tsx
│   │   ├── FloatingCandles.tsx
│   │   ├── FlyingBooks.tsx
│   │   ├── LightningEffect.tsx
│   │   ├── MagicSparkles.tsx
│   │   ├── MagicalCauldron.tsx
│   │   ├── CelebrationFireworks.tsx
│   │   ├── ConfettiRain.tsx
│   │   └── TrophyReveal.tsx
│   ├── ParticleBackground.tsx
│   ├── ErrorBoundary.tsx
│   └── HighlightedWord.tsx
├── hooks/            # Custom hooks
│   ├── forms/            # Form-related hooks
│   │   ├── useStoryFormState.ts        # Form state management
│   │   └── index.ts
│   ├── reading/          # Reading page hooks
│   │   ├── useCountdownTimer.ts        # Countdown logic
│   │   ├── useReadingPageHandlers.ts   # Event handlers
│   │   ├── useReadingPageState.ts      # Page state
│   │   └── index.ts
│   ├── admin/            # Admin dashboard hooks
│   │   ├── useAdminData.ts             # Data fetching
│   │   └── index.ts
│   ├── shared/           # Shared utility hooks
│   │   ├── useKeyboardNavigation.ts    # Keyboard events
│   │   └── index.ts
│   ├── useApiWithRetry.ts
│   ├── useAutoPlay.ts
│   ├── usePageNavigation.ts
│   ├── useReducedMotion.ts
│   ├── useStoryAudio.ts
│   ├── useStoryForm.ts
│   └── useTextHighlighting.ts
├── pages/           # Page components
│   ├── InputPage.tsx       # Mad-lib input (~100 lines)
│   ├── LoadingPage.tsx     # Generation progress
│   ├── ReadingPage.tsx     # Book reader (~170 lines)
│   ├── CompletionPage.tsx  # Story complete (~100 lines)
│   └── AdminPage.tsx       # Admin dashboard (~80 lines)
├── store/           # Zustand stores
│   ├── storyStore.ts
│   └── audioStore.ts
├── types/           # TypeScript types
│   ├── forms.ts          # Form-related types
│   ├── reading.ts        # Reading page types
│   ├── admin.ts          # Admin dashboard types
│   └── index.ts          # Shared types
├── utils/           # Utilities
│   ├── cn.ts
│   ├── suggestions.ts
│   ├── accessibility.ts
│   └── errorHandler.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Component Architecture

This frontend has been refactored to follow best practices for component organization and maintainability:

### Design Principles

- **Single Responsibility**: Each component has one clear purpose
- **Component Size**: All components under 200 lines (most under 150)
- **Reusability**: Shared components used across multiple pages
- **Composition**: Complex UIs built from simple, focused components
- **Clean Imports**: Barrel exports (index.ts) for simplified imports

### Component Organization

**Feature-Based Structure**: Components are organized by feature domain (forms, reading, admin, completion) rather than by type. This makes it easier to locate related components and understand feature boundaries.

**Shared Component Library**: Common UI patterns (buttons, cards, indicators, overlays) are extracted into a shared library, ensuring consistency and reducing duplication.

**Custom Hooks**: Complex logic is extracted into custom hooks, making components cleaner and logic more testable and reusable.

### Page Components (Orchestrators)

Page components are kept small (< 200 lines) and focus on:
- Orchestrating child components
- Managing page-level state
- Handling navigation and routing
- Coordinating data flow

They delegate rendering and logic to specialized components and hooks.

### Example: Reading Page Refactoring

**Before** (361 lines):
- Mixed audio controls, text display, progress bars, overlays, and navigation
- Complex state management with multiple useEffect hooks
- Difficult to test and maintain

**After** (170 lines):
- `PlaybackControls`: Play/pause, previous, next buttons
- `AudioProgressDisplay`: Progress bar with countdown
- `TextHighlightDisplay`: Synchronized text highlighting
- `PageNavigationButtons`: Text position toggle
- `PlayPromptOverlay`: Start reading prompt
- `useCountdownTimer`: Countdown logic hook
- `useReadingPageHandlers`: Event handlers hook
- `useReadingPageState`: Page state hook

**Benefits**:
- Each component is focused and testable
- Logic is reusable through hooks
- Easier to understand and modify
- Better performance with memoization

## Key Features Breakdown

### 1. Input Flow (`InputPage.tsx`)
- Step-by-step form with 8 fields
- Suggestion chips for each field
- "Surprise Me!" randomizer button - instantly fills all fields with random suggestions
- Clickable breadcrumb navigation between completed steps
- Progress bar with completion percentage
- Form validation with Zod
- Spooky themed design

### 2. Loading Experience (`LoadingPage.tsx`)
- WebSocket connection for real-time updates
- Animated progress bar with shimmer effect
- Stage indicators
- Book animation placeholder
- Automatic navigation on completion

### 3. Reading Interface (`ReadingPage.tsx`)
- Initial play prompt overlay (required for browser audio autoplay policies)
- Two-page book layout
- Image on left, text on right
- Page flip animations
- Synchronized audio narration
- Auto-advance to next page after audio completes
- Navigation controls (previous/next, play/pause)

### 4. Completion Screen (`CompletionPage.tsx`)
- Book closing animation
- Story metadata display
- Options to replay or create new story

## Audio Playback

The reading page uses Howler.js to:
1. Preload narration audio for all pages
2. Play audio synchronized with page display
3. Auto-advance to next page when audio ends
4. Provide play/pause controls for user interaction

The audio system is managed through custom hooks:
- `useStoryAudio`: Handles audio loading, playback, and page switching
- `usePageNavigation`: Manages page state and flip animations

## Animation Examples

### Page Flip
```typescript
<motion.div
  initial={{ opacity: 0, rotateY: -90 }}
  animate={{ opacity: 1, rotateY: 0 }}
  exit={{ opacity: 0, rotateY: 90 }}
  transition={{ duration: 0.6 }}
>
  {/* Page content */}
</motion.div>
```

### Progress Bar with CSS Transitions
```typescript
// Optimized with CSS transitions instead of Framer Motion for better performance
<div
  className="h-full bg-gradient-to-r from-spooky-purple-600 via-spooky-pink-500 to-spooky-orange-500 transition-all duration-300"
  style={{ width: `${progress}%` }}
>
  <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%]" />
</div>
```

## Customization

### Colors
Edit `tailwind.config.js` to customize the spooky theme:
```javascript
colors: {
  spooky: {
    // Your color palette
  }
}
```

### Fonts
Update `index.html` to change fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font" />
```

### Animations
Modify animation durations in component files or `tailwind.config.js`

## Development Tips

### Hot Module Replacement
Vite provides instant HMR. Changes appear immediately without full page reload.

### TypeScript
All components are fully typed. The IDE will provide autocomplete and type checking.

### Debugging
Use React DevTools and browser console. All API calls and WebSocket messages are logged.

### Performance
- Images are lazy-loaded
- Audio is preloaded only for current/next page
- Animations use GPU acceleration
- CSS transitions for simple animations (better performance than Framer Motion)
- React.memo for frequently re-rendered components (e.g., word highlighting)

## Deployment

Build the app:
```bash
npm run build
```

The `dist` folder contains production-ready files. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

## Configuration Details

### Vite Proxy Setup
The `vite.config.ts` includes:
- Proxy for `/api` requests to `http://localhost:8083`
- WebSocket proxy for `/ws` to `http://localhost:8083`
- Global variable fix for sockjs-client: `global: 'globalThis'`

This allows the frontend to communicate with the backend without CORS issues during development.

## Documentation

For detailed information, see:

- **Architecture**: [kirodocs/architecture/](../kirodocs/architecture/)
- **Features**: [kirodocs/features/](../kirodocs/features/)
- **Development**: [kirodocs/development/](../kirodocs/development/)
- **Performance**: [kirodocs/performance/](../kirodocs/performance/)
- **Technology Stack**: [.kiro/steering/tech.md](../.kiro/steering/tech.md)
- **Project Structure**: [.kiro/steering/structure.md](../.kiro/steering/structure.md)

## Troubleshooting

### Audio not playing
Check browser console for CORS errors, ensure backend is running on port 8083.

### WebSocket connection failed
Verify CORS settings and Vite proxy configuration.

### Images not loading
Check network tab for 404 errors, verify image generation completed.

## License

See LICENSE file in root directory.
