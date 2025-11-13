# System Architecture - Frankenstein Story Generator

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                     (React TypeScript + Vite)                    │
│                                                                  │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐             │
│  │  Mad-Lib   │→ │   Loading   │→ │    Book      │             │
│  │   Input    │  │  Animation  │  │   Reader     │             │
│  └────────────┘  └─────────────┘  └──────────────┘             │
│                                                                  │
│  Features:                                                       │
│  • Spooky themed forms (Aceternity UI)                         │
│  • 3D book with page flips (Three.js + R3F)                    │
│  • Synchronized audio playback (Howler.js)                     │
│  • Cinematic animations (Framer Motion + GSAP)                 │
│  • Particle effects (tsParticles)                              │
└─────────────────────────────────────────────────────────────────┘
                              ↕ REST API + WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API LAYER                           │
│                   (Spring Boot + Spring MVC)                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              StoryController (REST)                     │    │
│  │  • POST /api/stories/generate                          │    │
│  │  • GET  /api/stories/{id}/status                       │    │
│  │  • GET  /api/stories/{id}                              │    │
│  │  • GET  /api/stories                                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │        StoryOrchestrationService (Coordinator)          │    │
│  │  • Coordinates AI service calls                        │    │
│  │  • Manages parallel processing                         │    │
│  │  • Tracks progress and sends updates                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Story      │  │    Image     │  │    Audio     │         │
│  │ Generation   │  │  Generation  │  │  Generation  │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  │  (Claude)    │  │ (Stability)  │  │ (ElevenLabs) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         ↓                  ↓                  ↓                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │          FileStorageService (Persistence)              │    │
│  │  • Saves metadata, images, audio                       │    │
│  │  • Manages directory structure                         │    │
│  │  • Retrieves assets                                    │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↕ External APIs
┌─────────────────────────────────────────────────────────────────┐
│                        AI SERVICES                               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Anthropic  │  │  Stability   │  │  ElevenLabs  │         │
│  │    Claude    │  │      AI      │  │     API      │         │
│  │   (Sonnet)   │  │  (Diffusion) │  │    (TTS)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Components

#### 1. Input Flow (`/input`)
```
InputPage
├── IntroAnimation (spooky entrance)
├── MadLibForm
│   ├── InputField (characterName)
│   ├── InputField (setting)
│   ├── InputField (villain)
│   ├── InputField (specialItem)
│   ├── InputField (characterTrait)
│   ├── InputField (goal)
│   ├── InputField (timePeriod)
│   └── InputField (mood)
├── SuggestionChips (for each field)
├── ParticleBackground (tsParticles)
└── SubmitButton (with animation)
```

**Technologies**:
- React Hook Form + Zod for validation
- Aceternity UI for inputs
- Framer Motion for transitions
- tsParticles for background

#### 2. Loading Flow (`/loading/:storyId`)
```
LoadingPage
├── BackgroundScene (Three.js)
│   ├── AmbientLighting
│   ├── BookParticles (flying books)
│   └── LightningEffects
├── ProgressDisplay
│   ├── StageIndicator ("Crafting story...", "Painting images...")
│   ├── ProgressBar (potion bottle style)
│   └── PercentageCounter
└── WebSocketClient (real-time updates)
```

**Technologies**:
- React Three Fiber for 3D scene
- WebSocket for real-time updates
- GSAP for orchestrated animations
- Lottie for micro-animations

#### 3. Reading Flow (`/read/:storyId`)
```
ReadingPage
├── BookContainer (3D book)
│   ├── LeftPage (Image)
│   │   └── GeneratedImage
│   └── RightPage (Text)
│       ├── StoryText
│       └── HighlightedWords (synced)
├── AudioController (Howler.js)
│   ├── NarrationTrack
│   ├── SoundEffectsTracks
│   └── BackgroundAmbience
├── PageControls
│   ├── NextButton
│   ├── PreviousButton
│   └── PageIndicator
├── AtmosphericBackground
│   ├── ParticleSystem (mood-based)
│   └── ColorGradients (dynamic)
└── PageFlipAnimation (Three.js)
```

**Technologies**:
- Three.js + R3F for 3D book
- Howler.js for audio
- Framer Motion for page turns
- GSAP for text highlighting
- tsParticles for atmosphere

#### 4. Completion Flow (`/complete/:storyId`)
```
CompletionPage
├── BookClosingAnimation
├── StoryMetadata
│   ├── Title
│   ├── Duration
│   └── CreatedDate
└── ActionButtons
    ├── ReadAgainButton
    └── NewStoryButton
```

