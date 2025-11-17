# Design Document

## Overview

The Story Library Management feature extends the Frankenstein application with persistent story indexing and management capabilities. This design introduces a lightweight story index file (`story-index.json`) that maintains a catalog of all generated stories, new backend APIs for story retrieval and deletion, and a modal-based UI for browsing and managing the story collection.

The implementation follows the existing architecture patterns: service-layer business logic, RESTful API design, file-based storage, and React component composition with Zustand state management.

## Architecture

### High-Level Flow

```
Story Generation → Index Update → Storage
                                    ↓
User Opens Library → API Request → Index Read → Display
                                    ↓
User Deletes Story → API Request → Index Update + File Deletion
```

### Component Interaction

```
┌─────────────────┐
│  InputPage      │
│  (Library Btn)  │
└────────┬────────┘
         │ opens
         ↓
┌─────────────────┐      ┌──────────────────┐
│ LibraryModal    │─────→│ StoryController  │
│                 │←─────│ (REST API)       │
└─────────────────┘      └────────┬─────────┘
         │                        │
         │ navigate               │ uses
         ↓                        ↓
┌─────────────────┐      ┌──────────────────┐
│  ReadingPage    │      │ StoryIndexService│
│                 │      │                  │
└─────────────────┘      └────────┬─────────┘
                                  │ manages
                                  ↓
                         ┌──────────────────┐
                         │ story-index.json │
                         │ (Persistent)     │
                         └──────────────────┘
```

## Components and Interfaces

### Backend Components

#### 1. StoryIndexService

**Purpose**: Manages the story index file with thread-safe operations

**Location**: `backend/src/main/java/com/frankenstein/story/service/StoryIndexService.java`

**Dependencies**:
- `ObjectMapper` (Jackson) - JSON serialization
- `@Value("${storage.root}")` - Storage root path

**Key Methods**:

```java
public class StoryIndexService {
    // Add a new story to the index
    public void addStoryToIndex(String storyId, String title, LocalDateTime createdAt);
    
    // Remove a story from the index
    public void removeStoryFromIndex(String storyId);
    
    // Get all stories from the index
    public List<StoryIndexEntry> getAllStories();
    
    // Check if a story exists in the index
    public boolean storyExists(String storyId);
    
    // Internal: Load index from file
    private List<StoryIndexEntry> loadIndex();
    
    // Internal: Save index to file (atomic write)
    private void saveIndex(List<StoryIndexEntry> entries);
}
```

**Thread Safety**: Uses `synchronized` methods to prevent concurrent modification issues during parallel story generation.

**File Location**: `storage/story-index.json`

**File Format**:
```json
[
  {
    "id": "uuid-string",
    "title": "Story Title",
    "createdAt": "2025-11-17T10:30:00"
  }
]
```

#### 2. StoryIndexEntry Model

**Purpose**: Data model for story index entries

**Location**: `backend/src/main/java/com/frankenstein/story/model/StoryIndexEntry.java`

**Fields**:
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryIndexEntry {
    private String id;
    private String title;
    private LocalDateTime createdAt;
}
```

#### 3. StoryController Updates

**Purpose**: Add new endpoints for story list and deletion

**New Endpoints**:

```java
// GET /api/stories/list
// Returns: List<StoryIndexEntry>
// Description: Retrieves all stories from the index (sorted by date desc)
@GetMapping("/list")
public ResponseEntity<List<StoryIndexEntry>> getStoryList();

// DELETE /api/stories/{storyId}
// Returns: DeleteStoryResponse
// Description: Deletes story from index and filesystem
@DeleteMapping("/{storyId}")
public ResponseEntity<DeleteStoryResponse> deleteStory(@PathVariable String storyId);
```

**Response Models**:
```java
@Data
@Builder
public class DeleteStoryResponse {
    private boolean success;
    private String message;
    private String storyId;
}
```

#### 4. StoryOrchestrationService Updates

**Purpose**: Integrate index updates into story generation flow

**Changes**:
- Inject `StoryIndexService` via constructor
- After successful story generation, call `addStoryToIndex()`
- Add method: `deleteStoryWithAssets(String storyId)`

**Integration Point**:
```java
// In generateStoryAsync() after story completion
storyIndexService.addStoryToIndex(
    story.getId(), 
    story.getTitle(), 
    story.getCreatedAt()
);
```

#### 5. FileStorageService Updates

**Purpose**: Enhance deletion capabilities

**Changes**:
- Existing `deleteStory()` method already handles directory deletion
- No changes needed - already supports full story deletion

### Frontend Components

#### 1. LibraryModal Component

**Purpose**: Modal overlay displaying story library with management actions

**Location**: `frontend/src/components/LibraryModal.tsx`

**Props**:
```typescript
interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**State Management**:
```typescript
const [stories, setStories] = useState<StoryIndexEntry[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
```

