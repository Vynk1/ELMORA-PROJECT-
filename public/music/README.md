# Focus Music Files

Place the following audio files in this directory for the Pomodoro Focus Session:

## Available Files:

### ✅ `rain.mp3` - **PRIMARY TRACK**
- **Description**: Dark Atmosphere with Rain (5:52 duration)
- **Source**: dark-atmosphere-with-rain-352570.mp3
- **Style**: Atmospheric rain sounds with dark ambient tones
- **Size**: ~13.5MB
- **Format**: MP3
- **Status**: ✅ **READY TO USE**

### 🔄 `lofi1.mp3` - **OPTIONAL**
- **Description**: Lofi Study Beats
- **Recommended Length**: 10-25 minutes (will loop)
- **Style**: Calm, low-tempo instrumental beats
- **Status**: ❌ **PLACEHOLDER** (add file if desired)

### 3. `ocean.mp3`
- **Description**: Ocean Waves
- **Recommended Length**: 10-25 minutes (will loop)  
- **Style**: Gentle ocean waves, white noise
- **Volume**: Pre-normalized to medium volume
- **Format**: MP3, 128kbps minimum

## File Sources Recommendations:

### Free Sources:
- **Freesound.org**: Creative Commons licensed ambient sounds
- **YouTube Audio Library**: Royalty-free music and sounds  
- **Pixabay**: Free music and sound effects
- **Unsplash Audio** (if available)

### Paid Sources:
- **Epidemic Sound**: Professional background music
- **AudioJungle**: Royalty-free music marketplace
- **Pond5**: Stock audio library

## Sample File URLs (for development):
You can use these temporary URLs for testing:

```javascript
// Development/Testing URLs (replace with local files)
const developmentTracks = [
  {
    id: 'lofi',
    name: 'Lofi Study Beats',
    src: 'https://www.soundjay.com/misc/sounds-clips/... (placeholder)'
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    src: 'https://www.soundjay.com/nature/sounds-clips/... (placeholder)'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves', 
    src: 'https://www.soundjay.com/nature/sounds-clips/... (placeholder)'
  }
];
```

## Integration Notes:

- Files are loaded via HTML5 `<audio>` element with `loop` attribute
- Volume is controlled via JavaScript (default 30%)
- Audio auto-plays when focus session starts (user must interact first due to browser policies)
- Falls back gracefully if files are missing
- Uses `preload="metadata"` for fast loading without downloading full files

## Browser Compatibility:

- **MP3**: Supported by all modern browsers
- **OGG Vorbis**: Alternative format for Firefox (optional)
- **WAV**: Uncompressed format (larger file size)

## Performance Tips:

- Keep files under 5MB each for fast loading
- Use 128kbps encoding for good quality/size balance
- Test volume levels to ensure consistency across tracks
- Consider fade-in/fade-out effects for seamless looping