**Technologies**:
- Framer Motion for book closing
- React Router for navigation

### Backend Services

#### 1. Story Orchestration Service
```java
@Service
public class StoryOrchestrationService {

    @Autowired StoryGenerationService storyGen;
    @Autowired ImageGenerationService imageGen;
    @Autowired AudioGenerationService audioGen;
    @Autowired FileStorageService storage;
    @Autowired WebSocketService websocket;

    public CompletableFuture<Story> generateStory(StoryInput input) {
        // 1. Generate story structure with Claude
        StoryStructure structure = storyGen.generateStory(input);

        // 2. Parallel asset generation
        CompletableFuture<List<Image>> images = imageGen.generateImages(
            structure.getImagePrompts(),
            structure.getSeed()
        );

        CompletableFuture<List<Audio>> audio = audioGen.generateAudio(
            structure.getPages()
        );

        // 3. Combine and save
        return CompletableFuture.allOf(images, audio)
            .thenApply(v -> assembleStory(structure, images.join(), audio.join()))
            .thenApply(storage::saveStory);
    }
}
```

#### 2. Story Generation Service (Claude)
```java
@Service
public class StoryGenerationService {

    @Autowired ChatClient chatClient; // Spring AI

    public StoryStructure generateStory(StoryInput input) {
        String prompt = buildPrompt(input);

        ChatResponse response = chatClient.call(
            new Prompt(prompt,
                ChatOptions.builder()
                    .model("claude-sonnet-4.5")
                    .temperature(0.8)
                    .build()
            )
        );

        return parseStoryStructure(response.getResult().getOutput().getContent());
    }

    private String buildPrompt(StoryInput input) {
        return """
            Generate a children's story with the following elements:
            - Character: %s
            - Setting: %s
            - Villain: %s
            - Special Item: %s
            - Trait: %s
            - Goal: %s
            - Time Period: %s
            - Mood: %s

            Create exactly 8 pages. For each page provide:
            1. Story text (2-3 sentences, child-friendly)
            2. Image prompt (detailed, for Stability AI)
            3. Sound effects needed (array of effect names)
            4. Mood/atmosphere

            Return as JSON with this structure:
            {
              "title": "Story Title",
              "imageSeed": <random number 1000-9999>,
              "pages": [...]
            }
            """.formatted(
                input.getCharacterName(),
                input.getSetting(),
                // ... etc
            );
    }
}
```

#### 3. Image Generation Service (Stability AI)
```java
@Service
public class ImageGenerationService {

    @Autowired RestTemplate restTemplate;
    @Value("${stability.api.key}") String apiKey;

    public CompletableFuture<List<byte[]>> generateImages(
        List<ImagePrompt> prompts,
        int seed
    ) {
        return CompletableFuture.supplyAsync(() ->
            prompts.parallelStream()
                .map(prompt -> generateImage(prompt, seed))
                .collect(Collectors.toList())
        );
    }

    private byte[] generateImage(ImagePrompt prompt, int seed) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> body = Map.of(
            "prompt", prompt.getText(),
            "seed", seed,
            "width", 1024,
            "height", 768,
            "style_preset", "fantasy-art"
        );

        ResponseEntity<byte[]> response = restTemplate.postForEntity(
            "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
            new HttpEntity<>(body, headers),
            byte[].class
        );

        return response.getBody();
    }
}
```

#### 4. Audio Generation Service (ElevenLabs)
```java
@Service
public class AudioGenerationService {

    @Autowired RestTemplate restTemplate;
    @Value("${elevenlabs.api.key}") String apiKey;

    public CompletableFuture<List<AudioAssets>> generateAudio(List<StoryPage> pages) {
        return CompletableFuture.supplyAsync(() ->
            pages.parallelStream()
                .map(this::generatePageAudio)
                .collect(Collectors.toList())
        );
    }

    private AudioAssets generatePageAudio(StoryPage page) {
        // Generate narration
        byte[] narration = generateTTS(page.getText());

        // Generate sound effects
        List<byte[]> effects = page.getSoundEffects().stream()
            .map(this::generateSoundEffect)
            .collect(Collectors.toList());

        return new AudioAssets(narration, effects);
    }

    private byte[] generateTTS(String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("xi-api-key", apiKey);

        Map<String, Object> body = Map.of(
            "text", text,
            "voice_settings", Map.of(
                "stability", 0.5,
                "similarity_boost", 0.75
            )
        );

        ResponseEntity<byte[]> response = restTemplate.postForEntity(
            "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
            new HttpEntity<>(body, headers),
            byte[].class
        );

        return response.getBody();
    }
}
```