**Key Features**:
- Fetches story list on mount using `useEffect`
- Displays stories in a scrollable list (max-height with overflow)
- Each story shows: title, creation date, Play button, Delete button
- Confirmation dialog for deletion (inline or separate modal)
- Admin link at the top
- Close button (X icon in top-right)
- Loading state with spinner
- Error state with retry option
- Empty state message when no stories exist

**Styling**:
- Dark theme matching existing spooky aesthetic
- Semi-transparent backdrop (backdrop-blur)
- Positioned as centered overlay (fixed positioning)
- Responsive width (max-w-2xl)
- Smooth animations (Framer Motion)

**Layout Structure**:
```
┌─────────────────────────────────┐
│ Library Modal          [X]      │
│ ─────────────────────────────── │
│ [Admin Dashboard →]             │
│ ─────────────────────────────── │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Story Title 1               │ │
│ │ Created: Nov 17, 2025       │ │
│ │ [Play] [Delete]             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Story Title 2               │ │
│ │ Created: Nov 16, 2025       │ │
│ │ [Play] [Delete]             │ │
│ └─────────────────────────────┘ │
│                                 │
│ (scrollable list...)            │
└─────────────────────────────────┘
```

#### 2. StoryIndexEntry Type

**Purpose**: TypeScript interface matching backend model

**Location**: `frontend/src/types/index.ts`

```typescript
export interface StoryIndexEntry {
  id: string;
  title: string;
  createdAt: string; // ISO 8601 format
}
```

#### 3. API Client Updates

**Purpose**: Add methods for new endpoints

**Location**: `frontend/src/api/client.ts`

**New Methods**:
```typescript
// Fetch all stories from index
export const getStoryList = async (): Promise<StoryIndexEntry[]> => {
  const response = await apiClient.get('/stories/list');
  return response.data;
};

// Delete a story
export const deleteStory = async (storyId: string): Promise<void> => {
  await apiClient.delete(`/stories/${storyId}`);
};
```

#### 4. InputPage Updates

**Purpose**: Add library button and modal integration

**Changes**:
- Add state: `const [libraryOpen, setLibraryOpen] = useState(false)`
- Add button in top-left corner (absolute positioning)
- Render `<LibraryModal isOpen={libraryOpen} onClose={() => setLibraryOpen(false)} />`

**Button Styling**:
- Icon: Book or Library icon (from lucide-react or similar)
- Position: `absolute top-4 left-4`
- Styled as `SpookyButton` variant
- Tooltip: "Story Library"

## Data Models

### StoryIndexEntry (Backend)

```java
public class StoryIndexEntry {
    private String id;           // UUID of the story
    private String title;        // Story title from generation
    private LocalDateTime createdAt;  // Timestamp of creation
}
```

### StoryIndexEntry (Frontend)

```typescript
interface StoryIndexEntry {
  id: string;
  title: string;
  createdAt: string; // ISO 8601 string
}
```

### DeleteStoryResponse

```java
public class DeleteStoryResponse {
    private boolean success;
    private String message;
    private String storyId;
}
```

## Error Handling

### Backend Error Scenarios

1. **Story Not Found (404)**
   - Scenario: Delete request for non-existent story
   - Response: `{ "error": "Story not found", "storyId": "..." }`
   - HTTP Status: 404

2. **Index File Corruption (500)**
   - Scenario: JSON parsing fails when reading index
   - Response: `{ "error": "Failed to read story index" }`
   - HTTP Status: 500
   - Recovery: Log error, return empty list for GET, fail for DELETE

