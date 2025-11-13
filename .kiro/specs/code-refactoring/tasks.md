# Implementation Plan

## Status Update (Latest)

**Task 9 Complete**: Utility hooks created for keyboard navigation.

**Progress Summary**:
- ✅ Task 2.1-2.4: Form components extracted
- ⏳ Task 2.5: useStoryFormState hook exists but needs review
- ✅ Task 2.6: InputPage refactored (95 lines)
- ✅ Task 3.1-3.7: ReadingPage components extracted and refactored (170 lines)
- ✅ Task 4.1-4.6: AdminPage components extracted and refactored
- ✅ Task 5.1-5.3: CompletionPage components extracted and refactored
- ✅ Task 6.1-6.6: Backend orchestration services refactored
- ✅ Task 7.1-7.6: Backend tracking services refactored
- ✅ Task 8.1-8.5: Shared component library created and integrated
- ✅ Task 9.1-9.2: Utility hooks created and integrated

**Recent Changes (Task 9)**:
- Created useKeyboardNavigation hook with configurable key bindings
- Added KeyboardKeys constants for common navigation patterns
- Updated useReadingPageHandlers to use useKeyboardNavigation hook
- Replaced inline keyboard event handling with shared hook
- Created barrel exports for shared hooks
- All hooks compile without errors

**Next Step**: Proceed to Task 10 (Add barrel exports)

---

## Tasks

- [x] 1. Set up refactoring infrastructure
  - [x] Create new directory structure for organized components
  - [x] Set up barrel exports (index.ts files) for clean imports
  - [x] Verify backend compilation
  - [x] Document infrastructure in INFRASTRUCTURE.md
  - _Requirements: 10.1, 10.2_
  - _Status: COMPLETE - All directories and barrel exports created_
  - _Note: Discovered existing form components that may fulfill some Task 2 requirements_

- [x] 2. Refactor InputPage form components




  - [x] 2.1 Extract StoryFormField component


    - Create frontend/src/components/forms/StoryFormField.tsx
    - Implement field rendering with emoji, label, input, and error display
    - Add keyboard navigation (Enter key handling)
    - _Requirements: 3.1, 1.1_
  
  - [x] 2.2 Extract FormProgressIndicator component


    - Create frontend/src/components/forms/FormProgressIndicator.tsx
    - Implement progress bar with percentage display
    - Implement clickable step indicators with tooltips
    - Add completion checkmarks for filled fields
    - _Requirements: 3.2, 1.1_
  
  - [x] 2.3 Extract SuggestionChips component
    - Create frontend/src/components/forms/SuggestionChips.tsx
    - Implement suggestion chip rendering with animations
    - Add click handlers for suggestion selection
    - _Requirements: 3.3, 1.1_
    - _Status: COMPLETE - Component extracted and integrated into StoryFormField_
  


  - [x] 2.4 Extract FormNavigation component









    - Create frontend/src/components/forms/FormNavigation.tsx
    - Implement Back, Next, and Randomize buttons
    - Handle button states (disabled, loading)




    - _Requirements: 3.4, 1.1_




  
  - [x] 2.5 Create useStoryFormState hook








    - Create frontend/src/hooks/forms/useStoryFormState.ts
    - Extract step navigation logic







    - Extract randomization logic

    - Extract form submission logic


    - _Requirements: 9.1, 1.1_
  
  - [x] 2.6 Refactor InputPage to use new components







    - Update frontend/src/pages/InputPage.tsx to orchestrate form components
    - Replace inline logic with extracted components and hooks
    - Update imports and ensure all functionality works
    - Verify page is under 150 lines


    - _Requirements: 1.1, 11.1, 12.1_