#### 5. File Storage Service
```java
@Service
public class FileStorageService {

    @Value("${storage.root}") Path storageRoot;

    public Story saveStory(Story story) {
        Path storyDir = storageRoot.resolve(story.getId());
        Files.createDirectories(storyDir);

        // Save metadata
        saveMetadata(story, storyDir.resolve("metadata.json"));

        // Save images
        Path imagesDir = storyDir.resolve("images");
        Files.createDirectories(imagesDir);
        story.getPages().forEach(page ->
            saveImage(page.getImage(), imagesDir.resolve("page-" + page.getNumber() + ".png"))
        );

        // Save audio
        Path audioDir = storyDir.resolve("audio");
        Files.createDirectories(audioDir);
        story.getPages().forEach(page -> {
            saveAudio(page.getNarration(), audioDir.resolve("narration/page-" + page.getNumber() + ".mp3"));
            // Save sound effects...
        });

        return story;
    }
}
```

## Data Flow

### Story Generation Flow

```
1. User submits StoryInput
   ↓
2. Backend validates input
   ↓
3. Create Story record (status: PENDING)
   ↓
4. Return storyId to frontend immediately
   ↓
5. Frontend navigates to /loading/{storyId}
   ↓
6. Frontend opens WebSocket connection
   ↓
7. Backend: Call Claude API
   ├─ Send progress: "Crafting your magical story..."
   ├─ Parse response into StoryStructure
   └─ Send progress: "Story complete! Creating illustrations..."
   ↓
8. Backend: Parallel processing
   ├─ Thread 1: Generate images (Stability AI)
   │   ├─ For each page, use same seed
   │   ├─ Send progress per image: "Painting page X..."
   │   └─ Save images to filesystem
   │
   └─ Thread 2: Generate audio (ElevenLabs)
       ├─ For each page, generate narration
       ├─ For each effect, generate audio
       ├─ Send progress: "Recording narration for page X..."
       └─ Save audio to filesystem
   ↓
9. Backend: Wait for all parallel tasks
   ↓
10. Backend: Assemble complete Story object
    ├─ Combine metadata, images, audio
    ├─ Save story.json
    └─ Update status: COMPLETED
    ↓
11. Backend: Send final progress: "Your story is ready!"
    ↓
12. Frontend: Automatically navigate to /read/{storyId}
```

### Reading Flow

```
1. Frontend fetches Story from /api/stories/{id}
   ↓
2. Preload all assets
   ├─ Images: Create <img> elements
   ├─ Audio: Load into Howler.js
   └─ Wait for all to load
   ↓
3. Initialize 3D book scene
   ├─ Create book geometry
   ├─ Apply first page textures
   └─ Set up camera
   ↓
4. Start playback
   ├─ Play narration for page 1
   ├─ Highlight text synchronized with audio
   └─ Trigger sound effects at specific times
   ↓
5. On audio end
   ├─ Wait 2 seconds
   ├─ Trigger page flip animation
   ├─ Load next page content
   └─ Start next page audio
   ↓
6. Repeat until last page
   ↓
7. Navigate to /complete/{storyId}
```

## Performance Optimizations

1. **Parallel AI Calls**: Images and audio generated simultaneously
2. **Streaming Assets**: Send assets to frontend as they're ready
3. **WebSocket Updates**: Real-time progress without polling
4. **Lazy Loading**: Load only current + next page assets
5. **Caching**: Cache generated stories
6. **Compression**: Compress images and audio
7. **CDN-Ready**: Structure for future CDN integration

## Security Considerations

1. **API Keys**: Stored in environment variables
2. **Input Validation**: Sanitize all user inputs
3. **Rate Limiting**: Prevent abuse (max 5 stories per IP per hour)
4. **File Size Limits**: Max 10MB per story
5. **CORS**: Configure for specific frontend origin
6. **Error Handling**: Never expose internal errors to frontend

## Scalability Path

Current: Single server, file storage
Future:
1. **Database**: PostgreSQL for metadata
2. **Object Storage**: S3 for assets
3. **Message Queue**: RabbitMQ for async processing
4. **Caching**: Redis for story data
5. **Load Balancer**: Multiple backend instances
6. **CDN**: CloudFront for asset delivery
7. **Containerization**: Docker + Kubernetes

This architecture creates a truly magical, movie-like experience by orchestrating multiple AI services and advanced frontend technologies into one cohesive chimera!
