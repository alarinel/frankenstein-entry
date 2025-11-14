# 🧟 Frankenstein: AI-Powered Children's Story Generator

> **"Stitch together a chimera of technologies into one app"**

An ambitious full-stack application that transforms simple user inputs into immersive, multimedia children's stories complete with AI-generated text, images, narration, and sound effects - all presented through a movie-like interactive experience.

## 🎬 The Vision

Frankenstein brings together seemingly incompatible elements to build something unexpectedly powerful:
- 🤖 **3 AI Services** working in harmony
- 🎨 **40+ Third-party Tools** integrated seamlessly
- 🎥 **Cinematic UI/UX** for an unforgettable experience
- ✨ **Magical Storytelling** powered by cutting-edge AI

## ✨ Features

### User Journey

1. **Mad-Lib Input** - Spooky-themed sequential form with suggestions
   - Step-by-step guided input for 8 story elements
   - Quick suggestion chips for each field
   - "Surprise Me!" button to instantly generate random story inputs
2. **Real-time Generation** - Watch as AI crafts your story with live progress updates
3. **Cinematic Playback** - Experience the story like a movie with:
   - 3D page-turning animations
   - Synchronized narration and text highlighting
   - Dynamic sound effects
   - Atmospheric particle effects
4. **Completion** - Story summary with options to replay or create new stories

### Technical Highlights

- **AI Story Generation** - Claude (Sonnet 4.5) via Spring AI creates engaging narratives
- **Image Generation** - Stability AI via Spring AI with consistent seeds for thematic coherence
- **Audio Generation** - ElevenLabs for realistic narration and sound effects
- **Real-time Updates** - WebSocket for live progress tracking
- **Responsive Design** - Beautiful dark theme optimized for all devices

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│  React Frontend (TypeScript + Vite)              │
│  - Framer Motion, GSAP, Three.js                │
│  - Howler.js, tsParticles, Lottie               │
└─────────────────┬────────────────────────────────┘
                  │ REST + WebSocket
┌─────────────────┴────────────────────────────────┐
│  Spring Boot Backend (Java 21 + Maven)           │
│  - Spring AI, WebSocket, Actuator               │
│  - Async processing, File storage               │
└─────────────────┬────────────────────────────────┘
                  │ External APIs
┌─────────────────┴────────────────────────────────┐
│  AI Services                                      │
│  - Anthropic Claude                              │
│  - Stability AI                                  │
│  - ElevenLabs                                    │
└──────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.0, Spring AI 1.0.0-M4, Maven
- **AI Integration**: 
  - Claude (Sonnet 4.5) via Spring AI Anthropic
  - Stability AI (SDXL 1024) via Spring AI Stability
  - ElevenLabs (direct API integration)
- **Communication**: REST API, WebSocket (STOMP)
- **HTTP Clients**: OkHttp + RestClient with 3-minute read timeout for AI APIs
- **Storage**: File-based (local filesystem)
- **Utilities**: Jackson, Lombok

### Frontend (React + TypeScript)
- **Core**: React 18, TypeScript, Vite, Tailwind CSS
- **Animation**: Framer Motion, GSAP, React Spring, Lottie
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Audio**: Howler.js
- **State**: Zustand, React Router
- **Forms**: React Hook Form, Zod
- **UI**: Radix UI, Aceternity UI, tsParticles, React Hot Toast

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.8+
- API Keys for: Anthropic, Stability AI, ElevenLabs

### Backend Setup

```bash
cd backend

# Configure API keys (Option 1: Using .env file - Recommended)
cp .env.example .env
# Edit .env with your API keys

# OR (Option 2: Using application-local.yml)
cp src/main/resources/application-example.yml src/main/resources/application-local.yml
# Edit application-local.yml with your API keys

# Install dependencies (first time only)
mvn clean install

# Run the backend
mvn spring-boot:run
```

Backend will start on http://localhost:8083

**Note**: The backend automatically loads `.env` files using a custom `DotenvConfig` initializer, making it easier to manage environment variables without creating profile-specific YAML files. The configuration gracefully falls back to system environment variables if no `.env` file is found.

The Vite dev server is configured to proxy API requests to the backend and includes a fix for sockjs-client WebSocket compatibility by defining `global` as `globalThis`.

### Frontend Setup

```bash
cd frontend

# Configure environment
cp .env.example .env
# Edit .env if you need to change API URLs

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on http://localhost:3000

### Environment Variables

**Backend** (`.env` or `application-local.yml`):

Using `.env` file (Recommended):
```env
ANTHROPIC_API_KEY=your-anthropic-api-key-here
STABILITY_API_KEY=your-stability-api-key-here
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Optional
STORAGE_ROOT=./storage  # Optional, defaults to ./storage
```

Or using `application-local.yml`:
```yaml
spring:
  ai:
    anthropic:
      api-key: your-anthropic-key

api:
  stability:
    key: your-stability-key
  elevenlabs:
    key: your-elevenlabs-key
    voice-id: 21m00Tcm4TlvDq8ikWAM  # Optional, has default

storage:
  root: ./storage  # Optional