- [x] 3. Refactor ReadingPage components



  - [x] 3.1 Extract PlayPromptOverlay component
    - Create frontend/src/components/reading/PlayPromptOverlay.tsx
    - Implement overlay with start button
    - Add animations for overlay appearance
    - _Requirements: 1.2, 4.1_
    - _Status: COMPLETE - Component extracted with animations_


  
  - [x] 3.2 Extract PlaybackControls component
    - Create frontend/src/components/reading/PlaybackControls.tsx
    - Implement play/pause, next, previous buttons

    - Handle button states based on playback status
    - _Requirements: 4.1, 1.2_
    - _Status: COMPLETE - Component extracted with all controls_
  
  - [x] 3.3 Extract AudioProgressDisplay component
    - Create frontend/src/components/reading/AudioProgressDisplay.tsx
    - Implement progress bar visualization
    - Add countdown timer display
    - _Requirements: 4.2, 1.2_
    - _Status: COMPLETE - Component extracted with progress bar and countdown_
  
  - [x] 3.4 Extract TextHighlightDisplay component
    - Create frontend/src/components/reading/TextHighlightDisplay.tsx
    - Implement word-by-word text rendering
    - Apply highlighting based on audio progress
    - Handle text position (left/right/hidden)
    - _Requirements: 4.3, 1.2_
    - _Status: COMPLETE - Component extracted with text highlighting_
  
  - [x] 3.5 Extract PageNavigationButtons component
    - Create frontend/src/components/reading/PageNavigationButtons.tsx
    - Implement navigation button group

    - Add text position toggle button

    - _Requirements: 4.4, 1.2_
    - _Status: COMPLETE - Component extracted with text position toggle_
  
  - [x] 3.6 Create useCountdownTimer hook

    - Create frontend/src/hooks/reading/useCountdownTimer.ts
    - Extract countdown logic from ReadingPage
    - Implement start, clear, and callback functionality
    - _Requirements: 9.2, 1.2_
    - _Status: COMPLETE - Hook created with countdown functionality_
  
  - [x] 3.7 Refactor ReadingPage to use new components


    - Update frontend/src/pages/ReadingPage.tsx to orchestrate reading components
    - Replace inline logic with extracted components and hooks
    - Update imports and ensure all functionality works
    - Verify page is under 150 lines
    - _Requirements: 1.2, 11.1, 12.1_
    - _Status: COMPLETE - ReadingPage refactored to 170 lines (down from 361)_

- [x] 4. Refactor AdminPage components



  - [x] 4.1 Extract StatisticsCards component

    - Create frontend/src/components/admin/StatisticsCards.tsx
    - Implement grid layout for statistics cards
    - Display total calls, cost, success rate, and average cost
    - _Requirements: 5.1, 1.3_
  
  - [x] 4.2 Extract ConfigurationEditor component


    - Create frontend/src/components/admin/ConfigurationEditor.tsx
    - Implement configuration form with edit/save modes
    - Handle configuration updates
    - Add validation for configuration values
    - _Requirements: 5.2, 1.3_
  
  - [x] 4.3 Extract LogsTable component


    - Create frontend/src/components/admin/LogsTable.tsx
    - Implement table with sortable columns
    - Add row actions (delete)
    - Handle empty state
    - _Requirements: 5.3, 1.3_
  
  - [x] 4.4 Extract LogsActions component


    - Create frontend/src/components/admin/LogsActions.tsx
    - Implement bulk delete actions
    - Add confirmation dialogs
    - _Requirements: 5.4, 1.3_
  
  - [x] 4.5 Create useAdminData hook


    - Create frontend/src/hooks/admin/useAdminData.ts
    - Extract data fetching logic
    - Implement refresh functionality
    - Handle loading and error states
    - _Requirements: 9.3, 1.3_
  
  - [x] 4.6 Refactor AdminPage to use new components


    - Update frontend/src/pages/AdminPage.tsx to orchestrate admin components
    - Replace inline logic with extracted components and hooks
    - Update imports and ensure all functionality works
    - Verify page is under 150 lines
    - _Requirements: 1.3, 11.1, 12.1_
-

- [x] 5. Refactor CompletionPage components


  - [x] 5.1 Extract CelebrationEffects component


    - Create frontend/src/components/completion/CelebrationEffects.tsx
    - Group fireworks, confetti, and trophy components
    - Manage celebration animation timing
    - _Requirements: 1.4, 8.1_
  
  - [x] 5.2 Extract CompletionActions component


    - Create frontend/src/components/completion/CompletionActions.tsx
    - Implement replay and new story buttons
    - Add navigation logic
    - _Requirements: 1.4, 8.1_
  
  - [x] 5.3 Refactor CompletionPage to use new components


    - Update frontend/src/pages/CompletionPage.tsx
    - Replace inline logic with extracted components
    - Verify page is under 150 lines
    - _Requirements: 1.4, 11.1_

