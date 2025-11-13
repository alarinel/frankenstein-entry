# Design Document

## Overview

This design document outlines the architectural approach for refactoring the Frankenstein Story Generator codebase. The refactoring will transform monolithic components and services into smaller, focused units that adhere to the Single Responsibility Principle while maintaining all existing functionality. The design emphasizes component composition, clear separation of concerns, and improved testability.

## Architecture

### Frontend Architecture

The frontend refactoring follows a layered component architecture:

```
Pages (Route Components)
    ↓
Feature Components (Domain-specific)
    ↓
Shared Components (Reusable UI)
    ↓
Hooks (Logic Layer)
    ↓
Stores & API (Data Layer)
```

**Key Principles:**
- Pages orchestrate feature components but contain minimal logic
- Feature components handle domain-specific UI and behavior
- Shared components provide reusable UI primitives
- Hooks encapsulate complex logic and side effects
- Stores manage global state

### Backend Architecture

The backend refactoring follows a service-oriented architecture with clear separation of concerns:

```
Controllers (HTTP Layer)
    ↓
Orchestration Services (Workflow Coordination)
    ↓
Domain Services (Business Logic)
    ↓
Utility Services (Cross-cutting Concerns)
    ↓
Repositories/Storage (Data Layer)
```

**Key Principles:**
- Controllers delegate to orchestration services
- Orchestration services coordinate multiple domain services
- Domain services focus on single business capabilities
- Utility services provide reusable functionality
- Constructor injection for all dependencies

## Components and Interfaces

### Frontend Component Breakdown

#### 1. InputPage Refactoring

**Current State:** 423 lines with mixed responsibilities

**New Structure:**

```typescript
// pages/InputPage.tsx (~100 lines)
// - Orchestrates form flow
// - Manages step navigation
// - Handles form submission

// components/forms/StoryFormField.tsx (~60 lines)
interface StoryFormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  emoji: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onNext: () => void;
  autoFocus?: boolean;
}

// components/forms/FormProgressIndicator.tsx (~80 lines)
interface FormProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  fields: FormField[];
  values: Record<string, string>;
  onStepClick: (step: number) => void;
}

// components/forms/SuggestionChips.tsx (~50 lines)
interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSelect: (value: string) => void;
}

// components/forms/FormNavigation.tsx (~40 lines)
interface FormNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onRandomize: () => void;
}

// hooks/useStoryFormState.ts (~80 lines)
interface UseStoryFormStateReturn {
  currentStep: number;
  currentField: FormField;
  isLastStep: boolean;
  handleNext: () => void;
  handleBack: () => void;
  jumpToStep: (step: number) => void;
  handleRandomize: () => void;
}
```

#### 2. ReadingPage Refactoring

**Current State:** 361 lines with mixed audio, navigation, and display logic

**New Structure:**

```typescript
// pages/ReadingPage.tsx (~120 lines)
// - Orchestrates reading experience
// - Manages page state
// - Coordinates audio and navigation

// components/reading/PlaybackControls.tsx (~60 lines)
interface PlaybackControlsProps {
  isPlaying: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFlipping: boolean;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

// components/reading/AudioProgressDisplay.tsx (~50 lines)
interface AudioProgressDisplayProps {
  progress: number;
  isPlaying: boolean;
  isCountingDown: boolean;
  countdown: number;
}

// components/reading/TextHighlightDisplay.tsx (~70 lines)
interface TextHighlightDisplayProps {
  words: string[];
  highlightedWords: Set<number>;
  textPosition: 'left' | 'right' | 'hidden';
}

// components/reading/PageNavigationButtons.tsx (~40 lines)
interface PageNavigationButtonsProps {
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFlipping: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

// components/reading/PlayPromptOverlay.tsx (~60 lines)
interface PlayPromptOverlayProps {
  show: boolean;
  onStart: () => void;
}

// hooks/useCountdownTimer.ts (~40 lines)
interface UseCountdownTimerReturn {
  countdown: number;
  isCountingDown: boolean;
  startCountdown: (duration: number, onComplete: () => void) => void;
  clearCountdown: () => void;
}
```

#### 3. AdminPage Refactoring

**Current State:** 293 lines with statistics, configuration, and logs management

**New Structure:**