```

The backend uses a custom `DotenvConfig` class (implementing `ApplicationContextInitializer`) to automatically load `.env` files into Spring's environment. This provides better logging and error handling compared to third-party libraries.

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:8083/api
VITE_WS_URL=http://localhost:8083/ws/story-progress
```

## 🎯 API Endpoints

### Story Generation
```http
POST /api/stories/generate
Content-Type: application/json

{
  "characterName": "Luna",
  "setting": "a mysterious enchanted forest",
  "villain": "the Shadow King",
  "specialItem": "a glowing crystal",
  "characterTrait": "brave and curious",
  "goal": "save the forest creatures",
  "timePeriod": "medieval fantasy times",
  "mood": "mysterious and adventurous"
}
```

### Get Story
```http
GET /api/stories/{storyId}
```

### WebSocket Progress
```
Connect: ws://localhost:8083/ws/story-progress
Subscribe: /topic/story-progress/{storyId}
```

## 🎨 Workflow

1. **User fills mad-lib form** with 8 story elements
2. **Backend initiates generation**:
   - Claude generates story structure (8 pages)
   - Stability AI creates images (parallel, consistent seed)
   - ElevenLabs generates narration + sound effects (parallel)
3. **Real-time progress** updates via WebSocket
4. **Frontend receives complete story** with all assets
5. **Cinematic playback** with synchronized audio/text
6. **Completion screen** with replay/new story options

## 🔧 Development

### Running Tests

**Backend**:
```bash
cd backend
mvn test
```

**Frontend**:
```bash
cd frontend
npm test
```

### Building for Production

**Backend**:
```bash
cd backend
mvn clean package -DskipTests
java -jar target/story-generator-1.0.0-SNAPSHOT.jar
```

**Frontend**:
```bash
cd frontend
npm run build
# Deploy dist/ folder to hosting
```

## 📊 Performance

- **Generation Time**: < 2 minutes for complete 8-page story
- **Parallel Processing**: Images and audio generated simultaneously
- **Optimizations**:
  - Image compression
  - Audio streaming
  - Asset lazy loading
  - GPU-accelerated animations

## 🔒 Security

- API keys stored in environment variables
- Input validation on all user inputs
- CORS configuration for specific origins
- Rate limiting on generation endpoint
- No sensitive data exposed in errors

## 🚀 Deployment

### Backend
- Deploy JAR to cloud platform (AWS, GCP, Azure)
- Configure environment variables
- Set up file storage (consider S3 for scale)

### Frontend
- Build static files: `npm run build`
- Deploy to: Vercel, Netlify, or any CDN
- Configure API proxy

### Docker Deployment

**Backend Dockerfile**:
```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/story-generator-1.0.0-SNAPSHOT.jar app.jar

ENV ANTHROPIC_API_KEY=""
ENV STABILITY_API_KEY=""
ENV ELEVENLABS_API_KEY=""
ENV STORAGE_ROOT="/app/storage"

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Build and run**:
```bash
docker build -t frankenstein-backend .
docker run -p 8080:8080 \
  -e ANTHROPIC_API_KEY=your-key \
  -e STABILITY_API_KEY=your-key \
  -e ELEVENLABS_API_KEY=your-key \
  -v $(pwd)/storage:/app/storage \
  frankenstein-backend
```

## 📈 Cost Estimates

### AI API Costs (per story)
- **Claude**: ~$0.015 (4K tokens)
- **Stability AI**: ~$0.08 (8 images)
- **ElevenLabs**: ~$0.30 (narration)
- **Total per story**: ~$0.40

### Cloud Hosting (monthly)
- **Backend**: $20-50 (small instance)
- **Storage**: $1-10 (first 1000 stories)
- **Frontend**: $0 (static hosting)
- **Total**: ~$25-70/month

## 🎓 Project Structure

```
frankenstein/
├── backend/                    # Spring Boot application
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Configuration files
│   └── src/test/java/         # Unit tests
├── frontend/                   # React TypeScript application
│   ├── src/                   # Source code
│   │   ├── pages/            # Route components
│   │   ├── components/       # Reusable components
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # State management
│   │   ├── api/              # Backend communication
│   │   └── utils/            # Helper functions
│   └── public/               # Static assets
├── .kiro/                     # Kiro AI configuration
│   ├── hooks/                # Agent hooks
│   └── steering/             # Development guidelines
└── README.md                  # This file
```

## 🤝 Contributing

This is a competition entry project. For bugs or suggestions, please open an issue.

## 📝 License

See [LICENSE](LICENSE) file.

## 🏆 Acknowledgments

Built for the "Frankenstein: Stitch together a chimera of technologies" ideation challenge.

### AI Services
- Anthropic Claude
- Stability AI
- ElevenLabs

### Key Technologies
- Spring Boot & Spring AI
- React & TypeScript
- Framer Motion & GSAP
- Three.js & Howler.js

### Design Inspiration
- Children's storybooks
- Horror/spooky aesthetics
- Cinematic user experiences

## 📞 Support

For detailed information:
- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`
- **Development Guidelines**: See `.kiro/steering/guidelines.md`
- **Architecture**: See `.kiro/steering/structure.md`

---

**Built with ❤️ and a lot of ⚡ by stitching together 40+ technologies into one magical experience!**