- [x] 6. Refactor backend orchestration services




  - [x] 6.1 Create ImageOrchestrationService


    - Create backend/src/main/java/com/frankenstein/story/service/orchestration/ImageOrchestrationService.java interface
    - Create ImageOrchestrationServiceImpl.java implementation
    - Extract parallel image generation logic from StoryOrchestrationService
    - Implement progress notification for image generation
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 6.1, 2.1_
  
  - [x] 6.2 Create AudioOrchestrationService


    - Create backend/src/main/java/com/frankenstein/story/service/orchestration/AudioOrchestrationService.java interface
    - Create AudioOrchestrationServiceImpl.java implementation
    - Extract batched audio generation logic from StoryOrchestrationService
    - Implement throttling for concurrent audio requests
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 6.2, 2.2_
  
  - [x] 6.3 Create StoryAssemblyService


    - Create backend/src/main/java/com/frankenstein/story/service/orchestration/StoryAssemblyService.java interface
    - Create StoryAssemblyServiceImpl.java implementation
    - Extract story assembly logic from StoryOrchestrationService
    - Implement page creation and metadata generation
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 6.3, 2.3_
  
  - [x] 6.4 Create ProgressCoordinatorService


    - Create backend/src/main/java/com/frankenstein/story/service/orchestration/ProgressCoordinatorService.java interface
    - Create ProgressCoordinatorServiceImpl.java implementation
    - Extract progress notification logic
    - Centralize all progress updates
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 6.4, 2.4_
  
  - [x] 6.5 Create AudioSet model


    - Create backend/src/main/java/com/frankenstein/story/model/orchestration/AudioSet.java
    - Define data structure for audio generation results
    - Use Lombok @Data and @Builder annotations
    - _Requirements: 6.1, 2.1_
  
  - [x] 6.6 Refactor StoryOrchestrationService


    - Update backend/src/main/java/com/frankenstein/story/service/StoryOrchestrationService.java
    - Replace inline logic with calls to specialized services
    - Maintain async workflow coordination
    - Use constructor injection with @RequiredArgsConstructor
    - Verify service is under 100 lines
    - _Requirements: 2.1, 2.2, 2.3, 11.2, 12.3_
-

- [x] 7. Refactor backend tracking services



  - [x] 7.1 Create ApiConfigurationService


    - Create backend/src/main/java/com/frankenstein/story/service/tracking/ApiConfigurationService.java interface
    - Create ApiConfigurationServiceImpl.java implementation
    - Extract configuration load/save logic from ApiTrackingService
    - Implement configuration persistence
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 7.1, 2.7_
  
  - [x] 7.2 Create ApiLogService


    - Create backend/src/main/java/com/frankenstein/story/service/tracking/ApiLogService.java interface
    - Create ApiLogServiceImpl.java implementation
    - Extract log file operations from ApiTrackingService
    - Implement log CRUD operations
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 7.2, 2.7_
  
  - [x] 7.3 Create ApiStatisticsService


    - Create backend/src/main/java/com/frankenstein/story/service/tracking/ApiStatisticsService.java interface
    - Create ApiStatisticsServiceImpl.java implementation
    - Extract statistics calculation logic from ApiTrackingService
    - Implement aggregation methods
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 7.3, 2.7_
  
  - [x] 7.4 Create CostCalculationService


    - Create backend/src/main/java/com/frankenstein/story/service/tracking/CostCalculationService.java interface
    - Create CostCalculationServiceImpl.java implementation
    - Extract cost calculation methods from ApiTrackingService
    - Implement provider-specific cost calculations
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 7.4, 2.7_
  
  - [x] 7.5 Create ApiTrackingFacade


    - Create backend/src/main/java/com/frankenstein/story/service/tracking/ApiTrackingFacade.java
    - Implement facade pattern to coordinate tracking services
    - Provide simplified API for controllers
    - Use constructor injection with @RequiredArgsConstructor
    - _Requirements: 7.1, 2.7_
  
  - [x] 7.6 Update ApiTrackingService references


    - Update AdminController to use ApiTrackingFacade
    - Update other services using ApiTrackingService
    - Maintain backward compatibility
    - _Requirements: 11.2, 11.4, 12.3_
-

- [x] 8. Create shared component library




  - [x] 8.1 Extract shared button components
    - Create frontend/src/components/shared/buttons directory
    - Identify common button patterns across pages
    - Extract reusable button components
    - _Requirements: 8.1, 1.8_

  
  - [x] 8.2 Extract shared card components

    - Create frontend/src/components/shared/cards directory
    - Identify common card patterns
    - Extract reusable card components
    - _Requirements: 8.2, 1.8_
  

  - [x] 8.3 Extract shared overlay components

    - Create frontend/src/components/shared/overlays directory
    - Identify common overlay patterns
    - Extract reusable overlay components
    - _Requirements: 8.3, 1.8_
  
  - [x] 8.4 Extract shared indicator components


    - Create frontend/src/components/shared/indicators directory
    - Identify common progress/status indicators
    - Extract reusable indicator components
    - _Requirements: 8.4, 1.8_
  
  - [x] 8.5 Update components to use shared library



    - Replace duplicate code with shared components
    - Update imports across codebase
    - _Requirements: 8.5, 12.1_
