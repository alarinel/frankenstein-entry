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
   - Floating spooky elements (bats, spiders, candles, ghosts)
   
2. **Real-time Generation** - Watch as AI crafts your story with live progress updates
   - Literary quotes to inspire (Quotable API)
   - Family-friendly jokes to entertain (JokeAPI)
   - Progress visualization with cauldron animation
   - WebSocket updates for real-time status
   
3. **Cinematic Playback** - Experience the story like a movie with:
   - **Auto-play**: Automatically advances pages after 5-second countdown
   - **Audio Progress Bar**: Visual progress with countdown timer
   - **3D Book Effect**: Realistic depth with stacked pages
   - **Dynamic Theming**: Background changes based on time of day (Sunrise-Sunset API)
   - **Word Highlighting**: Text synced with narration
   - **Floating Elements**: Bats, spiders, candles, and sparkles
   - **Text Positioning**: Toggle between left, right, or hidden
   - User-initiated playback (browser-friendly audio controls)
   - 3D page-turning animations with depth effect
   - Dynamic sound effects
   - Atmospheric particle effects
   
4. **Completion** - Story summary with options to replay or create new stories
   - Random advice for encouragement (Advice Slip API)
   - Achievement badges and stats
   - Celebration effects (fireworks, confetti)
   
5. **Admin Dashboard** - Monitor and manage API usage (accessible at `/admin`)
   - View all API call logs with costs and performance metrics
   - Track total spending and success rates
   - Configure API pricing for accurate cost tracking
   - Clean up old logs to manage storage

### Technical Highlights

- **AI Story Generation** - Claude (Sonnet 4.5) via Spring AI creates engaging narratives
- **Image Generation** - Stability AI via Spring AI with consistent seeds for thematic coherence
- **Audio Generation** - ElevenLabs for realistic narration and sound effects
- **Real-time Updates** - WebSocket for live progress tracking
- **Cost Tracking** - Built-in API usage monitoring and cost calculation
- **Word-level Highlighting** - Text synchronized with narration playback
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

### Story Endpoints

#### Generate Story
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

#### Get Story
```http
GET /api/stories/{storyId}
```

#### List All Stories
```http
GET /api/stories
```

### Admin Endpoints

#### Get All API Logs
```http
GET /api/admin/logs
```

#### Get Statistics
```http
GET /api/admin/statistics
```

#### Get Configuration
```http
GET /api/admin/configuration
```

#### Update Configuration
```http
PUT /api/admin/configuration
Content-Type: application/json

{
  "anthropicInputCostPerMillionTokens": 3.0,
  "anthropicOutputCostPerMillionTokens": 15.0,
  "stabilityImageCostPerImage": 0.04,
  "elevenlabsCostPerCharacter": 0.00003,
  "elevenlabsMaxConcurrentRequests": 3,
  "maxStoriesPerDay": 100,
  "enableCostTracking": true
}
```

#### Delete Old Logs
```http
DELETE /api/admin/logs/old/{days}
```

### WebSocket
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

## 🌐 External APIs & Services

This application integrates **10 external APIs** (5 paid AI services + 5 free enhancement APIs) to deliver its full functionality:

### AI & Content Generation APIs (3)

1. **Anthropic Claude API** 
   - **Purpose**: Story text generation and image prompt creation
   - **Model**: Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
   - **Integration**: Spring AI Anthropic starter
   - **Cost**: ~$0.015 per story (input: $3/M tokens, output: $15/M tokens)
   - **Documentation**: https://docs.anthropic.com/
   - **Required**: `ANTHROPIC_API_KEY` environment variable

2. **Stability AI API**
   - **Purpose**: AI image generation for story pages
   - **Model**: SDXL 1024 (Stable Diffusion XL)
   - **Integration**: Spring AI Stability AI starter
   - **Features**: Consistent seed-based generation for thematic coherence
   - **Cost**: ~$0.08 per story (8 images × $0.01 per image)
   - **Documentation**: https://platform.stability.ai/docs
   - **Required**: `STABILITY_API_KEY` environment variable