```typescript
// pages/AdminPage.tsx (~80 lines)
// - Orchestrates admin dashboard
// - Manages data loading
// - Coordinates sub-components

// components/admin/StatisticsCards.tsx (~60 lines)
interface StatisticsCardsProps {
  statistics: Statistics;
}

// components/admin/ConfigurationEditor.tsx (~100 lines)
interface ConfigurationEditorProps {
  configuration: ApiConfiguration;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (config: ApiConfiguration) => void;
  onCancel: () => void;
}

// components/admin/LogsTable.tsx (~80 lines)
interface LogsTableProps {
  logs: ApiCallLog[];
  onDeleteLog: (logId: string) => void;
}

// components/admin/LogsActions.tsx (~40 lines)
interface LogsActionsProps {
  totalLogs: number;
  onDeleteOldLogs: (days: number) => void;
}

// hooks/useAdminData.ts (~60 lines)
interface UseAdminDataReturn {
  logs: ApiCallLog[];
  statistics: Statistics | null;
  configuration: ApiConfiguration | null;
  loading: boolean;
  refresh: () => Promise<void>;
}
```

### Backend Service Breakdown

#### 1. StoryOrchestrationService Refactoring

**Current State:** 197 lines with orchestration, image generation, audio generation, and assembly

**New Structure:**

```java
// service/orchestration/StoryOrchestrationService.java (~80 lines)
// - Coordinates overall workflow
// - Manages story lifecycle
// - Delegates to specialized services

// service/orchestration/ImageOrchestrationService.java (~60 lines)
public interface ImageOrchestrationService {
    CompletableFuture<List<byte[]>> generateAllImages(
        String storyId, 
        StoryStructure structure
    );
}

// service/orchestration/AudioOrchestrationService.java (~80 lines)
public interface AudioOrchestrationService {
    CompletableFuture<List<AudioSet>> generateAllAudio(
        String storyId, 
        StoryStructure structure
    );
}

// service/orchestration/StoryAssemblyService.java (~70 lines)
public interface StoryAssemblyService {
    void assembleStory(
        Story story, 
        StoryStructure structure, 
        List<byte[]> images, 
        List<AudioSet> audioSets
    );
}

// service/orchestration/ProgressCoordinatorService.java (~50 lines)
public interface ProgressCoordinatorService {
    void notifyStoryProgress(String storyId, StoryStatus status);
    void notifyImageProgress(String storyId, int current, int total);
    void notifyAudioProgress(String storyId, int current, int total);
}
```

#### 2. ApiTrackingService Refactoring

**Current State:** 193 lines with configuration, logging, statistics, and cost calculation

**New Structure:**

```java
// service/tracking/ApiTrackingFacade.java (~60 lines)
// - Provides unified API for tracking operations
// - Delegates to specialized services

// service/tracking/ApiConfigurationService.java (~50 lines)
public interface ApiConfigurationService {
    ApiConfiguration getConfiguration();
    void updateConfiguration(ApiConfiguration config);
    void loadConfiguration();
    void saveConfiguration();
}

// service/tracking/ApiLogService.java (~60 lines)
public interface ApiLogService {
    void logApiCall(ApiCallLog callLog);
    List<ApiCallLog> getAllLogs();
    List<ApiCallLog> getLogsByStoryId(String storyId);
    void deleteLog(String logId);
    void deleteOldLogs(int daysOld);
}

// service/tracking/ApiStatisticsService.java (~70 lines)
public interface ApiStatisticsService {
    Map<String, Object> calculateStatistics(List<ApiCallLog> logs);
    Map<String, Long> getCallsByProvider(List<ApiCallLog> logs);
    Map<String, Double> getCostByProvider(List<ApiCallLog> logs);
    double getSuccessRate(List<ApiCallLog> logs);
}

// service/tracking/CostCalculationService.java (~40 lines)
public interface CostCalculationService {
    double calculateStoryGenerationCost(int inputTokens, int outputTokens);
    double calculateImageGenerationCost(int imageCount);
    double calculateAudioGenerationCost(int characterCount);
}
```

## Data Models

### Frontend Data Models

```typescript
// types/forms.ts
export interface FormField {
  name: keyof StoryFormData;
  label: string;
  placeholder: string;
  suggestions: Suggestion[];
  emoji: string;
}

export interface Suggestion {
  label: string;
  value: string;
}

// types/reading.ts
export interface ReadingState {
  currentPage: number;
  isPlaying: boolean;
  isFlipping: boolean;
  textPosition: 'left' | 'right' | 'hidden';
  audioProgress: number;
}

// types/admin.ts
export interface AdminState {
  logs: ApiCallLog[];
  statistics: Statistics | null;
  configuration: ApiConfiguration | null;
  loading: boolean;
}
```

### Backend Data Models