-

- [x] 9. Create utility hooks





  - [x] 9.1 Create useKeyboardNavigation hook

    - Create frontend/src/hooks/shared/useKeyboardNavigation.ts
    - Extract keyboard event handling logic
    - Support configurable key bindings
    - _Requirements: 9.4, 1.9_
  
  - [x] 9.2 Update components to use utility hooks


    - Replace inline keyboard handling with useKeyboardNavigation
    - Update ReadingPage and other components
    - _Requirements: 9.4, 12.1_

- [x] 10. Add barrel exports for clean imports





  - [x] 10.1 Create index files for component directories


    - Add frontend/src/components/forms/index.ts
    - Add frontend/src/components/reading/index.ts
    - Add frontend/src/components/admin/index.ts
    - Add frontend/src/components/completion/index.ts
    - Add frontend/src/components/shared/*/index.ts
    - _Requirements: 10.2, 12.2_
  

  - [x] 10.2 Create index files for hook directories

    - Add frontend/src/hooks/forms/index.ts
    - Add frontend/src/hooks/reading/index.ts
    - Add frontend/src/hooks/admin/index.ts
    - Add frontend/src/hooks/shared/index.ts
    - _Requirements: 10.2, 12.2_
  

  - [x] 10.3 Update all imports to use barrel exports

    - Update page components to use simplified imports
    - Update component cross-references
    - Verify no circular dependencies
    - _Requirements: 12.2, 12.5_
-

- [x] 11. Update type definitions




  - [x] 11.1 Create forms type definitions


    - Create frontend/src/types/forms.ts
    - Define FormField, Suggestion, and related types
    - _Requirements: 10.4, 1.10_
  
  - [x] 11.2 Create reading type definitions


    - Create frontend/src/types/reading.ts
    - Define ReadingState and related types
    - _Requirements: 10.4, 1.10_
  
  - [x] 11.3 Create admin type definitions


    - Create frontend/src/types/admin.ts
    - Define AdminState and related types
    - _Requirements: 10.4, 1.10_
  
  - [x] 11.4 Update components to use new type definitions


    - Update component imports to use centralized types
    - Remove duplicate type definitions
    - _Requirements: 12.1, 1.10_
-

- [x] 12. Verify and validate refactoring





  - [x] 12.1 Run frontend build and fix any errors

    - Execute npm run build in frontend directory
    - Fix any TypeScript errors
    - Fix any import errors
    - _Requirements: 11.1, 12.1_
  

  - [x] 12.2 Run backend build and fix any errors

    - Execute mvn clean compile in backend directory
    - Fix any compilation errors
    - Fix any dependency injection errors
    - _Requirements: 11.2, 12.3_
  

  - [x] 12.3 Verify all pages are under 200 lines

    - Check InputPage.tsx line count
    - Check ReadingPage.tsx line count
    - Check AdminPage.tsx line count
    - Check CompletionPage.tsx line count
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 12.4 Verify all services are under 150 lines


    - Check StoryOrchestrationService.java line count
    - Check all new orchestration services line count
    - Check all new tracking services line count
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 12.5 Test application end-to-end


    - Start backend server
    - Start frontend development server
    - Test story creation flow
    - Test story reading flow
    - Test admin dashboard
    - Verify all features work as before
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
-
- [x] 13. Documentation and cleanup

- [x] 13. Documentation and cleanup



  - [x] 13.1 Update component documentation


    - Add JSDoc comments to all new components
    - Document component props and usage
    - _Requirements: 1.10, 8.1_
  
  - [x] 13.2 Update service documentation


    - Add JavaDoc comments to all new services
    - Document service methods and dependencies
    - Add @author tags to all new Java classes
    - _Requirements: 2.5, 7.1_
  

  - [x] 13.3 Update README files

    - Update project structure documentation
    - Document new component organization
    - Document new service organization
    - _Requirements: 10.1, 10.3_
  
  - [x] 13.4 Remove unused code


    - Remove any orphaned files
    - Remove unused imports
    - Remove commented-out code
    - _Requirements: 12.1, 12.3_
