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

   **Option 1: Using .env file (Recommended)**

   Copy the example file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   STABILITY_API_KEY=your-stability-api-key-here
   ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Optional
   STORAGE_ROOT=./storage  # Optional
   ```

   **Option 2: Using application-local.yml**

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
   mvn spring-boot:run
   ```

   The server will start on http://localhost:8083

**Note**: The backend uses a custom `DotenvConfig` class to automatically load environment variables from `.env` files. This configuration class:

- Implements `ApplicationContextInitializer` for early initialization
- Provides detailed logging of loaded variables
- Gracefully handles missing `.env` files
- Falls back to system environment variables
- Registered in `META-INF/spring.factories` for automatic discovery

This makes configuration simpler and more consistent with modern development practices.

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
│   ├── DotenvConfig     # .env file loader (ApplicationContextInitializer)
│   ├── HttpClientConfig # HTTP clients (OkHttp + RestClient with configurable timeouts)
│   ├── WebConfig        # CORS configuration
│   └── WebSocketConfig  # WebSocket setup
├── controller/          # REST controllers
│   ├── AssetController  # Serves images & audio
│   ├── StoryController  # Story CRUD operations
│   └── AdminController  # Admin dashboard API
├── exception/           # Custom exceptions & handlers
│   ├── GlobalExceptionHandler        # Centralized error handling
│   ├── StoryGenerationException      # Story creation failures
│   ├── ImageGenerationException      # Image generation failures
│   ├── AudioGenerationException      # Audio generation failures
│   ├── FileStorageException          # File I/O failures
│   ├── StoryNotFoundException        # Story not found
│   ├── ResourceNotFoundException     # Generic resource not found
│   └── ErrorResponse                 # Error response DTO
├── model/              # Domain models & DTOs
│   ├── orchestration/      # Orchestration-specific models
│   │   ├── AudioSet        # Audio generation results
│   │   └── GenerationContext # Generation context data
│   ├── Story
│   ├── StoryInput
│   ├── StoryPage
│   ├── StoryStructure
│   ├── ApiCallLog          # API tracking log entry
│   └── ApiConfiguration    # API cost configuration
└── service/            # Business logic
    ├── orchestration/      # Story generation orchestration
    │   ├── ImageOrchestrationService       # Interface
    │   ├── ImageOrchestrationServiceImpl   # Parallel image generation
    │   ├── AudioOrchestrationService       # Interface
    │   ├── AudioOrchestrationServiceImpl   # Batched audio generation
    │   ├── StoryAssemblyService            # Interface
    │   ├── StoryAssemblyServiceImpl        # Story assembly from assets
    │   ├── ProgressCoordinatorService      # Interface
    │   └── ProgressCoordinatorServiceImpl  # Progress notifications
    ├── tracking/           # API tracking and cost management
    │   ├── ApiTrackingFacade               # Unified tracking API
    │   ├── ApiConfigurationService         # Interface
    │   ├── ApiConfigurationServiceImpl     # Configuration management
    │   ├── ApiLogService                   # Interface
    │   ├── ApiLogServiceImpl               # Log file operations
    │   ├── ApiStatisticsService            # Interface
    │   ├── ApiStatisticsServiceImpl        # Usage statistics
    │   ├── CostCalculationService          # Interface
    │   └── CostCalculationServiceImpl      # Cost calculations
    ├── StoryOrchestrationService   # Main workflow coordinator (~80 lines)
    ├── StoryGenerationService      # Claude integration via Spring AI
    ├── ImageGenerationService      # Stability AI integration via Spring AI
    ├── AudioGenerationService      # ElevenLabs integration via RestClient
    ├── FileStorageService          # File management
    ├── ProgressNotificationService # WebSocket updates
    └── ApiTrackingService          # Legacy tracking service (deprecated)
```

## Service Architecture

This backend has been refactored to follow the Single Responsibility Principle and service-oriented architecture best practices:

### Design Principles

- **Single Responsibility**: Each service has one clear, focused purpose
- **Service Size**: All services under 150 lines (most under 100)
- **Interface-Based**: Services use interfaces for better testability and flexibility
- **Constructor Injection**: All dependencies injected via constructor (using @RequiredArgsConstructor)
- **Facade Pattern**: Complex subsystems exposed through simplified facades

### Service Organization

**Orchestration Services** (workflow coordination):
- **ImageOrchestrationService**: Manages parallel image generation for all story pages
- **AudioOrchestrationService**: Handles batched audio generation with throttling (max 3 concurrent)
- **StoryAssemblyService**: Combines generated assets into complete story with metadata
- **ProgressCoordinatorService**: Centralizes all progress notifications via WebSocket

**Tracking Services** (API cost monitoring):
- **ApiTrackingFacade**: Provides unified API for all tracking operations
- **ApiConfigurationService**: Manages API pricing configuration persistence
- **ApiLogService**: Handles log file CRUD operations
- **ApiStatisticsService**: Calculates aggregated usage statistics
- **CostCalculationService**: Computes costs for different API providers

### Example: Story Orchestration Refactoring

**Before** (197 lines):
- Mixed image generation, audio generation, story assembly, and progress notifications
- Complex async workflow with nested CompletableFutures
- Difficult to test and maintain

**After** (80 lines):
- Delegates to specialized orchestration services
- Maintains async workflow coordination
- Each service is focused and testable
- Clear separation of concerns

**Benefits**:
- Each service is focused and testable
- Easier to modify individual generation phases
- Better error handling and logging
- Improved code readability

### Dependency Injection Best Practices

All services use constructor-based dependency injection with Lombok's `@RequiredArgsConstructor`:

```java
@Service
@RequiredArgsConstructor
public class ImageOrchestrationServiceImpl implements ImageOrchestrationService {
    private final ImageGenerationService imageGenerationService;
    private final FileStorageService fileStorageService;
    private final ProgressCoordinatorService progressCoordinator;
    