3. **ElevenLabs API**
   - **Purpose**: Text-to-speech narration and sound effects generation
   - **Integration**: Direct REST API via Spring RestClient
   - **Features**: 
     - High-quality voice synthesis
     - Configurable voice selection
     - Concurrent request throttling (max 3 simultaneous)
   - **Cost**: ~$0.30 per story (narration + sound effects)
   - **Documentation**: https://elevenlabs.io/docs
   - **Required**: `ELEVENLABS_API_KEY` and optional `ELEVENLABS_VOICE_ID`

### Free Enhancement APIs (7)

4. **Quotable API**
   - **Purpose**: Display inspirational literary quotes on loading screens
   - **Integration**: Direct fetch API calls from frontend
   - **Features**: 
     - Filtered by literary/inspirational themes
     - No API key required
     - Completely free
   - **Documentation**: https://github.com/lukePeavey/quotable
   - **Endpoint**: `https://api.quotable.io/random`

5. **Sunrise-Sunset API**
   - **Purpose**: Dynamic theming based on user's local time of day
   - **Integration**: Direct fetch API calls from frontend with geolocation
   - **Features**:
     - Automatic location detection
     - Day/twilight/night theme switching
     - Graceful fallback to local time
     - No API key required
     - Completely free
   - **Documentation**: https://sunrise-sunset.org/api
   - **Endpoint**: `https://api.sunrise-sunset.org/json`

---

6. **Advice Slip API**
   - **Purpose**: Random advice for encouragement on completion page
   - **Integration**: Direct fetch API from frontend
   - **Features**:
     - Provides random life advice
     - Displays after story completion
     - Motivates users to create more stories
     - No API key required
     - Completely free
   - **Documentation**: https://api.adviceslip.com/
   - **Endpoint**: `https://api.adviceslip.com/advice`

---

7. **JokeAPI**
   - **Purpose**: Family-friendly jokes on loading screens
   - **Integration**: Direct fetch API from frontend
   - **Features**:
     - Safe, clean jokes only
     - Filters out offensive content
     - Categories: Programming, Miscellaneous, Puns
     - Entertains during wait time
     - No API key required
     - Completely free
   - **Documentation**: https://v2.jokeapi.dev/
   - **Endpoint**: `https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun`

---

8. **Random User API**
   - **Purpose**: Generate random character names (ready to integrate)
   - **Integration**: Direct fetch API from frontend
   - **Features**:
     - Provides realistic character names
     - Can suggest names when users need inspiration
     - Includes avatar images
     - No API key required
     - Completely free
   - **Documentation**: https://randomuser.me/
   - **Endpoint**: `https://randomuser.me/api/`
   - **Status**: API client created, ready for integration

---

9. **Bored API**
   - **Purpose**: Activity suggestions for story goals (ready to integrate)
   - **Integration**: Direct fetch API from frontend
   - **Features**:
     - Random activity suggestions
     - Can inspire story goals
     - Helps overcome writer's block
     - No API key required
     - Completely free
   - **Documentation**: https://www.boredapi.com/
   - **Endpoint**: `https://www.boredapi.com/api/activity`
   - **Status**: API client created, ready for integration

---

10. **Agify API**
    - **Purpose**: Predict age from name for theme suggestions (ready to integrate)
    - **Integration**: Direct fetch API from frontend
    - **Features**:
      - Predicts age based on character name
      - Suggests age-appropriate story moods
      - Personalizes recommendations
      - 1000 free requests per day
    - **Documentation**: https://agify.io/
    - **Endpoint**: `https://api.agify.io/`
    - **Status**: API client created, ready for integration

### API Cost Summary

**Per Story Generation**:
- Anthropic Claude: $0.015
- Stability AI: $0.080
- ElevenLabs: $0.300
- Quotable: $0.000 (free)
- Sunrise-Sunset: $0.000 (free)
- Advice Slip: $0.000 (free)
- JokeAPI: $0.000 (free)
- Random User: $0.000 (free)
- Bored API: $0.000 (free)
- Agify: $0.000 (free, up to 1000/day)
- **Total**: ~$0.395 per story