```java
// model/orchestration/AudioSet.java
@Data
@Builder
public class AudioSet {
    private byte[] narration;
    private List<byte[]> effects;
    private double duration;
}

// model/orchestration/GenerationContext.java
@Data
@Builder
public class GenerationContext {
    private String storyId;
    private StoryStructure structure;
    private Story story;
}
```

## Error Handling

### Frontend Error Handling

**Component-Level Error Boundaries:**
- Each major feature component wrapped in ErrorBoundary
- Graceful degradation for non-critical components
- Toast notifications for user-facing errors

**Hook-Level Error Handling:**
- Custom hooks return error states
- Consistent error object structure
- Automatic retry logic for transient failures

```typescript
interface HookError {
  message: string;
  code?: string;
  retry?: () => void;
}

interface HookReturn<T> {
  data: T | null;
  loading: boolean;
  error: HookError | null;
}
```

### Backend Error Handling

**Service-Level Exception Handling:**
- Each service throws domain-specific exceptions
- Orchestration services catch and transform exceptions
- Global exception handler provides consistent API responses

**Retry Logic:**
- Configurable retry for external API calls
- Exponential backoff for rate-limited services
- Circuit breaker pattern for failing services

```java
@Service
public class RetryableService {
    @Retryable(
        value = {TransientException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public Result performOperation() {
        // Implementation
    }
}
```

## Testing Strategy

### Frontend Testing

**Component Testing:**
- Unit tests for all extracted components
- Test component props and callbacks
- Test component rendering and interactions
- Mock external dependencies (hooks, stores)

**Hook Testing:**
- Unit tests for custom hooks using @testing-library/react-hooks
- Test hook state management
- Test hook side effects
- Mock external dependencies (API calls, stores)

**Integration Testing:**
- Test page components with real sub-components
- Test component composition
- Test data flow between components

```typescript
// Example component test
describe('StoryFormField', () => {
  it('should call onNext when Enter is pressed', () => {
    const onNext = jest.fn();
    render(<StoryFormField {...props} onNext={onNext} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyPress(input, { key: 'Enter' });
    
    expect(onNext).toHaveBeenCalled();
  });
});
```

### Backend Testing

**Service Testing:**
- Unit tests for all service methods
- Mock dependencies using Mockito
- Test success and failure paths
- Test async operations

**Integration Testing:**
- Test service composition
- Test orchestration workflows
- Test with real Spring context
- Mock external APIs

```java
// Example service test
@ExtendWith(MockitoExtension.class)
class ImageOrchestrationServiceTest {
    @Mock
    private ImageGenerationService imageService;
    
    @InjectMocks
    private ImageOrchestrationServiceImpl orchestrationService;
    
    @Test
    void shouldGenerateAllImagesInParallel() {
        // Test implementation
    }
}
```

## Performance Considerations

### Frontend Performance

**Code Splitting:**
- Lazy load page components
- Lazy load heavy feature components
- Dynamic imports for large libraries

**Memoization:**
- Use React.memo for expensive components
- Use useMemo for expensive calculations
- Use useCallback for stable function references

**Bundle Optimization:**
- Tree-shaking for unused code
- Separate vendor bundles
- Optimize asset loading

```typescript
// Lazy loading example
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ReadingPage = lazy(() => import('./pages/ReadingPage'));
```

### Backend Performance

**Parallel Processing:**
- Maintain parallel image generation
- Maintain batched audio generation
- Use CompletableFuture for async operations

**Resource Management:**
- Connection pooling for HTTP clients
- Thread pool configuration for async tasks
- Memory-efficient file handling

**Caching:**
- Cache story metadata
- Cache configuration
- Cache frequently accessed data

## Migration Strategy

### Phase 1: Frontend Forms (Week 1)
1. Extract InputPage form components
2. Create form-related hooks
3. Update tests
4. Verify functionality

### Phase 2: Frontend Reading (Week 1)
1. Extract ReadingPage components
2. Create reading-related hooks
3. Update tests
4. Verify functionality

### Phase 3: Frontend Admin (Week 1)
1. Extract AdminPage components
2. Create admin-related hooks
3. Update tests
4. Verify functionality

### Phase 4: Backend Orchestration (Week 2)
1. Extract orchestration services
2. Update dependency injection
3. Update tests
4. Verify functionality

### Phase 5: Backend Tracking (Week 2)
1. Extract tracking services
2. Update dependency injection
3. Update tests
4. Verify functionality

### Phase 6: Shared Components (Week 2)
1. Identify common patterns
2. Extract shared components
3. Update imports across codebase
4. Update tests

### Phase 7: Cleanup and Documentation (Week 3)
1. Remove unused code
2. Update documentation
3. Optimize imports
4. Final testing