    // Methods use injected dependencies
}
```

**Why Constructor Injection?**
- Makes dependencies explicit and required
- Enables immutability (final fields)
- Better for testing (no reflection needed)
- Prevents NullPointerException from missing dependencies
- Recommended by Spring team as best practice

**Never use @Autowired**: Field injection is discouraged in favor of constructor injection.

## Technology Stack

- **Spring Boot 3.5.0**: Application framework
- **Spring AI 1.0.0-M4**: AI service integration
    - Spring AI Anthropic (Claude integration)
    - Spring AI Stability AI (Stability AI image generation)
- **java-dotenv**: Environment variable loading from .env files
- **RestClient**: Spring's HTTP client (with custom timeout configuration)
- **Jackson**: JSON processing
- **Lombok**: Reduce boilerplate
- **WebSocket**: Real-time communication
- **SLF4J**: Logging framework

## HTTP Client Configuration

The backend configures HTTP clients with extended timeouts to handle long-running AI API requests:

- **Connect Timeout**: 30 seconds
- **Read Timeout**: 3 minutes (to accommodate AI generation time)
- **Write Timeout**: 30 seconds

These timeouts can be customized in `application.yml`:

```yaml
http:
  client:
    connect-timeout: 30s
    read-timeout: 3m
    write-timeout: 30s
```

The `HttpClientConfig` class provides:

- `RestClient.Builder` bean with configured timeouts for all HTTP calls
- `RestClientCustomizer` bean for Spring's RestClient with JDK HttpClient
- Configurable timeout properties via `HttpClientProperties` record

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

The backend supports multiple ways to configure environment variables:

1. **Using .env file** (Recommended - automatically loaded by DotenvConfig):
   ```bash
   # Create .env file in backend/ directory
   echo "ANTHROPIC_API_KEY=your-key" > .env
   echo "STABILITY_API_KEY=your-key" >> .env
   echo "ELEVENLABS_API_KEY=your-key" >> .env
   mvn spring-boot:run
   ```

   The `DotenvConfig` class will:
    - Load the `.env` file from the current directory
    - Log the number of variables loaded
    - Gracefully handle missing files with a warning
    - Make variables available to Spring's `@Value` and `${...}` property resolution

2. **Using system environment variables**:
   ```bash
   export ANTHROPIC_API_KEY=your-key
   export STABILITY_API_KEY=your-key
   export ELEVENLABS_API_KEY=your-key
   mvn spring-boot:run
   ```

3. **Using application-local.yml** (Spring profiles):
   ```bash
   # Create application-local.yml with your keys
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```

The `.env` approach is recommended as it's simpler and follows common development practices. The custom `DotenvConfig` implementation provides better
visibility into the loading process through detailed logging.

## Exception Handling

The backend uses a comprehensive exception handling strategy with custom exceptions for different failure scenarios:

- **FileStorageException**: Thrown when file I/O operations fail (reading, writing, or deleting story assets)
- **StoryGenerationException**: Thrown when Claude API fails to generate story content
- **ImageGenerationException**: Thrown when Stability AI fails to generate images
- **AudioGenerationException**: Thrown when ElevenLabs fails to generate audio
- **StoryNotFoundException**: Thrown when a requested story doesn't exist
- **ResourceNotFoundException**: Generic exception for missing resources

All exceptions are handled by `GlobalExceptionHandler` which returns consistent error responses to the frontend.

## Recent Changes

### Audio Generation Migration (Spring RestClient Integration)

The `AudioGenerationService` has been migrated from OkHttp to Spring's RestClient:

**Benefits**:

- Consistent HTTP client usage across all services
- Simplified code with Spring's fluent API
- Better integration with Spring's timeout configuration
- Reduced dependencies (removed OkHttp dependency)
- Improved error handling with `AudioGenerationException`

**Implementation Changes**:

- Uses `RestClient.Builder` for HTTP calls to ElevenLabs API
- Constructor injection with `@RequiredArgsConstructor` (follows best practices)
- Proper exception handling with custom `AudioGenerationException`
- Cleaner code with immutable `Map.of()` for request bodies

**API Compatibility**:

- The service interface remains unchanged
- `generateNarration(String text)` returns `CompletableFuture<byte[]>`
- `generateSoundEffect(String effectDescription)` returns `CompletableFuture<byte[]>`
- `estimateNarrationDuration(String text)` returns `double`

### Image Generation Migration (Spring AI Integration)

The `ImageGenerationService` has been migrated from direct OkHttp API calls to Spring AI's Stability AI integration:

**Benefits**:

- Simplified code with Spring AI abstractions
- Better error handling and retry logic
- Consistent configuration with other AI services
- Automatic base64 decoding of image responses

**Configuration Changes**:

- Now uses `spring.ai.stabilityai.*` configuration in `application.yml`
- Legacy `api.stability.*` configuration is kept for reference but not used
- Image generation options (width, height, cfg-scale, steps, style-preset) are now configured under `spring.ai.stabilityai.image.options`

**API Compatibility**:

- The service interface remains unchanged
- `generateImage(String prompt, int seed)` returns `CompletableFuture<byte[]>`
- `generateImageWithRetry(String prompt, int seed, int maxRetries)` provides retry logic with exponential backoff

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

If you encounter `FileStorageException`, check:

- Directory permissions
- Available disk space
- File path validity

## License

See LICENSE file in root directory.