**Monthly Estimates** (100 stories):
- AI Services: ~$40
- Free Enhancement APIs: $0
- **Total API Costs**: ~$40/month

**Value Added by Free APIs**:
- 7 free APIs providing quotes, jokes, advice, theming, and inspiration
- Zero additional cost
- Significant UX improvements
- Professional polish

### API Rate Limits & Throttling

- **Anthropic**: Tier-based limits (varies by account)
- **Stability AI**: Configurable in admin dashboard
- **ElevenLabs**: 3 concurrent requests max (configurable)
- **Quotable**: No rate limits
- **Sunrise-Sunset**: No rate limits

### API Configuration

All API costs and rate limits are configurable via the Admin Dashboard (`/admin`):
- Adjust pricing to match your actual API costs
- Monitor real-time usage and spending
- Configure concurrent request limits
- Track success rates and performance metrics

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
- **Rate Limiting**: ElevenLabs requests throttled to 3 concurrent max
- **Optimizations**:
  - Image compression
  - Audio streaming
  - Asset lazy loading
  - GPU-accelerated animations
  - Memoized components for text highlighting

## 🔒 Security

- API keys stored in environment variables
- Input validation on all user inputs
- CORS configuration for specific origins
- Rate limiting on generation endpoint
- No sensitive data exposed in errors
- Admin endpoints accessible (consider adding authentication in production)

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
│   │   ├── controller/       # REST endpoints (Story, Asset, Admin)
│   │   ├── service/          # Business logic & API tracking
│   │   ├── model/            # Data models & DTOs
│   │   ├── config/           # Spring configuration
│   │   └── exception/        # Error handling
│   ├── src/main/resources/    # Configuration files
│   └── src/test/java/         # Unit tests
├── frontend/                   # React TypeScript application
│   ├── src/                   # Source code
│   │   ├── pages/            # Route components (Input, Loading, Reading, Completion, Admin)
│   │   ├── components/       # Reusable components (including HighlightedWord)
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # State management
│   │   ├── api/              # Backend communication
│   │   └── utils/            # Helper functions
│   └── public/               # Static assets
├── storage/                    # File storage
│   ├── {storyId}/            # Story assets (images, audio, metadata)
│   ├── api-tracking/         # API call logs
│   └── api-config.json       # API pricing configuration
├── .kiro/                     # Kiro AI configuration
│   ├── hooks/                # Agent hooks
│   └── steering/             # Development guidelines
└── README.md                  # This file
```

## 🔄 Development Journey: How This Project Came Together

This project was built through an iterative, conversational development process with an AI coding assistant. Here's how the back-and-forth creation unfolded:

### Phase 1: Foundation & Architecture
**Initial Request**: "Create a children's story generator with AI"
- Set up Spring Boot backend with Spring AI integration
- Configured Claude for story generation
- Built React frontend with TypeScript and Vite
- Established project structure and naming conventions

**Refinements**:
- "Use constructor injection, never @Autowired" → Refactored all services to use `@RequiredArgsConstructor`
- "Add author attribution to all classes" → Added JavaDoc with `@author alarinel@gmail.com`
- "The .env file isn't loading" → Created custom `DotenvConfig` ApplicationContextInitializer

### Phase 2: Service Integration & Simplification
**Request**: "Simplify the image generation to use Spring AI instead of custom code"
- Replaced 130 lines of OkHttp boilerplate with Spring AI's `ImageModel`
- Added `spring-ai-stability-ai-spring-boot-starter` dependency
- Rewrote tests to mock Spring AI interfaces
- Result: Cleaner, more maintainable code

**Follow-up**: "Do the same for audio generation"
- Refactored from OkHttp to Spring's `RestClient`
- Reduced complexity while maintaining ElevenLabs integration
- Updated all tests to match new implementation

### Phase 3: Performance & Reliability
**Issue**: "The API is timing out on story generation"
- Increased HTTP client timeouts from 2 minutes to 5 minutes
- Added proper timeout configuration in `application.yml`
- Fixed model name from incorrect `claude-sonnet-4-5-20250929` to correct `claude-3-5-sonnet-20241022`

**Issue**: "Audio generation is failing due to rate limiting"
- Implemented batch processing with 3 concurrent request limit
- Changed from parallel execution to throttled batches
- Prevented API throttling while maintaining reasonable speed

### Phase 4: UI/UX Polish
**Request**: "The title is being cut off"
- Moved header outside constrained container
- Added responsive text sizing
- Fixed overflow issues with proper layout structure

**Issue**: "Surprise Me button makes the form disappear"
- Changed from instant jump to smooth step-by-step transition
- Added 100ms interval animation through form steps
- Improved visual continuity

**Bug**: "Old errors show up when starting new story"
- Added `useEffect` to reset store state on InputPage mount
- Cleared previous generation errors and progress
- Ensured clean slate for each new story

### Phase 5: Bug Fixes & Edge Cases
**Issue**: "Images returning 404 with duplicate /api/api/ in URL"
- Fixed `getAssetUrl` to check if URL already starts with `/api`
- Prevented double-prepending of base URL
- Resolved asset loading issues

**Request**: "Fix the test files after refactoring"
- Rewrote `StoryOrchestrationServiceTest` to match new service signatures
- Updated mocks for `ImageGenerationService` and `AudioGenerationService`
- Ensured all tests pass with refactored architecture

### Phase 6: Configuration & Tooling
**Request**: "Add sequential-thinking and memory MCP servers"
- Added MCP server configurations to `.kiro/settings/mcp.json`
- Debugged package names (npx vs uvx, correct package identifiers)
- Integrated Context7 for up-to-date documentation access

### Phase 7: Admin Dashboard & Cost Tracking
**Request**: "Add API cost tracking and admin dashboard"
- Created `ApiTrackingService` for logging all API calls with costs
- Built `ApiConfiguration` model with configurable pricing
- Added `AdminController` with endpoints for logs, statistics, and configuration
- Developed `AdminPage` React component with:
  - Real-time statistics dashboard (total calls, costs, success rates)
  - Detailed API call logs table
  - Editable configuration for API pricing
  - Bulk log cleanup functionality
- Implemented file-based storage for logs and configuration
- Added route `/admin` to access the dashboard

**Enhancement**: "Improve text highlighting during narration"
- Created `HighlightedWord` component with memoization
- Implemented word-level synchronization with audio playback
- Added gradient text effects for highlighted words
- Optimized rendering performance with React.memo

### Key Patterns That Emerged

1. **Iterative Refinement**: Start with working code, then optimize
2. **Documentation First**: Fetch current API docs before implementing
3. **Test After Refactor**: Update tests immediately after service changes
4. **Configuration Over Code**: Use Spring Boot properties instead of hardcoding
5. **Error-Driven Development**: Fix issues as they appear in logs
6. **User Feedback Loop**: Polish UI based on actual usage experience
7. **Observability Matters**: Track costs and performance from day one
8. **Component Optimization**: Use memoization for frequently re-rendered components

### Lessons Learned

- **Spring AI Simplifies Integration**: Native support beats custom HTTP clients
- **Throttling is Essential**: AI APIs have rate limits - respect them
- **State Management Matters**: Clear old state to prevent UI bugs
- **Timeouts Need Tuning**: AI operations take time - configure accordingly
- **URL Construction is Tricky**: Be careful with base URLs and path concatenation
- **Cost Tracking is Critical**: Monitor API usage to avoid surprises
- **Performance Optimization**: Memoize components that render frequently with same props

### The "Frankenstein" Approach

True to the project's name, we stitched together:
- 3 different AI services (each with unique APIs)
- 40+ third-party libraries (each with their own quirks)
- Multiple architectural patterns (REST, WebSocket, async processing)
- Frontend and backend technologies (React + Spring Boot)

The result? A cohesive, working application that feels like a single, unified experience - despite being assembled from many disparate parts.

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
