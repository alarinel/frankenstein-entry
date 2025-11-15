# Development Guidelines

## Code Style and Best Practices

### Dependency Injection

**NEVER use `@Autowired` annotation**. Always use constructor-based dependency injection with Lombok's `@RequiredArgsConstructor` or explicit all-args constructors.

**Why**:
- Constructor injection makes dependencies explicit and required
- Enables immutability (final fields)
- Better for testing (no reflection needed)
- Prevents NullPointerException from missing dependencies
- Recommended by Spring team as best practice

**Correct Pattern**:
```java
@Service
@RequiredArgsConstructor  // Lombok generates constructor for final fields
public class StoryOrchestrationService {
    private final StoryGenerationService storyGenerationService;
    private final ImageGenerationService imageGenerationService;
    private final FileStorageService fileStorageService;
    
    // Methods use injected dependencies
}
```

**Or without Lombok**:
```java
@Service
public class StoryOrchestrationService {
    private final StoryGenerationService storyGenerationService;
    private final ImageGenerationService imageGenerationService;
    
    public StoryOrchestrationService(
            StoryGenerationService storyGenerationService,
            ImageGenerationService imageGenerationService) {
        this.storyGenerationService = storyGenerationService;
        this.imageGenerationService = imageGenerationService;
    }
}
```

**AVOID**:
```java
@Service
public class BadService {
    @Autowired  // ❌ NEVER DO THIS
    private SomeDependency dependency;
}
```

### Author Attribution

All Java classes should include author information in JavaDoc:
```java
/**
 * Description of the class
 * 
 * @author alarinel@gmail.com
 */
```

## Third-Party Library Usage

**IMPORTANT**: When working with any third-party library, framework, or API, always fetch up-to-date documentation and implementation details before writing code.

### Why This Matters

- APIs and library interfaces change between versions
- Deprecated methods may exist in older examples
- Best practices evolve over time
- Breaking changes occur in major version updates

### Required Actions

Before implementing features using third-party libraries:

1. **Check Current Version**: Verify the exact version in `pom.xml` (backend) or `package.json` (frontend)
2. **Fetch Documentation**: Use available tools to retrieve current documentation for that specific version
3. **Verify API Signatures**: Confirm method names, parameters, and return types match the installed version
4. **Review Examples**: Look for official examples that match the version being used

### Libraries Requiring Special Attention

**Backend**:
- Spring AI (rapidly evolving, milestone releases)
- Anthropic Claude API (model names and parameters change)
- Stability AI API (endpoints and options vary)
- ElevenLabs API (voice IDs and settings)

**Frontend**:
- React Three Fiber (Three.js wrapper with frequent updates)
- Framer Motion (animation API changes)
- STOMP.js (WebSocket protocol specifics)
- Zustand (state management patterns)

### Example Workflow

```
1. User asks to add a new animation feature
2. Check package.json: "framer-motion": "^10.16.16"
3. Fetch Framer Motion v10 documentation
4. Review current API for the specific animation type
5. Implement using verified API signatures
6. Test the implementation
```

This approach prevents:
- Runtime errors from incorrect API usage
- Deprecated method warnings
- Incompatibility issues
- Wasted time debugging outdated code patterns

## Testing Strategy

### Backend Testing
- Unit tests for all services
- Integration tests for API endpoints
- Mock external API calls (Claude, Stability AI, ElevenLabs)
- Test both success and failure paths
- Edge case coverage

### Frontend Testing
- Component tests with React Testing Library
- E2E tests with Playwright
- Visual regression tests
- Accessibility testing

### Test Coverage Goals
- Backend: 90%+ coverage on services and controllers
- Frontend: 80%+ coverage on components and hooks
- Critical paths: 100% coverage

## Performance Considerations

1. **Parallel Processing**: Generate images and audio simultaneously
2. **Streaming**: Stream assets as they're generated
3. **Caching**: Cache generated stories
4. **Lazy Loading**: Load assets on-demand in frontend
5. **Optimization**: Compress images and audio appropriately

## API Cost Tracking

The application includes built-in API cost tracking and monitoring:

### ApiTrackingService

Tracks all API calls to external services (Anthropic, Stability AI, ElevenLabs) with:
- Token usage and character counts
- Cost calculations based on configurable pricing
- Success/failure status
- Duration metrics
- Per-story and aggregate statistics

### Configuration Management

API costs and rate limits are configurable via:
- `storage/api-config.json` - Persistent configuration file
- Admin API endpoints - Runtime updates
- Default values provided if config doesn't exist

### Best Practices

1. **Log All API Calls**: Use `ApiTrackingService.logApiCall()` after each external API interaction
2. **Calculate Costs**: Use helper methods like `calculateStoryGenerationCost()` for accurate pricing
3. **Monitor Usage**: Regularly review statistics via admin dashboard
4. **Clean Old Logs**: Implement periodic cleanup to manage storage
5. **Update Pricing**: Keep configuration current with provider pricing changes

### Example Usage

```java
@Service
@RequiredArgsConstructor
public class StoryGenerationService {
    private final ApiTrackingService apiTrackingService;
    
    public Story generateStory(StoryInput input) {
        long startTime = System.currentTimeMillis();
        
        try {
            // Make API call
            ChatResponse response = chatClient.call(prompt);
            
            // Track the call
            ApiCallLog log = ApiCallLog.builder()
                .storyId(storyId)
                .apiProvider("ANTHROPIC")
                .operation("STORY_GENERATION")
                .tokensUsed(response.getMetadata().getUsage().getTotalTokens())
                .costUsd(apiTrackingService.calculateStoryGenerationCost(
                    inputTokens, outputTokens))
                .status("SUCCESS")
                .durationMs(System.currentTimeMillis() - startTime)
                .build();
                
            apiTrackingService.logApiCall(log);
            
            return story;
        } catch (Exception e) {
            // Log failure
            apiTrackingService.logApiCall(ApiCallLog.builder()
                .status("FAILED")
                .errorMessage(e.getMessage())
                .build());
            throw e;
        }
    }
}
```

## Security Best Practices

1. **API Keys**: Store in environment variables, never commit
2. **Rate Limiting**: Prevent abuse of generation endpoint
3. **Input Validation**: Sanitize all user inputs
4. **File Storage**: Implement size limits
5. **CORS**: Configure properly for frontend origin
6. **Error Handling**: Never expose internal errors to frontend
7. **Admin Access**: Secure admin endpoints (consider authentication in production)
