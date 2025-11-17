# Requirements Document

## Introduction

This feature adds story library management capabilities to the Frankenstein application, enabling users to view, access, and delete previously generated stories. The system will maintain a persistent index of all stories with their metadata, provide backend APIs for story management operations, and offer a user interface for browsing and managing the story collection.

## Glossary

- **Story Library**: The collection of all previously generated stories stored in the system
- **Story Index**: A persistent JSON file mapping story UUIDs to their metadata (title, creation date)
- **Story Entry**: A single record in the Story Index containing a story's UUID and metadata
- **Library Modal**: A popup interface component displaying the list of available stories
- **Storage Service**: The backend service responsible for managing the Story Index file
- **Story Management API**: REST endpoints for retrieving and deleting stories

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a list of all my previously generated stories, so that I can replay or manage them without losing access to past creations

#### Acceptance Criteria

1. WHEN the application generates a new story, THE Storage Service SHALL create a Story Entry in the Story Index containing the story UUID, title, and creation timestamp
2. WHEN a Story Entry is created, THE Storage Service SHALL persist the Story Index to the filesystem at `storage/story-index.json`
3. THE Story Index file SHALL contain a JSON array of Story Entry objects with fields: id, title, and createdAt
4. IF the Story Index file does not exist, THEN THE Storage Service SHALL create a new empty index file before adding entries
5. THE Storage Service SHALL ensure atomic write operations to prevent data corruption during concurrent story generation

### Requirement 2

**User Story:** As a user, I want to retrieve the list of all existing stories through an API, so that the frontend can display them in the library interface

#### Acceptance Criteria

1. THE Story Management API SHALL provide a GET endpoint at `/api/stories/list` that returns all Story Entry objects
2. WHEN the list endpoint is called, THE Story Management API SHALL read the Story Index file and return the complete array of stories
3. THE Story Management API SHALL return stories ordered by creation date in descending order (newest first)
4. IF the Story Index file does not exist, THEN THE Story Management API SHALL return an empty array with HTTP status 200
5. THE Story Management API SHALL return HTTP status 500 with an error message if the Story Index file cannot be read

### Requirement 3

**User Story:** As a user, I want to delete stories I no longer need, so that I can manage storage space and keep my library organized

#### Acceptance Criteria

1. THE Story Management API SHALL provide a DELETE endpoint at `/api/stories/{storyId}` that removes a story and its assets
2. WHEN a delete request is received, THE Storage Service SHALL remove the Story Entry from the Story Index
3. WHEN a delete request is received, THE Storage Service SHALL delete the story directory at `storage/{storyId}` including all images and audio files
4. THE Storage Service SHALL persist the updated Story Index after removing the Story Entry
5. IF the story directory or Story Entry does not exist, THEN THE Story Management API SHALL return HTTP status 404 with an error message
6. WHEN deletion completes successfully, THE Story Management API SHALL return HTTP status 200 with a confirmation message

### Requirement 4

**User Story:** As a user, I want to access the story library from the main menu, so that I can easily browse and select stories to replay

#### Acceptance Criteria

1. THE Input Page SHALL display a Library Button in the top-left corner of the interface
2. WHEN the Library Button is clicked, THE Input Page SHALL open the Library Modal as an overlay
3. THE Library Modal SHALL fetch the story list from the `/api/stories/list` endpoint when opened
4. THE Library Modal SHALL display each Story Entry with its title and creation date in a scrollable list
5. THE Library Modal SHALL provide a close button to dismiss the overlay and return to the Input Page

### Requirement 5

**User Story:** As a user, I want to play or delete stories from the library modal, so that I can manage my story collection efficiently

#### Acceptance Criteria

1. THE Library Modal SHALL display a Play Button and Delete Button for each Story Entry
2. WHEN the Play Button is clicked, THE Library Modal SHALL navigate to the Reading Page at `/read/{storyId}`
3. WHEN the Delete Button is clicked, THE Library Modal SHALL display a confirmation dialog asking "Are you sure you want to delete this story?"
4. WHEN deletion is confirmed, THE Library Modal SHALL call the DELETE endpoint at `/api/stories/{storyId}`
5. WHEN deletion succeeds, THE Library Modal SHALL remove the Story Entry from the displayed list without requiring a page refresh
6. IF deletion fails, THEN THE Library Modal SHALL display an error notification to the user

### Requirement 6

**User Story:** As an administrator, I want to access the admin dashboard from the library modal, so that I can monitor API usage without navigating through multiple pages

#### Acceptance Criteria

1. THE Library Modal SHALL display an Admin Link at the top of the modal interface
2. WHEN the Admin Link is clicked, THE Library Modal SHALL navigate to the Admin Page at `/admin`
3. THE Admin Link SHALL be visually distinct from story entries using different styling or iconography
4. THE Admin Link SHALL be positioned above the story list for easy access
