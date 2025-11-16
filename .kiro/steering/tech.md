# Technology Stack

## Backend

**Framework**: Spring Boot 3.2.0 with Java 21
**Build Tool**: Maven 3.8+
**Key Dependencies**:
- Spring AI (Anthropic + Stability AI integrations)
- Spring WebSocket (STOMP protocol)
- Spring Boot Actuator
- java-dotenv (for .env file support via custom DotenvConfig)
- RestClient for HTTP clients (3-minute read timeout for AI APIs)
- Jackson for JSON processing
- Lombok for boilerplate reduction
- SLF4J (logging)

**HTTP Client Configuration**:
- Configurable timeouts via `application.yml` (`http.client.*` properties)
- Default: 30s connect, 3m read, 30s write
- Uses Spring RestClient for all HTTP calls
- Uses `HttpClientProperties` record with defaults

**AI Services**:
- Anthropic Claude (Sonnet 4.5) via Spring AI Anthropic - story generation
- Stability AI (SDXL 1024) via Spring AI Stability - image generation
- ElevenLabs via RestClient - text-to-speech narration

**Storage**: File-based local filesystem (images, audio, metadata as JSON)

**API Tracking**: Cost tracking and usage monitoring
- File-based JSON storage for API call logs
- Configurable pricing for Anthropic, Stability AI, and ElevenLabs
- Statistics aggregation (total costs, success rates, per-provider metrics)
- Automatic log cleanup by age

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

**Backend**: Uses Spring profiles with YAML configuration and .env files
- `application.yml` - base configuration
- `application-local.yml` - local development (not in git)
- `application-example.yml` - template for local config
- `.env` - environment variables (not in git, loaded via custom DotenvConfig)
- `.env.example` - template for .env file
- `DotenvConfig.java` - Custom ApplicationContextInitializer for .env loading
- `META-INF/spring.factories` - Registers DotenvConfig for automatic discovery

**Frontend**: Environment variables via Vite
- `.env` - environment variables (not in git)
- `.env.example` - template for .env file
- `VITE_API_BASE_URL` - backend API URL
- `VITE_WS_URL` - WebSocket endpoint URL

## API Keys Required

- `ANTHROPIC_API_KEY` - Claude API
- `STABILITY_API_KEY` - Stability AI
- `ELEVENLABS_API_KEY` - ElevenLabs

**Note**: Voice IDs for male and female narrators are now configured via the Admin interface at `/admin` instead of environment variables.

## Development Ports

- Backend: `http://localhost:8083`
- Frontend: `http://localhost:3000`
- WebSocket: `ws://localhost:8083/ws/story-progress`

## Third-Party Tools & Libraries

### AI Services (3)
- **Anthropic Claude (Sonnet 4.5)** via Spring AI Anthropic - Story generation, image prompts
- **Stability AI (SDXL 1024)** via Spring AI Stability - AI image generation with consistent seeds
- **ElevenLabs** via RestClient - Text-to-speech narration

### Backend Core (7)
- Spring Boot, Spring AI, Maven, Lombok, Jackson, Actuator, WebSocket

### Frontend Core (4)
- React, TypeScript, Vite, Tailwind CSS

### Animation & Effects (7)
- Framer Motion, GSAP, React Spring, Lottie, Three.js, R3F, tsParticles

### Audio (1)
- Howler.js

### UI Components (3)
- Aceternity UI, Radix UI, React Hot Toast

### State & Data (4)
- Zustand, React Router, Axios, React Use

### Forms & Validation (2)
- React Hook Form, Zod

### Enhancement Tools (3)
- Intersection Observer, Rough Notation, React Flip Toolkit

### Development Tools (5)
- ESLint, Prettier, Vitest, React Testing Library, Playwright

**Total: 39+ Technologies Working Together!**
