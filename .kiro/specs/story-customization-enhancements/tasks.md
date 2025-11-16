# Implementation Plan

- [x] 1. Update backend data models for theme, voice, and outline support





  - Add `theme` and `voiceType` fields to `StoryInput.java`
  - Create new `StoryOutline.java` model with nested section classes (`BeginningSection`, `MiddleSection`, `EndSection`, `CharacterProfile`)
  - Add `maleVoiceId` and `femaleVoiceId` fields to `ApiConfiguration.java`
  - Update `ApiConfiguration.getDefaults()` to include default voice IDs
  - Add validation annotations for new fields
  - _Requirements: 1.1, 1.4, 2.1, 3.1_

- [x] 2. Implement two-phase story generation in StoryGenerationService




  - [x] 2.1 Create outline generation method


    - Implement `generateOutline(StoryInput input)` method
    - Build outline-specific prompt template with theme integration
    - Include character profiles, narrative arc, and section planning in prompt
    - Parse Claude response into `StoryOutline` object
    - Add error handling for outline generation failures
    - _Requirements: 4.1, 4.2, 4.3, 1.5_
  
  - [x] 2.2 Create full story generation method with outline context


    - Implement `generateFullStory(StoryInput input, StoryOutline outline)` method
    - Build full story prompt template that includes outline context
    - Specify 10-15 page requirement in prompt
    - Include modern, punchy writing style instructions (short sentences, dialogue, character interaction)
    - Parse Claude response into `StoryStructure` object
    - Validate page count is between 10-15 (log warning if outside range)
    - _Requirements: 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 2.3 Update image prompt generation for left-third composition


    - Create `enhancePromptWithComposition(String prompt)` helper method
    - Prepend left-third composition guidance to all image prompts
    - Include phrases like "focal point in left 35%", "subject on left side", "positioned left of center"
    - Apply to all pages in story generation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. Update AudioGenerationService for configurable voices





  - Remove `@Value("${api.elevenlabs.voice-id}")` field
  - Add `ApiTrackingService` dependency via constructor injection
  - Create `getVoiceIdForType(String voiceType)` method that retrieves voice ID from configuration
  - Update `generateNarration` method signature to accept `voiceType` parameter
  - Implement fallback to default voice IDs if configuration missing
  - Add logging for voice selection
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 4. Update ImageGenerationService for left-third composition





  - Create `enhancePromptWithComposition(String originalPrompt)` method
  - Prepend composition guidance to all image generation prompts
  - Update `generateImage` method to use enhanced prompts
  - Add logging to verify composition guidance is applied
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 5. Update StoryOrchestrationService for two-phase workflow




  - Add outline generation phase with progress notification (5% - "GENERATING_OUTLINE")
  - Call `storyGenerationService.generateOutline(input)` first
  - Update story generation phase to pass outline context (15% - "GENERATING_STORY")
  - Call `storyGenerationService.generateFullStory(input, outline)` with outline
  - Update progress notifications for new phases
  - Pass `voiceType` from input to audio generation calls
  - Handle errors from both phases appropriately
  - _Requirements: 4.1, 4.4, 4.5, 2.5_

- [x] 6. Update ApiTrackingService for voice configuration management





  - Update `loadConfiguration()` to handle missing voice fields with defaults
  - Update `saveConfiguration()` to persist voice configuration
  - Ensure voice IDs are included in configuration JSON
  - Add validation for voice ID format (alphanumeric)
  - _Requirements: 3.1, 3.2, 3.4, 3.6_

- [x] 7. Update backend configuration files





  - Remove `api.elevenlabs.voice-id` from `application.yml` and `application-example.yml`
  - Update `.env.example` to remove `ELEVENLABS_VOICE_ID`
  - Document voice configuration in admin interface
  - _Requirements: 3.1_

- [x] 8. Create frontend theme and voice selection components




  - [x] 8.1 Create ThemeSelector component


    - Define `ThemeOption` interface and `THEME_OPTIONS` constant (spooky, adventure, fantasy)
    - Implement theme selection UI with cards/buttons
    - Add hover and selection animations with Framer Motion
    - Include theme icons, names, and descriptions
    - Emit selection event to parent component
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 8.2 Create VoiceSelector component


    - Define `VoiceOption` interface and `VOICE_OPTIONS` constant (male, female)
    - Implement voice selection UI with cards/buttons
    - Add hover and selection animations with Framer Motion
    - Include voice icons, names, and descriptions
    - Emit selection event to parent component
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 9. Update InputPage component for new form flow





  - Update form schema to include `theme` and `voiceType` fields with Zod validation
  - Add theme selection as Step 0 (before character details)
  - Add voice selection as Step 1 (after theme, before character details)
  - Shift existing character detail steps by 2 positions
  - Update `FORM_FIELDS` array to include new steps
  - Update form submission to include theme and voice type
  - Update progress indicator to show all steps including theme and voice
  - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.3_

- [x] 10. Update frontend type definitions




  - Add `theme` and `voiceType` fields to `StoryInput` interface
  - Add `maleVoiceId` and `femaleVoiceId` fields to `ApiConfiguration` interface
  - Create `StoryOutline` interface with all nested types
  - Export new types from `types/index.ts`
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 11. Update LoadingPage component for new progress stages





  - Add "GENERATING_OUTLINE" stage to `PROGRESS_STAGES` array (5% progress)
  - Update "GENERATING_STORY" stage label to reflect full story generation (15% progress)
  - Ensure progress bar and labels update correctly for new phases
  - Test WebSocket progress updates for outline phase
  - _Requirements: 4.5_

- [x] 12. Create voice configuration UI in AdminPage




  - [x] 12.1 Create VoiceConfiguration component


    - Add input fields for male and female voice IDs
    - Implement edit/save/cancel functionality
    - Add validation for voice ID format
    - Include link to ElevenLabs voice library
    - Style consistently with existing admin UI
    - _Requirements: 3.2, 3.3, 3.4_
  
  - [x] 12.2 Integrate VoiceConfiguration into AdminPage


    - Add voice configuration section to admin dashboard
    - Wire up configuration state management
    - Implement save handler that calls backend API
    - Add success/error toast notifications
    - Test configuration persistence
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [x] 13. Update backend API endpoints for voice configuration





  - Verify `GET /api/admin/configuration` returns voice fields
  - Verify `PUT /api/admin/configuration` accepts and persists voice fields
  - Add validation for voice ID fields in controller
  - Test configuration endpoints with new fields
  - _Requirements: 3.2, 3.3, 3.4_

- [x] 14. Update API client and services





  - Update `generateStory` API call to include theme and voiceType
  - Update request/response types to match new backend models
  - Test API integration with new fields
  - _Requirements: 1.4, 2.4_

- [x] 15. Integration testing and validation





  - Test complete flow: theme selection → voice selection → character details → story generation
  - Verify outline generation phase appears in progress updates
  - Verify full story generation produces 10-15 pages
  - Verify images have left-third composition in prompts
  - Verify audio uses selected voice (male or female)
  - Test admin voice configuration updates
  - Test error handling for both generation phases
  - Verify backward compatibility with existing stories
  - _Requirements: 1.5, 2.5, 4.5, 4.6, 5.4, 5.6, 6.1, 6.3_
