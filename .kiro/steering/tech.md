# Technology Stack

## Backend

**Framework**: Spring Boot 3.2.0 with Java 21
**Build Tool**: Maven 3.8+
**Key Dependencies**:
- Spring AI (Anthropic integration)
- Spring WebSocket (STOMP protocol)
- Spring Boot Actuator
- OkHttp for HTTP clients
- Jackson for JSON processing
- Lombok for boilerplate reduction

**AI Services**:
- Anthropic Claude (Sonnet 4.5) - story generation
- Stability AI (SDXL 1024) - image generation
- ElevenLabs - text-to-speech and sound effects

**Storage**: File-based local filesystem (images, audio, metadata as JSON)

## Frontend

**Framework**: React 18 with TypeScript
**Build Tool**: Vite 5
**Styling**: Tailwind CSS 3.4

**Key Libraries**:
- React Router DOM - navigation
- Zustand - state management
- React Hook Form + Zod - form validation
- Axios - HTTP client
- STOMP.js - WebSocket client

**Animation & 3D**:
- Framer Motion - UI animations
- GSAP - complex animations
- Three.js + React Three Fiber - 3D book
- Lottie - micro-animations

**Audio**: Howler.js
**Particles**: tsParticles
**UI Components**: Radix UI primitives
**Notifications**: React Hot Toast

## Common Commands

### Backend

```bash
# Run development server
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Run tests
mvn test

# Build production JAR
mvn clean package -DskipTests

# Run production build
java -jar target/story-generator-1.0.0-SNAPSHOT.jar
```

### Frontend

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Lint code
npm run lint
```

## Configuration

**Backend**: Uses Spring profiles with YAML configuration
- `application.yml` - base configuration
- `application-local.yml` - local development (not in git)
- `application-example.yml` - template for local config

**Frontend**: Environment variables via Vite
- `VITE_API_BASE_URL` - backend API URL
- `VITE_WS_URL` - WebSocket endpoint URL

## API Keys Required

- `ANTHROPIC_API_KEY` - Claude API
- `STABILITY_API_KEY` - Stability AI
- `ELEVENLABS_API_KEY` - ElevenLabs
- `ELEVENLABS_VOICE_ID` - Voice selection (optional, has default)

## Development Ports

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`
- WebSocket: `ws://localhost:8080/ws/story-progress`
