# Implementation Plan

- [x] 1. Create backend data models for story indexing





  - Create `StoryIndexEntry.java` model with id, title, and createdAt fields
  - Create `DeleteStoryResponse.java` model with success, message, and storyId fields
  - Add Lombok annotations (@Data, @Builder, @NoArgsConstructor, @AllArgsConstructor)
  - Add author attribution JavaDoc to both classes
  - _Requirements: 1.1, 1.2, 1.3_


- [x] 2. Implement StoryIndexService for index management





  - [x] 2.1 Create StoryIndexService class with constructor injection

    - Add @Service annotation and @RequiredArgsConstructor
    - Inject ObjectMapper and storage root path via @Value
    - Define index file path as `storage/story-index.json`
    - Add author attribution JavaDoc
    - _Requirements: 1.1, 1.2, 1.4_


  - [x] 2.2 Implement index file operations


    - Write `loadIndex()` method to read JSON file and deserialize to List<StoryIndexEntry>
    - Write `saveIndex()` method with atomic file write to prevent corruption
    - Handle FileNotFoundException by returning empty list in loadIndex()
    - Add error logging for IOException scenarios
    - _Requirements: 1.2, 1.4, 1.5_




  - [x] 2.3 Implement public API methods with thread safety


    - Write synchronized `addStoryToIndex()` method that loads, appends, and saves
    - Write synchronized `removeStoryFromIndex()` method that loads, filters, and saves
    - Write `getAllStories()` method that returns stories sorted by createdAt descending
    - Write `storyExists()` method to check if story ID is in index
    - _Requirements: 1.1, 1.5, 2.1, 2.2, 2.3, 3.2_

  - [x] 2.4 Add index initialization and migration logic

    - Write `@PostConstruct initializeIndex()` method to check for existing index
    - Write `rebuildIndexFromStorage()` method to scan storage directory
    - Load each story.json file and extract id, title, createdAt
    - Build index from existing stories if index file doesn't exist
    - _Requirements: 1.4_
-

