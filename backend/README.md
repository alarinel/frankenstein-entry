# Frankenstein Story Generator - Backend

Spring Boot backend for the AI-powered children's story generator.

## Features

- **Story Generation**: Uses Claude (Anthropic) to create engaging children's stories
- **Image Generation**: Creates illustrations with Stability AI using consistent seeds
- **Audio Generation**: Generates narration and sound effects with ElevenLabs
- **Real-time Updates**: WebSocket support for progress tracking
- **File Storage**: Local filesystem-based asset storage
- **REST API**: Comprehensive API for frontend integration

## Prerequisites

- Java 21 or higher
- Maven 3.8+
- API Keys for:
  - Anthropic Claude
  - Stability AI
  - ElevenLabs

## Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Configure API keys**

   Copy the example configuration:
   ```bash
   cp src/main/resources/application-example.yml src/main/resources/application-local.yml
   ```

   Edit `application-local.yml` and add your API keys:
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

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```

   The server will start on http://localhost:8080

## API Endpoints

### Story Generation

**POST** `/api/stories/generate`
```json
{
  "characterName": "Luna",
  "setting": "A magical forest",
  "villain": "The Shadow King",
  "specialItem": "A glowing crystal",
  "characterTrait": "brave and curious",
  "goal": "Save the forest creatures",
  "timePeriod": "Medieval fantasy",
  "mood": "mysterious and adventurous"
}
```

Response:
```json
{
  "storyId": "uuid-here",
  "status": "PENDING",
  "message": "Story generation started"
}
```

### Get Story

**GET** `/api/stories/{storyId}`

Returns complete story with all pages and metadata.

### Get Story Status

**GET** `/api/stories/{storyId}/status`

Returns current generation status and progress.

### List All Stories

**GET** `/api/stories`

Returns all generated stories.

### WebSocket

Connect to: `/ws/story-progress`

Subscribe to: `/topic/story-progress/{storyId}`

Receives real-time progress updates during generation.

## Architecture

```
src/main/java/com/frankenstein/story/
├── config/              # Configuration classes
│   ├── AsyncConfig      # Async task execution
│   ├── HttpClientConfig # OkHttp client
│   ├── WebConfig        # CORS configuration
│   └── WebSocketConfig  # WebSocket setup
├── controller/          # REST controllers
│   ├── AssetController  # Serves images & audio
│   └── StoryController  # Story CRUD operations
├── exception/           # Custom exceptions & handlers
├── model/              # Domain models & DTOs
│   ├── Story
│   ├── StoryInput
│   ├── StoryPage
│   └── StoryStructure
└── service/            # Business logic
    ├── AudioGenerationService     # ElevenLabs integration
    ├── FileStorageService         # File management
    ├── ImageGenerationService     # Stability AI integration
    ├── ProgressNotificationService # WebSocket updates
    ├── StoryGenerationService     # Claude integration
    └── StoryOrchestrationService  # Workflow coordination
```

## Technology Stack

- **Spring Boot 3.2**: Application framework
- **Spring AI**: AI service integration
- **OkHttp**: HTTP client for external APIs
- **Jackson**: JSON processing
- **Lombok**: Reduce boilerplate
- **WebSocket**: Real-time communication

## Storage Structure

```
storage/
└── {story-id}/
    ├── story.json           # Story metadata
    ├── images/
    │   ├── page-1.png
    │   ├── page-2.png
    │   └── ...
    └── audio/
        ├── narration/
        │   ├── page-1.mp3
        │   └── ...
        └── effects/
            ├── thunder.mp3
            └── ...
```

## Development

### Running Tests

```bash
mvn test
```

### Building for Production

```bash
mvn clean package -DskipTests
java -jar target/story-generator-1.0.0-SNAPSHOT.jar --spring.profiles.active=production
```

### Environment Variables

Alternatively, you can set API keys via environment variables:

```bash
export ANTHROPIC_API_KEY=your-key
export STABILITY_API_KEY=your-key
export ELEVENLABS_API_KEY=your-key
mvn spring-boot:run
```

## Troubleshooting

### Out of Memory

Increase JVM heap size:
```bash
export MAVEN_OPTS="-Xmx2g"
mvn spring-boot:run
```

### API Rate Limits

If you hit API rate limits, the services include retry logic with exponential backoff.

### Storage Issues

Ensure the application has write permissions to the storage directory:
```bash
chmod -R 755 storage/
```

## License

See LICENSE file in root directory.
