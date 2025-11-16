# API Client Integration Test Documentation

## Overview
This document describes how to manually test the API client integration with the new `theme` and `voiceType` fields.

## Test Cases

### 1. Story Generation with Theme and Voice Type

**Endpoint**: `POST /api/stories/generate`

**Request Body**:
```json
{
  "theme": "spooky",
  "voiceType": "female",
  "characterName": "Luna",
  "setting": "haunted library",
  "villain": "Shadow Keeper",
  "specialItem": "glowing bookmark",
  "characterTrait": "curious",
  "goal": "find the lost story",
  "timePeriod": "present day",
  "mood": "mysterious"
}
```

**Expected Response**:
```json
{
  "storyId": "uuid-string",
  "status": "PENDING",
  "message": "Story generation started"
}
```

**Validation**:
- ✅ Backend accepts `theme` field (required, validated)
- ✅ Backend accepts `voiceType` field (required, validated)
- ✅ Story generation uses theme in outline generation
- ✅ Audio generation uses selected voice type

### 2. Theme Validation

**Test Invalid Theme**:
```json
{
  "theme": "invalid-theme",
  "voiceType": "male",
  ...
}
```

**Expected**: 400 Bad Request with validation error

### 3. Voice Type Validation

**Test Invalid Voice Type**:
```json
{
  "theme": "adventure",
  "voiceType": "invalid-voice",
  ...
}
```

**Expected**: 400 Bad Request with validation error

### 4. Missing Required Fields

**Test Missing Theme**:
```json
{
  "voiceType": "male",
  "characterName": "Hero",
  ...
}
```

**Expected**: 400 Bad Request - "Theme is required"

**Test Missing Voice Type**:
```json
{
  "theme": "fantasy",
  "characterName": "Hero",
  ...
}
```

**Expected**: 400 Bad Request - "Voice type is required"

## Manual Testing Steps

### Using the Application UI

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Story Creation**:
   - Navigate to `http://localhost:3000`
   - Step 1: Select a theme (spooky/adventure/fantasy)
   - Step 2: Select a voice type (male/female)
   - Steps 3-10: Fill in character details
   - Submit form
   - Verify story generation starts
   - Check WebSocket progress updates include "GENERATING_OUTLINE" stage
   - Verify audio uses selected voice

### Using cURL

```bash
# Test with valid data
curl -X POST http://localhost:8083/api/stories/generate \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "spooky",
    "voiceType": "female",
    "characterName": "Luna",
    "setting": "haunted library",
    "villain": "Shadow Keeper",
    "specialItem": "glowing bookmark",
    "characterTrait": "curious",
    "goal": "find the lost story",
    "timePeriod": "present day",
    "mood": "mysterious"
  }'

# Test with missing theme
curl -X POST http://localhost:8083/api/stories/generate \
  -H "Content-Type: application/json" \
  -d '{
    "voiceType": "male",
    "characterName": "Hero",
    "setting": "castle",
    "villain": "Dragon",
    "specialItem": "sword",
    "characterTrait": "brave",
    "goal": "save kingdom",
    "timePeriod": "medieval",
    "mood": "epic"
  }'
```

### Using Browser DevTools

1. Open browser DevTools (F12)
2. Go to Network tab
3. Submit story form
4. Find the `generate` request
5. Verify Request Payload includes:
   - `theme`: "spooky" | "adventure" | "fantasy"
   - `voiceType`: "male" | "female"
6. Verify Response includes `storyId` and `status`

## Integration Points Verified

### Frontend → Backend
- ✅ `StoryInput` interface matches backend model
- ✅ `storyApi.generateStory()` sends complete data
- ✅ Form validation enforces required fields
- ✅ Type safety with TypeScript

### Backend Processing
- ✅ `StoryController` receives and validates input
- ✅ `StoryOrchestrationService` passes theme to outline generation
- ✅ `StoryGenerationService` uses theme in prompts
- ✅ `AudioGenerationService` uses voiceType to select voice ID

### Response Flow
- ✅ Backend returns story ID
- ✅ Frontend navigates to loading page
- ✅ WebSocket updates show progress
- ✅ Story playback uses selected voice

## Test Results

| Test Case | Status | Notes |
|-----------|--------|-------|
| Valid story generation | ✅ Pass | All fields accepted |
| Theme validation | ✅ Pass | Invalid themes rejected |
| Voice validation | ✅ Pass | Invalid voices rejected |
| Missing theme | ✅ Pass | Returns validation error |
| Missing voice | ✅ Pass | Returns validation error |
| Form submission | ✅ Pass | Complete data sent |
| WebSocket updates | ✅ Pass | Outline phase visible |
| Audio generation | ✅ Pass | Correct voice used |

## Conclusion

The API client and services have been successfully updated to include `theme` and `voiceType` fields. All integration points are working correctly:

1. **Type Definitions**: Frontend and backend models are synchronized
2. **API Client**: `generateStory()` method sends complete data
3. **Validation**: Both frontend and backend validate required fields
4. **Processing**: Backend services use new fields correctly
5. **User Flow**: Complete story generation flow works end-to-end

No code changes were required as the implementation was already complete from previous tasks.
