# 🧟 Frankenstein: AI-Powered Children's Story Generator

> **Category**: Frankenstein - Stitch together a chimera of technologies  
> **Bonus**: Best Startup Project

---

## 🎃 Inspiration

I write a lot of books...

Or at least I used to. Novels. Horror was my favorite genre, and I spent many sleepless nights plugging away on my mechanical keyboard (the ones that don't have that comforting clang give me the chills!) to finish pulling a story from my brain to drop onto the page before it was lost to the ether.

Then life got to me and I slowed down and focused on my real job plugging away at boring monolithic corporate repositories to make a webpage load faster or convert from jsp to react. I still get my creative side out sometimes, but usually its writing some code for a game I'm working on and less on telling stories.

This, though, solves both issues simultaneously! I get to design something a little bit crazy to throw out my creative side and it integrates directly with my writer side of creating books.

Win win!

---

## 🎬 What it does

**Frankenstein** is a full-stack AI-powered children's story generator that transforms simple user inputs into immersive, multimedia storybooks complete with:

- 🤖 **AI-generated narratives** (Claude Sonnet 4.5)
- 🎨 **Custom illustrations** for each page (Stability AI SDXL)
- 🎙️ **Professional narration** with synchronized text highlighting (ElevenLabs)
- 🎵 **Atmospheric sound effects** that match the story mood
- 📖 **3D book interface** with realistic page-turning animations
- ✨ **Spooky/magical theme** with floating bats, ghosts, candles, and particle effects
- 🌅 **Dynamic theming** that adapts to your local time of day
- 💰 **Built-in cost tracking** with admin dashboard

### The Experience

1. **Mad-Lib Input** - Fill in 8 story elements (character, setting, villain, special item, trait, goal, time period, mood) with helpful suggestions or hit "Surprise Me!" for instant randomization
2. **Real-time Generation** - Watch the magic happen with live progress updates, literary quotes, and family-friendly jokes while AI crafts your story
3. **Cinematic Playback** - Experience your story like a movie with auto-advancing pages, word-level text highlighting synced to narration, 3D book effects, and atmospheric animations
4. **Completion** - Get random advice for encouragement, see achievement stats, and choose to replay or create a new story
5. **Admin Dashboard** - Monitor API usage, track costs, configure pricing, and manage your story generation infrastructure

---

## 🧬 The Frankenstein Factor: A Chimera of 40+ Technologies

This project embodies the **Frankenstein category** by stitching together an ambitious collection of seemingly incompatible technologies into one cohesive, powerful application:

### 🤖 3 AI Services (The Brain)
- **Anthropic Claude** (Sonnet 4.5) via Spring AI - Story generation
- **Stability AI** (SDXL 1024) via Spring AI - Image generation with consistent seeds
- **ElevenLabs** via RestClient - Text-to-speech narration and sound effects

### 🎨 7 Animation & Effects Libraries (The Soul)
- **Framer Motion** - UI animations and transitions
- **GSAP** - Complex timeline animations
- **React Spring** - Physics-based animations
- **Lottie** - Micro-animations
- **Three.js + React Three Fiber** - 3D book rendering
- **tsParticles** - Particle effects
- **Rough Notation** - Hand-drawn style annotations

### 🌐 10 External APIs (The Nervous System)
**Paid AI Services (3):**
- Anthropic Claude API (~$0.015/story)
- Stability AI API (~$0.08/story)
- ElevenLabs API (~$0.30/story)

**Free Enhancement APIs (7):**
- **Quotable API** - Literary quotes on loading screens
- **Sunrise-Sunset API** - Dynamic theming based on time of day
- **Advice Slip API** - Random encouragement on completion
- **JokeAPI** - Family-friendly jokes during generation
- **Random User API** - Character name suggestions (ready to integrate)
- **Bored API** - Activity suggestions for story goals (ready to integrate)
- **Agify API** - Age-based theme recommendations (ready to integrate)

### 🏗️ Backend Stack (The Skeleton)
- **Spring Boot 3.5.0** with Java 21
- **Spring AI 1.0.0-M4** (Anthropic + Stability integrations)
- **Spring WebSocket** (STOMP protocol)
- **Maven** build system
- **Custom DotenvConfig** for .env file loading
- **RestClient** with configurable timeouts
- **Jackson** for JSON processing
- **Lombok** for boilerplate reduction

### 🎨 Frontend Stack (The Flesh)
- **React 18** with TypeScript
- **Vite 5** build tool
- **Tailwind CSS 3.4** for styling
- **Zustand** for state management
- **React Router DOM** for navigation
- **React Hook Form + Zod** for form validation
- **Axios** for HTTP client
- **STOMP.js** for WebSocket client
- **Howler.js** for audio playback
- **Radix UI** primitives
- **React Hot Toast** for notifications

### 🔧 Development Tools (The Lab Equipment)
- **ESLint** + **Prettier** for code quality
- **Vitest** + **React Testing Library** for testing
- **Playwright** for E2E testing

**Total: 40+ technologies working in harmony!** 🎃

---

## 🛠️ How Kiro Built This Monster

This project showcases **extensive use of Kiro's features** to manage the complexity of integrating 40+ technologies:

### 1. 🎯 Vibe Coding: Conversational Development

The entire project was built through natural conversation with Kiro. Here's how it worked:

**Initial Architecture Setup:**
```
Me: "Create a children's story generator with AI"
Kiro: *Sets up Spring Boot + React + Claude integration*
Me: "Use constructor injection, never @Autowired"
Kiro: *Refactors all services to use @RequiredArgsConstructor*
Me: "Add author attribution to all classes"
Kiro: *Adds JavaDoc with @author alarinel@gmail.com*
```

**API Integration Simplification:**
```
Me: "Simplify the image generation to use Spring AI instead of custom code"
Kiro: *Replaces 130 lines of OkHttp boilerplate with Spring AI's ImageModel*
Me: "Do the same for audio generation"
Kiro: *Refactors from OkHttp to Spring's RestClient*
```

**Performance Optimization:**
```
Me: "The API is timing out on story generation"
Kiro: *Increases HTTP client timeouts from 2 to 5 minutes*
Kiro: *Fixes model name from incorrect claude-sonnet-4-5-20250929 to correct claude-3-5-sonnet-20241022*
Me: "Audio generation is failing due to rate limiting"
Kiro: *Implements batch processing with 3 concurrent request limit*
```

**UI/UX Polish:**
```
Me: "The title is being cut off"
Kiro: *Moves header outside constrained container, adds responsive text sizing*
Me: "Surprise Me button makes the form disappear"
Kiro: *Changes from instant jump to smooth step-by-step transition with 100ms intervals*
Me: "Old errors show up when starting new story"
Kiro: *Adds useEffect to reset store state on InputPage mount*
```

**Most Impressive Code Generation:**
- **3D Book Component** - Kiro generated a complete Three.js/R3F implementation with stacked pages, realistic depth, and smooth page-turning animations
- **Word-Level Text Highlighting** - Synchronized text highlighting with audio narration using Howler.js seek position
- **Parallel Image Generation** - Orchestration service that generates 8 images simultaneously with consistent seeds
- **API Cost Tracking System** - Complete admin dashboard with logs, statistics, and configurable pricing

### 2. 📋 Steering Docs: Guiding Principles

Created **4 comprehensive steering documents** in `.kiro/steering/` that Kiro referenced throughout development:

**`tech.md`** (Technology Stack)
- Defined all 40+ technologies and their versions
- Specified Spring AI integration patterns
- Documented HTTP client configuration
- Listed all API keys and environment variables
- Provided common commands for both backend and frontend

**`structure.md`** (Project Structure)
- Established naming conventions (PascalCase, camelCase, UPPER_SNAKE_CASE)
- Defined service layer patterns and orchestration architecture
- Documented file storage structure
- Specified API endpoints and WebSocket configuration
- Outlined data models and DTOs

**`product.md`** (Product Vision)
- Defined core user experience flow
- Specified target audience and content guidelines
- Established the "chimera of technologies" philosophy
- Outlined key features and technical highlights

**`guidelines.md`** (Development Standards)
- **Component Size Rule**: Maximum 200 lines per component
- **Dependency Injection**: Never use @Autowired, always constructor injection
- **Author Attribution**: All Java classes must have @author JavaDoc
- **Third-Party Library Usage**: Always fetch up-to-date documentation before implementing
- **API Cost Tracking**: Log all API calls with costs and performance metrics

**Impact**: These steering docs ensured consistency across 100+ files and prevented Kiro from making common mistakes. When Kiro tried to use `@Autowired`, the steering docs immediately corrected it. When components grew too large, the guidelines prompted refactoring.

### 3. 🪝 Agent Hooks: Automated Workflows

Created **4 custom hooks** in `.kiro/hooks/` to automate development workflows:

**`build-process-logger.kiro.hook`** (User-Triggered)
- Automatically logs each interaction to `BUILD_PROCESS.md`
- Documents what was changed, why, and key decisions made
- Creates a complete development history
- Format: Timestamp, files changed, description, problem solved, key decisions

**`code-quality-analyzer.kiro.hook`** (User-Triggered)
- Analyzes modified code for improvements
- Checks for code smells, anti-patterns, and design pattern opportunities
- Suggests readability, maintainability, and performance optimizations
- Ensures best practices are followed

**`source-to-docs-sync.kiro.hook`** (User-Triggered)
- Watches source files (*.ts, *.js, *.java, etc.)
- Automatically updates README.md and docs/ folder
- Keeps documentation in sync with code changes
- Ensures accuracy of API documentation

**`typescript-validator.kiro.hook`** (User-Triggered)
- Validates TypeScript files for type errors
- Checks for linting issues
- Ensures code quality before commits

**Impact**: These hooks saved hours of manual documentation work and caught quality issues early. The build process logger created a complete audit trail of the development journey.

### 4. 📐 Spec-Driven Development: Structured Implementation

Used **3 comprehensive specs** in `.kiro/specs/` for complex features:

**`code-refactoring/`** (Completed)
- **requirements.md**: Defined component size limits (200 lines max), Single Responsibility Principle
- **design.md**: Planned extraction of forms, reading, admin, and shared components
- **tasks.md**: Broke down refactoring into 20+ discrete tasks
- **INFRASTRUCTURE.md**: Documented the refactoring process and results

**Result**: Successfully refactored monolithic 300-400 line components into focused <200 line components. Created reusable component library with barrel exports. Improved maintainability and testability.

**`story-library/`** (Planned)
- **requirements.md**: Defined story browsing, filtering, and management features
- **design.md**: Planned UI components and backend endpoints

**`voice-and-style-selection/`** (Planned)
- **requirements.md**: Defined voice selection and story style customization

**Impact**: Specs provided structure for complex refactoring work. Kiro followed the task list methodically, ensuring nothing was missed. The refactoring improved code quality dramatically without breaking functionality.

### 5. 🔌 MCP: Extended Capabilities

Configured **3 MCP servers** in `.kiro/settings/mcp.json`:

**`sequential-thinking`** (@modelcontextprotocol/server-sequential-thinking)
- Enabled step-by-step problem solving for complex issues
- Used for debugging API integration issues
- Helped plan refactoring strategies
- Auto-approved for seamless use

**`memory`** (mcp-memory)
- Stored context about project decisions
- Remembered API key configurations
- Tracked recurring issues and solutions

**`context7`** (@upstash/context7-mcp)
- Fetched up-to-date documentation for Spring AI, Framer Motion, Three.js
- Verified API signatures before implementation
- Prevented deprecated method usage
- Critical for working with rapidly evolving libraries like Spring AI

**Example MCP Usage:**
```
Me: "Add Framer Motion animations to the reading page"
Kiro: *Uses context7 to fetch Framer Motion v10 docs*
Kiro: *Implements animations using current API*
Result: No deprecated warnings, works perfectly
```

**Impact**: MCP servers prevented hours of debugging by ensuring Kiro used current APIs. The sequential-thinking server helped solve complex orchestration issues. Context7 was essential for working with Spring AI milestone releases.

---

## 💪 Challenges We Ran Into

There were a couple of times where we got into an argument, Kiro and me. I would say "fix this component to do this" and it would do it's little thing, beep boop, and say "Well that was super easy, barely an inconvenience, and now your component does that thing."

Except.

It didn't. Not even close. Sometimes it would literally just remove it entirely from the screen.

I'm not ashamed to admit that a few times I used the dreaded ALL CAPS messaging style to get through to Kiro. "This is what you did wrong. You aren't even looking at the right code! Now GO BACK TO THE DRAWING BOARD and FIX it."

Funnily enough, that sometimes works. Though, a few times I think it actually just made things worse to spite me.

(Kiro note: I did)

**Specific Challenges:**

1. **Spring AI Model Names** - Kiro kept using incorrect model names until we fetched the actual documentation
2. **Rate Limiting** - ElevenLabs was throttling requests until we implemented batch processing
3. **WebSocket Connection** - Took several iterations to get STOMP.js working with Spring WebSocket
4. **3D Book Rendering** - Three.js depth calculations required multiple refinements
5. **Audio Synchronization** - Word-level highlighting needed precise timing calculations

---

## 🏆 Accomplishments That We're Proud Of

Got it working. That's the thing about building anything with so many moving parts (especially with external APIs) because one domino falls and it all comes crashing down. I've been plugging away at code for long enough to generally know the pitfalls that Kiro might neglect, so I was able to keep it on a good trajectory.

**Specific Achievements:**

✅ **40+ Technologies Integrated** - Successfully stitched together a chimera of incompatible parts  
✅ **10 External APIs** - 3 paid AI services + 7 free enhancement APIs working in harmony  
✅ **Real-time Generation** - WebSocket progress updates with parallel processing  
✅ **Cinematic Experience** - 3D book, synchronized audio, word-level highlighting  
✅ **Cost Tracking** - Complete admin dashboard for monitoring API usage  
✅ **Clean Architecture** - All components under 200 lines, well-organized, maintainable  
✅ **Comprehensive Documentation** - 15+ docs covering every aspect of the project  
✅ **Production Ready** - Error handling, rate limiting, configuration management  

---

## 🎓 What We Learned About Kiro

A lot about Kiro. I have used Cursor, Qodo, Tabnine, Claude Code, Github Copilot, and a few other tools in my time. This was definitely similar to Cursor in many ways, but there were a few things I really appreciated about this system over others I have tried.

### What Makes Kiro Special

**1. Steering Docs Are a Game-Changer**
I actually have developed my own crazy convoluted system in other tools to do essentially this, so having it configurable off the bat and so easy was a truly amazing experience. The ability to define coding standards, technology stack, and project structure in markdown files that Kiro automatically references is brilliant.

**2. Agent Hooks Are Clever and Novel**
The hooks were easy to set up and a clever idea to keep things going the right direction. Being able to trigger documentation updates, code quality checks, and build logging automatically saved hours of manual work.

**3. Specs Provide Structure for Complex Work**
Breaking down the refactoring into requirements → design → tasks gave Kiro a clear roadmap. It followed the task list methodically without getting lost or making mistakes.

**4. MCP Integration Is Powerful**
I have some basic MCPs I always use, but I was curious how well Kiro would do setting them up for me. Spoiler: three of them were crazy easy to set up and one of them was a nightmare because Kiro was CONVINCED that it knew how to configure it, except it didn't exist in the repo it tried to use.

We got there in the end, though. The Context7 MCP was essential for working with Spring AI's rapidly evolving API.

**5. Conversational Development Works**
The back-and-forth with Kiro felt natural. I could say "simplify this" or "fix that bug" and Kiro understood the context. When it made mistakes, I could correct it and it would learn.

### Comparison to Other Tools

| Feature | Kiro | Cursor | Copilot |
|---------|------|--------|---------|
| Steering Docs | ✅ Built-in | ❌ Manual | ❌ None |
| Agent Hooks | ✅ Yes | ❌ No | ❌ No |
| Specs | ✅ Yes | ❌ No | ❌ No |
| MCP Support | ✅ Yes | ❌ No | ❌ No |
| Conversational | ✅ Excellent | ✅ Good | ⚠️ Limited |
| Context Awareness | ✅ Excellent | ✅ Good | ⚠️ Limited |

---

## 🚀 What's Next for Frankenstein

So this was just a fun little project for me, but honestly I had so much fun with it and it came out so well that I am probably going to finish turning it into a real life tool people can use in the real world.

**Planned Features:**
- 📚 **Story Library** - Browse, filter, and manage saved stories
- 🎙️ **Voice Selection** - Choose from multiple narration voices
- 🎨 **Style Customization** - Select art styles (watercolor, cartoon, realistic)
- 🌍 **Multi-language Support** - Generate stories in different languages
- 👥 **User Accounts** - Save stories to personal library
- 💳 **Payment Integration** - Monetize with Stripe
- 📱 **Mobile App** - React Native version

It will probably be done fairly soon and live to use in the real world, or maybe it will disappear into the backlog of "I'll finish this later" projects I have sitting in repos over the years that I am too scared to look at now.

Either way, it was really fun to create.

---

## 🎯 Why This Project Deserves to Win

### Frankenstein Category
This project **perfectly embodies** the Frankenstein category by stitching together **40+ technologies** into one cohesive application:
- 3 AI services (Claude, Stability AI, ElevenLabs)
- 10 external APIs (3 paid + 7 free)
- 7 animation libraries (Framer Motion, GSAP, Three.js, etc.)
- Full-stack architecture (Spring Boot + React)
- Real-time communication (WebSocket)
- 3D graphics (Three.js)
- Audio processing (Howler.js)

### Best Startup Project
This has **real commercial potential**:
- Solves a real problem (creating engaging children's stories)
- Clear monetization path (subscription or pay-per-story)
- Scalable architecture with cost tracking
- Professional polish and user experience
- Ready for production deployment

### Implementation of Kiro
This project showcases **extensive use of all Kiro features**:
- ✅ **Vibe Coding**: 100+ conversational interactions building the entire project
- ✅ **Steering Docs**: 4 comprehensive guides (tech, structure, product, guidelines)
- ✅ **Agent Hooks**: 4 custom hooks (build logger, code quality, docs sync, validator)
- ✅ **Specs**: 3 detailed specs for complex features (refactoring, story library, voice selection)
- ✅ **MCP**: 3 servers (sequential-thinking, memory, context7) for enhanced capabilities

### Quality and Design
- 🎨 **Polished UI**: Spooky/magical theme with 3D book, particle effects, animations
- 🏗️ **Clean Architecture**: All components <200 lines, well-organized, maintainable
- 📚 **Comprehensive Docs**: 15+ documentation files covering every aspect
- 🧪 **Tested**: Unit tests, integration tests, E2E tests
- 🔒 **Production Ready**: Error handling, rate limiting, cost tracking, admin dashboard

---

## 📊 Project Statistics

- **Total Files**: 150+
- **Lines of Code**: 15,000+
- **Technologies**: 40+
- **External APIs**: 10
- **Kiro Steering Docs**: 4
- **Kiro Hooks**: 4
- **Kiro Specs**: 3
- **MCP Servers**: 3
- **Development Time**: 2 weeks
- **Cost per Story**: $0.40
- **Fun Factor**: 💯

---

## 🔗 Links

- **Repository**: [GitHub Link]
- **Live Demo**: [Demo Link]
- **Video Demo**: [YouTube Link]
- **Documentation**: See `README.md` and `kirodocs/` folder

---

**Built with ❤️ and Kiro for Kiroween 2025** 🎃👻

P.S. I wrote the basics of this entry description and then Kiro made it better. :)