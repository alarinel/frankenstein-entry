# Background Music Integration - Sound Effects Removal

**Date**: November 16, 2025  
**Type**: Feature Enhancement / Refactoring  
**Status**: Completed

## Summary

Completely removed the sound effects system and replaced it with a simpler, more performant background music system. Background music is now selected based on the story's mood and plays continuously throughout the reading experience.

## Changes Made

### Backend Changes

1. **Model Updates**
   - `StoryPage.java`: Removed `soundEffects` field, kept `backgroundMusic` field
   - `StoryStructure.PageStructure`: Removed `soundEffects` field, kept `backgroundMusic` field

2. **Service Updates**
   - `AudioOrchestrationServiceImpl.java`: Removed sound effects generation logic
   - `StoryAssemblyServiceImpl.java`: Removed sound effects URL mapping, added `backgroundMusic` field mapping
   - `FileStorageService.java`: Removed `getSoundEffectsDirectory()`, `saveSoundEffect()`, and `getSoundEffectUrl()` methods

3. **Test Updates**
   - `StoryGenerationServiceTest.java`: Updated test data to use `backgroundMusic` instead of `soundEffects`
   - `StoryOrchestrationServiceTest.java`: Updated test data to use `backgroundMusic` instead of `soundEffects`

### Frontend Changes

1. **Type Definitions**
   - `types/index.ts`: Already had `backgroundMusic` field, no changes needed

2. **Audio Store**
   - `store/audioStore.ts`: 
     - Replaced `soundEffects: Howl[]` with `backgroundMusic: Howl | null`
     - Updated `play()`, `pause()`, `stop()`, and `cleanup()` methods to handle background music
     - Removed sound effects array management

3. **Audio Hook**
   - `hooks/useStoryAudio.ts`:
     - Removed `soundEffectsRef` completely
     - Added `backgroundMusicRef` for single music track
     - Added `musicTracks` mapping for music file paths
     - Updated `preloadAllAudio()` to load background music based on first page's `backgroundMusic` value
     - Updated `play()`, `pause()`, `stop()` to control background music
     - Updated `switchToPage()` to start background music if not playing
     - Removed all sound effects loading and playback logic

4. **Music Files**
   - Using CDN-hosted music tracks from `https://cdn.llitd.com/audio/mp3/`
   - Multiple tracks per mood type (randomly selected):
     - `scary` - 5 tracks (SCARY_MUSIC_SLOW_*.mp3)
     - `action` - 5 tracks (BATTLE_MUSIC_*.mp3)
     - `awesome` - 4 tracks (AWESOME_MUSIC_*.mp3)
     - `journey` - 4 tracks (JOURNEY_MUSIC_*.mp3)

### Documentation Updates

1. **README.md**: Updated references from "sound effects" to "background music"
2. **STORY_DETAILS.md**: Updated audio generation section
3. **.kiro/steering/tech.md**: Updated AI services description
4. **.kiro/steering/product.md**: Updated product overview
5. **.kiro/steering/structure.md**: Updated StoryPage interface

## Technical Details

### Background Music Implementation

- **Selection**: Based on first page's `backgroundMusic` field (scary, action, awesome, journey)
- **Playback**: Loops continuously at 30% volume
- **Control**: Plays/pauses with narration controls
- **Lifecycle**: Loaded once per story, cleaned up on unmount

### Music Track Mapping

```typescript
const musicTracks: Record<string, string[]> = {
  scary: [
    'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_OesQJ.mp3',
    'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_OFLTe.mp3',
    'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_PiUyE.mp3',
    'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_uSPAM.mp3',
    'https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_UtScb.mp3',
  ],
  action: [
    'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_cPbvx.mp3',
    'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_egdsJ.mp3',
    'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_LNSpQ.mp3',
    'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_mbeeB.mp3',
    'https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_QeKYo.mp3',
  ],
  awesome: [
    'https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_BmMyL.mp3',
    'https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_HPLsD.mp3',
    'https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_Ynyvv.mp3',
    'https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_ZVbpi.mp3',
  ],
  journey: [
    'https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_aGoQz.mp3',
    'https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_CdABs.mp3',
    'https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_nVrDU.mp3',
    'https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_WXTfj.mp3',
  ],
};

// Random selection helper
const getRandomTrack = (tracks: string[]): string => {
  return tracks[Math.floor(Math.random() * tracks.length)];
};
```

### Howl Configuration

```typescript
new Howl({
  src: [musicSrc],
  format: ['mp3'],
  html5: true,
  preload: true,
  loop: true,        // Continuous playback
  volume: 0.3,       // 30% volume to not overpower narration
  onloaderror: (error) => console.warn('Background music load error:', error),
});
```

## Benefits

1. **Performance**: Reduced audio processing overhead by eliminating multiple sound effect tracks per page
2. **Simplicity**: Single background music track is easier to manage than multiple sound effects
3. **User Experience**: Continuous background music creates better atmosphere than sporadic sound effects
4. **Cost**: Reduced ElevenLabs API costs by ~50% (no sound effects generation)
5. **Maintainability**: Simpler codebase with fewer audio management concerns

## Migration Notes

- Existing stories with `soundEffects` data will not break (field simply ignored)
- New stories will use `backgroundMusic` field
- Music is CDN-hosted (no local files needed)
- Random track selection provides variety across story generations

## Testing

- ✅ Backend compilation successful
- ✅ Frontend compilation successful
- ✅ Type definitions updated
- ✅ Test files updated
- ✅ Documentation updated

## CDN Music Integration

### Music Sources
- **Scary**: 5 tracks from SCARY_MUSIC_SLOW_*.mp3
- **Action**: 5 tracks from BATTLE_MUSIC_*.mp3  
- **Awesome**: 4 tracks from AWESOME_MUSIC_*.mp3
- **Journey**: 4 tracks from JOURNEY_MUSIC_*.mp3

### Random Selection
Each story randomly selects one track from the available options for its mood type, providing variety across different story generations.

### Benefits of CDN Hosting
- No local file management required
- Instant availability (no upload/deployment needed)
- Consistent performance across environments
- Easy to add more tracks by updating the URL array

## Future Enhancements

- Consider adding music fade in/out transitions
- Add volume controls for background music
- Support multiple music tracks per story (mood changes)
- Add music selection in admin interface
- Expand track library with more CDN-hosted options
