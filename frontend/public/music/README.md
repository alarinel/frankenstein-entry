# Background Music - CDN Hosted

This directory is a placeholder. Background music is now served from a CDN and does not require local files.

## Music Sources

Background music is loaded from hosted CDN URLs and randomly selected from available tracks:

### Scary Music (5 tracks)
- Dark, suspenseful music for scary/mysterious moments
- Hosted at: `https://cdn.llitd.com/audio/mp3/SCARY_MUSIC_SLOW_*.mp3`

### Action Music (5 tracks)
- Energetic, fast-paced battle music for action sequences
- Hosted at: `https://cdn.llitd.com/audio/mp3/BATTLE_MUSIC_*.mp3`

### Awesome Music (4 tracks)
- Triumphant, uplifting music for victories and achievements
- Hosted at: `https://cdn.llitd.com/audio/mp3/AWESOME_MUSIC_*.mp3`

### Journey Music (4 tracks)
- Adventurous, exploratory music for travel and discovery
- Hosted at: `https://cdn.llitd.com/audio/mp3/JOURNEY_MUSIC_*.mp3`

## Music Specifications

- **Format**: MP3
- **Source**: CDN hosted (https://cdn.llitd.com)
- **Selection**: Random track chosen from available options per music type
- **Volume**: Played at 30% volume (0.3)
- **Playback**: Loops continuously

## Usage

The background music is:
1. Selected automatically based on the story's mood (first page's `backgroundMusic` field)
2. Randomly chosen from available tracks for that mood type
3. Preloaded when the story loads
4. Plays continuously throughout the reading experience
5. Loops seamlessly alongside narration at lower volume

## Technical Details

Music URLs are defined in `frontend/src/hooks/useStoryAudio.ts`:

```typescript
const musicTracks: Record<string, string[]> = {
  scary: [...],    // 5 tracks
  action: [...],   // 5 tracks
  awesome: [...],  // 4 tracks
  journey: [...],  // 4 tracks
};
```

## Notes

- Music files are served from CDN (no local storage needed)
- One random track selected per story based on mood
- Music pauses/resumes with narration controls
- Music stops when leaving the reading page
- No licensing concerns (CDN hosted content)