3. **File System Error (500)**
   - Scenario: Cannot delete story directory
   - Response: `{ "error": "Failed to delete story files" }`
   - HTTP Status: 500
   - Action: Remove from index anyway to prevent orphaned entries

4. **Concurrent Modification**
   - Scenario: Multiple stories generated simultaneously
   - Solution: Synchronized methods in `StoryIndexService`
   - Fallback: Retry logic with exponential backoff

### Frontend Error Scenarios

1. **Network Error**
   - Display: Toast notification "Failed to load stories. Please try again."
   - Action: Show retry button in modal

2. **Delete Failure**
   - Display: Toast notification "Failed to delete story. Please try again."
   - Action: Keep story in list, allow retry

3. **Empty Library**
   - Display: Friendly message "No stories yet. Create your first story!"
   - Action: Show button to close modal and start creating

4. **Story Load Error**
   - Display: Toast notification "Failed to load story. It may have been deleted."
   - Action: Navigate back to input page

## Testing Strategy

### Backend Tests

#### Unit Tests

1. **StoryIndexServiceTest**
   - Test: `addStoryToIndex_CreatesNewIndex_WhenFileDoesNotExist()`
   - Test: `addStoryToIndex_AppendsToExistingIndex()`
   - Test: `removeStoryFromIndex_RemovesEntry()`
   - Test: `removeStoryFromIndex_HandlesNonExistentStory()`
   - Test: `getAllStories_ReturnsSortedByDateDesc()`
   - Test: `getAllStories_ReturnsEmptyList_WhenNoIndex()`
   - Test: `concurrentAdditions_MaintainDataIntegrity()`

2. **StoryControllerTest**
   - Test: `getStoryList_ReturnsAllStories()`
   - Test: `getStoryList_ReturnsEmptyList_WhenNoStories()`
   - Test: `deleteStory_RemovesStoryAndFiles()`
   - Test: `deleteStory_Returns404_WhenStoryNotFound()`

#### Integration Tests

1. **StoryLifecycleIntegrationTest**
   - Test: Full flow from generation → index update → retrieval → deletion
   - Verify: Index file created and updated correctly
   - Verify: Story files deleted completely

### Frontend Tests

#### Component Tests

1. **LibraryModal.test.tsx**
   - Test: Renders story list correctly
   - Test: Displays loading state while fetching
   - Test: Shows error message on fetch failure
   - Test: Navigates to reading page on play click
   - Test: Shows confirmation dialog on delete click
   - Test: Removes story from list after successful deletion
   - Test: Displays empty state when no stories
   - Test: Navigates to admin page on admin link click

2. **InputPage.test.tsx**
   - Test: Library button opens modal
   - Test: Modal closes when close button clicked

#### E2E Tests (Playwright)

1. **story-library.spec.ts**
   - Test: Create story → Open library → Verify story appears
   - Test: Delete story → Verify removed from list
   - Test: Play story from library → Verify reading page loads
   - Test: Access admin from library modal

## Implementation Notes

### Performance Considerations

1. **Index File Size**: With 1000 stories, index file ~100KB (negligible)
2. **Read Performance**: In-memory caching not needed for small datasets
3. **Write Performance**: Atomic writes prevent corruption but may block briefly
4. **Concurrent Access**: Synchronized methods sufficient for expected load

### Scalability

Current design suitable for:
- Up to 10,000 stories (index file ~1MB)
- Single-server deployment
- Low to moderate concurrent users

Future improvements if needed:
- Database migration (PostgreSQL, MongoDB)
- Pagination for story list
- Search and filtering capabilities
- Thumbnail caching

### Accessibility

1. **Keyboard Navigation**
   - Modal closable with Escape key
   - Tab navigation through story list
   - Enter key to play/delete

2. **Screen Readers**
   - Proper ARIA labels on buttons
   - Announce modal open/close
   - Announce deletion confirmation

3. **Visual**
   - High contrast for text
   - Focus indicators on interactive elements
   - Loading states clearly indicated

### Security Considerations

1. **Path Traversal**: Validate storyId format (UUID only)
2. **Rate Limiting**: Consider limiting delete operations
3. **Input Validation**: Sanitize all inputs (already handled by existing validation)
4. **Admin Access**: Library modal provides admin link (no additional auth in this phase)

## Migration Strategy

### Existing Stories

