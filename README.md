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
2. **Real-time Generation** - Watch as AI crafts your story with live progress updates
3. **Cinematic Playback** - Experience the story like a movie with:
   - 3D page-turning animations
   - Synchronized narration and text highlighting
   - Dynamic sound effects
   - Atmospheric particle effects

### Technical Highlights

- **AI Story Generation** - Claude (Sonnet 4.5) creates engaging narratives
- **Image Generation** - Stability AI with consistent seeds for thematic coherence
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
- **Framework**: Spring Boot 3.x, Spring AI, Maven
- **AI Integration**: Claude (Sonnet 4.5), Stability AI, ElevenLabs
- **Communication**: REST API, WebSocket (STOMP)
- **Storage**: File-based (local filesystem)
- **Utilities**: OkHttp, Jackson, Lombok

### Frontend (React + TypeScript)
- **Core**: React 18, TypeScript, Vite, Tailwind CSS
- **Animation**: Framer Motion, GSAP, React Spring, Lottie
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Audio**: Howler.js
- **State**: Zustand, React Router
- **Forms**: React Hook Form, Zod
- **UI**: Radix UI, tsParticles, React Hot Toast

### Third-Party Tools (40+)
See [THIRD_PARTY_TOOLS.md](THIRD_PARTY_TOOLS.md) for complete list.

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.8+
- API Keys for: Anthropic, Stability AI, ElevenLabs

### Backend Setup

```bash
cd backend

# Configure API keys
cp src/main/resources/application-example.yml src/main/resources/application-local.yml
# Edit application-local.yml with your API keys

# Run the backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Backend will start on http://localhost:8080

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on http://localhost:3000

### Environment Variables

**Backend** (`application-local.yml`):
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
```

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws/story-progress
```

## 📚 Documentation

- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Comprehensive project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture details
- [ROADMAP.md](ROADMAP.md) - Development phases and timeline
- [THIRD_PARTY_TOOLS.md](THIRD_PARTY_TOOLS.md) - Complete tools catalog
- [backend/README.md](backend/README.md) - Backend documentation
- [frontend/README.md](frontend/README.md) - Frontend documentation

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
Connect: /ws/story-progress
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

## 🎬 User Experience Highlights

### Input Interface
- Sequential field-by-field input
- Suggestion chips for each field
- Spooky dark theme with particle effects
- Form validation with helpful error messages

### Loading Screen
- Animated books assembling
- Real-time status updates
- Progress bar with shimmer effect
- Stage indicators (Story → Images → Audio → Assembly)

### Reading Interface
- 3D book with realistic page flips
- Images on left page, text on right
- Word-by-word highlighting synced with narration
- Auto-advance after each page
- Navigation controls

### Completion Screen
- Book closing animation
- Story metadata summary
- Options to replay or create new story

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

- Backend Issues: See [backend/README.md](backend/README.md)
- Frontend Issues: See [frontend/README.md](frontend/README.md)
- Architecture Questions: See [ARCHITECTURE.md](ARCHITECTURE.md)

---

**Built with ❤️ and a lot of ⚡ by stitching together 40+ technologies into one magical experience!**
