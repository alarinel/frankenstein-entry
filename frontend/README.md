# Frankenstein Story Generator - Frontend

React + TypeScript + Vite frontend for the AI-powered children's story generator.

## Features

- **Spooky Mad-Lib Interface**: Sequential input form with suggestions
- **Real-time Progress**: WebSocket updates during story generation
- **Cinematic Loading**: Animated loading screen with progress tracking
- **Interactive Book**: 3D book with page-turning animations
- **Synchronized Audio**: Text highlighting synchronized with narration
- **Particle Effects**: Beautiful atmospheric background effects
- **Smooth Animations**: Framer Motion + GSAP for movie-like transitions

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
│   └── ParticleBackground.tsx
├── pages/           # Page components
│   ├── InputPage.tsx       # Mad-lib input
│   ├── LoadingPage.tsx     # Generation progress
│   ├── ReadingPage.tsx     # Book reader
│   └── CompletionPage.tsx  # Story complete
├── store/           # Zustand stores
│   ├── storyStore.ts
│   └── audioStore.ts
├── types/           # TypeScript types
│   └── index.ts
├── utils/           # Utilities
│   ├── cn.ts
│   └── suggestions.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

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
- Two-page book layout
- Image on left, text on right
- Page flip animations
- Text highlighting synchronized with audio
- Auto-advance to next page
- Navigation controls

### 4. Completion Screen (`CompletionPage.tsx`)
- Book closing animation
- Story metadata display
- Options to replay or create new story

## Audio Synchronization

The reading page uses Howler.js to:
1. Load narration audio for each page
2. Calculate time per word
3. Highlight words progressively
4. Auto-advance to next page when audio ends

```typescript
const startTextHighlighting = (text: string, duration: number) => {
  const words = text.split(' ');
  const timePerWord = duration / words.length;

  words.forEach((_, index) => {
    setTimeout(() => {
      setHighlightedWords((prev) => [...prev, index]);
    }, timePerWord * 1000 * index);
  });
};
```

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

### Progress Bar with Shimmer
```typescript
<motion.div
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
  animate={{ x: ['-100%', '100%'] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
/>
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

## Troubleshooting

### Audio not playing
- Check browser console for CORS errors
- Ensure backend is running on port 8083
- Verify audio files were generated

### WebSocket connection failed
- Check backend WebSocket configuration
- Verify CORS settings
- Ensure backend is accessible at `http://localhost:8083`
- Check that Vite proxy is working (should see `/ws` requests in Network tab)

### Images not loading
- Check network tab for 404 errors
- Verify image generation completed
- Check API proxy configuration in `vite.config.ts`

### "global is not defined" error
- This should be fixed by the `define: { global: 'globalThis' }` in vite.config.ts
- If you still see this error, clear your browser cache and restart the dev server

## License

See LICENSE file in root directory.