## File Organization

### Frontend Structure

```
frontend/src/
├── pages/
│   ├── InputPage.tsx (refactored, ~100 lines)
│   ├── ReadingPage.tsx (refactored, ~120 lines)
│   ├── AdminPage.tsx (refactored, ~80 lines)
│   ├── CompletionPage.tsx (refactored, ~100 lines)
│   └── LoadingPage.tsx (existing)
├── components/
│   ├── forms/
│   │   ├── StoryFormField.tsx
│   │   ├── FormProgressIndicator.tsx
│   │   ├── SuggestionChips.tsx
│   │   ├── FormNavigation.tsx
│   │   └── index.ts
│   ├── reading/
│   │   ├── PlaybackControls.tsx
│   │   ├── AudioProgressDisplay.tsx
│   │   ├── TextHighlightDisplay.tsx
│   │   ├── PageNavigationButtons.tsx
│   │   ├── PlayPromptOverlay.tsx
│   │   └── index.ts
│   ├── admin/
│   │   ├── StatisticsCards.tsx
│   │   ├── ConfigurationEditor.tsx
│   │   ├── LogsTable.tsx
│   │   ├── LogsActions.tsx
│   │   └── index.ts
│   ├── shared/
│   │   ├── buttons/
│   │   ├── cards/
│   │   ├── overlays/
│   │   └── indicators/
│   └── spooky/ (existing)
├── hooks/
│   ├── forms/
│   │   ├── useStoryFormState.ts
│   │   └── index.ts
│   ├── reading/
│   │   ├── useCountdownTimer.ts
│   │   └── index.ts
│   ├── admin/
│   │   ├── useAdminData.ts
│   │   └── index.ts
│   └── shared/
│       ├── useKeyboardNavigation.ts
│       └── index.ts
└── types/
    ├── forms.ts
    ├── reading.ts
    └── admin.ts
```

### Backend Structure

```
backend/src/main/java/com/frankenstein/story/
├── service/
│   ├── orchestration/
│   │   ├── StoryOrchestrationService.java (refactored, ~80 lines)
│   │   ├── ImageOrchestrationService.java
│   │   ├── ImageOrchestrationServiceImpl.java
│   │   ├── AudioOrchestrationService.java
│   │   ├── AudioOrchestrationServiceImpl.java
│   │   ├── StoryAssemblyService.java
│   │   ├── StoryAssemblyServiceImpl.java
│   │   ├── ProgressCoordinatorService.java
│   │   └── ProgressCoordinatorServiceImpl.java
│   ├── tracking/
│   │   ├── ApiTrackingFacade.java (refactored, ~60 lines)
│   │   ├── ApiConfigurationService.java
│   │   ├── ApiConfigurationServiceImpl.java
│   │   ├── ApiLogService.java
│   │   ├── ApiLogServiceImpl.java
│   │   ├── ApiStatisticsService.java
│   │   ├── ApiStatisticsServiceImpl.java
│   │   ├── CostCalculationService.java
│   │   └── CostCalculationServiceImpl.java
│   ├── StoryGenerationService.java (existing)
│   ├── ImageGenerationService.java (existing)
│   ├── AudioGenerationService.java (existing)
│   ├── FileStorageService.java (existing)
│   └── ProgressNotificationService.java (existing)
└── model/
    └── orchestration/
        ├── AudioSet.java
        └── GenerationContext.java
```

## Design Decisions and Rationales

### Decision 1: Component Composition Over Inheritance
**Rationale:** React favors composition, making code more flexible and reusable. Small, focused components can be combined in different ways.

### Decision 2: Service Interfaces for Backend
**Rationale:** Interfaces provide clear contracts, enable easier testing with mocks, and support future implementation changes.

### Decision 3: Facade Pattern for Tracking
**Rationale:** ApiTrackingFacade provides a simple interface while hiding the complexity of multiple specialized services.

### Decision 4: Custom Hooks for Logic Extraction
**Rationale:** Hooks encapsulate complex logic, making components cleaner and logic more testable and reusable.

### Decision 5: Feature-Based Organization
**Rationale:** Grouping related components by feature (forms, reading, admin) makes the codebase more navigable and maintainable.

### Decision 6: Barrel Exports (index.ts)
**Rationale:** Index files simplify imports and provide a clear public API for each module.

### Decision 7: Maintain Existing Async Patterns
**Rationale:** Current CompletableFuture usage works well for parallel processing; no need to change working patterns.

### Decision 8: Progressive Refactoring
**Rationale:** Phased approach allows testing and validation at each step, reducing risk of breaking changes.