Stories generated before this feature will not appear in the library initially. Options:

1. **Automatic Migration** (Recommended)
   - On application startup, scan storage directory
   - For each story folder, load `story.json`
   - Add to index if not already present
   - Implement in `StoryIndexService.initializeIndex()`

2. **Manual Migration**
   - Provide admin endpoint: `POST /api/admin/rebuild-index`
   - Scans all stories and rebuilds index
   - Useful for recovery scenarios

### Implementation

```java
@PostConstruct
public void initializeIndex() {
    if (!indexFileExists()) {
        log.info("Story index not found, scanning existing stories...");
        rebuildIndexFromStorage();
    }
}

private void rebuildIndexFromStorage() {
    // Scan storage directory
    // Load each story.json
    // Build index entries
    // Save index file
}
```

## API Specification

### GET /api/stories/list

**Description**: Retrieve all stories from the index

**Response**: 200 OK
```json
[
  {
    "id": "abc-123",
    "title": "The Brave Little Robot",
    "createdAt": "2025-11-17T10:30:00"
  },
  {
    "id": "def-456",
    "title": "Mystery of the Haunted Castle",
    "createdAt": "2025-11-16T15:20:00"
  }
]
```

**Error Responses**:
- 500 Internal Server Error: Failed to read index

### DELETE /api/stories/{storyId}

**Description**: Delete a story and all its assets

**Path Parameters**:
- `storyId` (string, required): UUID of the story

**Response**: 200 OK
```json
{
  "success": true,
  "message": "Story deleted successfully",
  "storyId": "abc-123"
}
```

**Error Responses**:
- 404 Not Found: Story does not exist
- 500 Internal Server Error: Failed to delete story

## UI/UX Design

### Visual Design

**Modal Appearance**:
- Dark background with purple/blue gradient
- Semi-transparent backdrop (backdrop-blur-sm)
- Rounded corners (rounded-xl)
- Shadow for depth (shadow-2xl)
- Smooth entrance animation (scale + fade)

**Story Card Design**:
- Card-like appearance with hover effect
- Title in large, readable font
- Date in smaller, muted text
- Buttons aligned to the right
- Hover state: slight scale up + glow effect

**Color Scheme**:
- Background: `bg-dark-900/95`
- Cards: `bg-dark-800/80`
- Text: `text-gray-100`
- Accent: `text-spooky-purple-400`
- Buttons: Existing `SpookyButton` variants

### Animations

1. **Modal Entry**: Scale from 0.95 to 1.0, fade in (300ms)
2. **Modal Exit**: Scale to 0.95, fade out (200ms)
3. **Story Card Hover**: Scale to 1.02, add glow (150ms)
4. **Delete Confirmation**: Slide down from card (200ms)
5. **Story Removal**: Fade out + slide left (300ms)

### Responsive Design

- **Desktop (>1024px)**: Modal width 800px, 2-column button layout
- **Tablet (768-1024px)**: Modal width 90%, single-column buttons
- **Mobile (<768px)**: Full-width modal, stacked layout, larger touch targets

## Dependencies

### New Backend Dependencies

None required - all functionality uses existing dependencies:
- Jackson (JSON processing)
- Spring Boot (REST endpoints)
- Lombok (boilerplate reduction)

### New Frontend Dependencies

None required - all functionality uses existing dependencies:
- React (components)
- Framer Motion (animations)
- Axios (API calls)
- React Router (navigation)
- Lucide React (icons - already in use)

## File Structure

### New Backend Files

```
backend/src/main/java/com/frankenstein/story/
├── service/
│   └── StoryIndexService.java (NEW)
├── model/
│   ├── StoryIndexEntry.java (NEW)
│   └── DeleteStoryResponse.java (NEW)
└── controller/
    └── StoryController.java (MODIFIED - add endpoints)
```

### New Frontend Files

```
frontend/src/
├── components/
│   └── LibraryModal.tsx (NEW)
├── types/
│   └── index.ts (MODIFIED - add StoryIndexEntry)
├── api/
│   └── client.ts (MODIFIED - add methods)
└── pages/
    └── InputPage.tsx (MODIFIED - add button + modal)
```

### New Storage Files

```
storage/
└── story-index.json (CREATED AT RUNTIME)
```
