# Requirements Document

## Introduction

This feature enhances the Frankenstein story generator to provide users with more control over story creation through theme and voice selection, improves story quality through a two-phase generation process with outlining, extends story length to 10-15 pages with modern writing style, makes narrator voices configurable via admin interface, and optimizes image composition for better visual presentation in the 3D book interface.

## Glossary

- **Story Generator System**: The Frankenstein application that creates AI-powered children's stories
- **Theme**: A predefined story genre or style (e.g., spooky, adventure, fantasy) that guides narrative generation
- **Voice Selection**: User choice between male and female narrator voices for audio generation
- **Story Outline**: A structured narrative plan with beginning, middle, and end created before full story generation
- **Two-Phase Generation**: A process where the system first creates a story outline, then generates the complete story based on that outline
- **Focal Point**: The primary subject or area of interest in an image composition
- **Left-Third Composition**: Image layout technique positioning focal points in the left 35% of the frame
- **Admin Configuration**: Settings manageable through the admin dashboard interface
- **ElevenLabs Voice**: A specific voice ID used for text-to-speech narration
- **Page Count**: The number of story pages, extended from 8 to 10-15 pages
- **Modern Writing Style**: Short, punchy prose with dialogue and character interaction typical of contemporary children's books

## Requirements

### Requirement 1

**User Story:** As a story creator, I want to select a theme for my story before providing character details, so that the generated narrative follows a consistent genre and style

#### Acceptance Criteria

1. WHEN the Story Generator System loads the input page, THE Story Generator System SHALL display a theme selection interface before the character detail inputs
2. THE Story Generator System SHALL provide at least three theme options (spooky, adventure, fantasy) for user selection
3. WHEN a user selects a theme, THE Story Generator System SHALL store the theme selection and enable the character detail input fields
4. THE Story Generator System SHALL pass the selected theme to the story generation process
5. WHEN generating the story outline, THE Story Generator System SHALL incorporate the selected theme into the narrative structure

### Requirement 2

**User Story:** As a story creator, I want to choose between male and female narrator voices, so that the audio narration matches my preference for the story

#### Acceptance Criteria

1. WHEN the Story Generator System loads the input page, THE Story Generator System SHALL display a voice selection interface with male and female options
2. THE Story Generator System SHALL provide clear labels and preview options for each voice type
3. WHEN a user selects a voice type, THE Story Generator System SHALL store the voice selection for audio generation
4. THE Story Generator System SHALL use the selected voice type when requesting narration from ElevenLabs
5. WHEN generating audio for each page, THE Story Generator System SHALL apply the user-selected voice consistently across all pages

### Requirement 3

**User Story:** As a system administrator, I want to configure available narrator voices through the admin interface, so that I can manage voice options without modifying environment files or redeploying the application

#### Acceptance Criteria

1. THE Story Generator System SHALL remove ElevenLabs voice ID configuration from environment variables
2. THE Story Generator System SHALL store voice configurations in the api-config.json file with male and female voice IDs
3. WHEN an administrator accesses the admin configuration page, THE Story Generator System SHALL display editable fields for male and female voice IDs
4. WHEN an administrator updates voice configurations, THE Story Generator System SHALL persist the changes to api-config.json
5. WHEN generating audio, THE Story Generator System SHALL retrieve voice IDs from the configuration file based on user selection
6. THE Story Generator System SHALL provide default voice IDs if configuration values are missing

### Requirement 4

**User Story:** As a story creator, I want the system to first create a story outline before generating the full narrative, so that the story has a coherent structure with proper beginning, middle, and end

#### Acceptance Criteria

1. WHEN story generation begins, THE Story Generator System SHALL make an initial API call to Claude to create a story outline
2. THE Story Generator System SHALL pass the theme, character details, and structural requirements to the outline generation call
3. THE Story Generator System SHALL receive a story outline containing beginning, middle, and end sections with character arcs
4. WHEN the outline is complete, THE Story Generator System SHALL use the outline as context for generating the full story
5. THE Story Generator System SHALL update progress notifications to indicate outline generation as a distinct phase
6. IF outline generation fails, THEN THE Story Generator System SHALL log the error and notify the user of the failure

### Requirement 5

**User Story:** As a story reader, I want stories to be 10-15 pages long with modern, punchy writing that includes dialogue, so that the reading experience is engaging and age-appropriate

#### Acceptance Criteria

1. WHEN generating a story outline, THE Story Generator System SHALL specify a target length of 10-15 pages
2. THE Story Generator System SHALL instruct Claude to use short, punchy sentences with dialogue and character interaction
3. THE Story Generator System SHALL request a modern children's book writing style in the generation prompt
4. WHEN generating the full story, THE Story Generator System SHALL produce between 10 and 15 pages of content
5. THE Story Generator System SHALL ensure each page contains dialogue or character interaction where narratively appropriate
6. THE Story Generator System SHALL validate that the generated story meets the page count requirement before proceeding to image generation

### Requirement 6

**User Story:** As a story reader viewing the 3D book interface, I want images to have focal points positioned in the left 35% of the frame, so that important visual elements are visible when the book page is angled in 3D space

#### Acceptance Criteria

1. WHEN generating image prompts for any story page, THE Story Generator System SHALL include composition guidance to position focal points in the left 35% of the image
2. THE Story Generator System SHALL specify left-third composition in all image generation requests to Stability AI
3. THE Story Generator System SHALL apply the left-third composition rule consistently across all pages in a story
4. WHEN creating the initial story outline, THE Story Generator System SHALL consider visual composition requirements for scene descriptions
5. THE Story Generator System SHALL include specific positioning language (e.g., "subject on the left side", "focal point left of center") in image prompts