- [x] 3. Add new REST endpoints to StoryController





  - [x] 3.1 Implement GET /api/stories/list endpoint

    - Inject StoryIndexService via constructor
    - Create @GetMapping("/list") method
    - Call storyIndexService.getAllStories()
    - Return ResponseEntity.ok() with list of StoryIndexEntry
    - Add error handling with try-catch returning 500 on failure
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.2 Implement DELETE /api/stories/{storyId} endpoint


    - Create @DeleteMapping("/{storyId}") method with @PathVariable
    - Validate storyId exists using storyIndexService.storyExists()
    - Call orchestrationService.deleteStoryWithAssets(storyId)
    - Return DeleteStoryResponse with success=true and confirmation message
    - Return 404 with error message if story not found
    - Add try-catch for exceptions returning 500 with error details
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 4. Integrate index updates into story generation flow





  - [x] 4.1 Update StoryOrchestrationService with index integration

    - Inject StoryIndexService via constructor (add to @RequiredArgsConstructor)
    - In `generateStoryAsync()` after story completion, call `addStoryToIndex()`
    - Pass story.getId(), story.getTitle(), story.getCreatedAt() to addStoryToIndex()
    - Add error logging if index update fails (don't fail story generation)
    - _Requirements: 1.1, 1.2_

  - [x] 4.2 Add deleteStoryWithAssets method to orchestration service


    - Create public method `deleteStoryWithAssets(String storyId)`
    - Call storyIndexService.removeStoryFromIndex(storyId)
    - Call fileStorageService.deleteStory(storyId) to remove files
    - Add error handling and logging for both operations
    - _Requirements: 3.2, 3.3, 3.4_


- [x] 5. Create frontend TypeScript types for story index




  - Add `StoryIndexEntry` interface to `frontend/src/types/index.ts`
  - Define fields: id (string), title (string), createdAt (string)
  - Export interface for use in components
  - _Requirements: 2.1, 4.3_
-

- [x] 6. Add API client methods for story management




  - [x] 6.1 Implement getStoryList API method


    - Add `getStoryList()` async function to `frontend/src/api/client.ts`
    - Make GET request to `/stories/list`
    - Return Promise<StoryIndexEntry[]>
    - Add error handling with try-catch
    - _Requirements: 2.1, 4.3_

  - [x] 6.2 Implement deleteStory API method

    - Add `deleteStory(storyId: string)` async function to client.ts
    - Make DELETE request to `/stories/${storyId}`
    - Return Promise<void>
    - Add error handling with try-catch
    - _Requirements: 3.1, 5.3, 5.4, 5.5_
-

- [x] 7. Create LibraryModal component



  - [x] 7.1 Create component structure and state management


    - Create `frontend/src/components/LibraryModal.tsx` file
    - Define LibraryModalProps interface with isOpen and onClose
    - Set up component state: stories, loading, error, deleteConfirm
    - Add useEffect to fetch stories when modal opens
    - Call getStoryList() API and update stories state
    - _Requirements: 4.1, 4.3, 4.4_

  - [x] 7.2 Implement modal layout and styling


    - Create modal backdrop with fixed positioning and backdrop-blur
    - Create modal container with dark theme (bg-dark-900/95)
    - Add close button (X icon) in top-right corner
    - Add admin link at top of modal navigating to /admin
    - Style with Tailwind classes matching spooky theme
    - Add Framer Motion animations for entrance/exit
    - _Requirements: 4.1, 4.2, 4.5, 6.1, 6.2, 6.3_

  - [x] 7.3 Implement story list rendering


    - Map over stories array to render story cards
    - Display title, formatted creation date for each story
    - Add Play button that navigates to `/read/{storyId}` using useNavigate
    - Add Delete button that sets deleteConfirm state to storyId
    - Style cards with hover effects (scale + glow)
    - Add scrollable container with max-height
    - _Requirements: 4.4, 5.1, 5.2_

  - [x] 7.4 Implement delete confirmation and execution


    - Show confirmation dialog when deleteConfirm state is set
    - Display "Are you sure you want to delete this story?" message
    - Add Confirm button that calls deleteStory() API
    - Add Cancel button that clears deleteConfirm state
    - On successful deletion, remove story from local state array
    - Show error toast notification if deletion fails
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [x] 7.5 Add loading and error states


    - Show loading spinner while fetching stories
    - Display error message with retry button on fetch failure
    - Show empty state message "No stories yet. Create your first story!" when list is empty
    - Handle modal close with Escape key
    - _Requirements: 4.3, 4.5_

- [x] 8. Integrate LibraryModal into InputPage





  - [x] 8.1 Add library button to InputPage


    - Import LibraryModal component
    - Add state: `const [libraryOpen, setLibraryOpen] = useState(false)`
    - Create library button with book icon in top-left corner (absolute positioning)
    - Style button as SpookyButton variant
    - Set onClick to open modal: `setLibraryOpen(true)`
    - _Requirements: 4.1, 4.2_


  - [x] 8.2 Render LibraryModal component

    - Add LibraryModal component to InputPage JSX
    - Pass isOpen={libraryOpen} prop
    - Pass onClose={() => setLibraryOpen(false)} prop
    - Ensure modal renders above other content (z-index)
    - _Requirements: 4.1, 4.5_

- [x] 9. Add comprehensive testing





  - [x] 9.1 Write backend unit tests


    - Create StoryIndexServiceTest with tests for add, remove, getAll, concurrent operations
    - Create StoryControllerTest for new endpoints (list, delete)
    - Mock dependencies and verify interactions
    - Test error scenarios (file not found, corruption, etc.)
    - _Requirements: All backend requirements_

  - [x] 9.2 Write frontend component tests


    - Create LibraryModal.test.tsx with React Testing Library
    - Test rendering, loading states, error states, empty states
    - Test play and delete button interactions
    - Test modal open/close behavior
    - Mock API calls with MSW or similar
    - _Requirements: All frontend requirements_

  - [x] 9.3 Write E2E tests with Playwright


    - Create story-library.spec.ts
    - Test full flow: create story → open library → verify appearance
    - Test delete flow: delete story → verify removal
    - Test play flow: click play → verify navigation to reading page
    - Test admin link navigation
    - _Requirements: All requirements_

- [x] 10. Add accessibility improvements





  - Add ARIA labels to all interactive elements in LibraryModal
  - Implement keyboard navigation (Tab, Enter, Escape)
  - Add focus trap within modal when open
  - Ensure screen reader announcements for modal state changes
  - Test with keyboard-only navigation
  - _Requirements: 4.1, 4.2, 4.5, 5.1, 5.2, 6.2_
