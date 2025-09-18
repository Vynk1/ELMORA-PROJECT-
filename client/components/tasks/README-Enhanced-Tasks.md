# Enhanced Tasks Section - Pomodoro Timer & Focus Music

## Overview

The enhanced Tasks section now includes a comprehensive **Pomodoro Focus Session Card** that combines time management with ambient music to boost productivity. This feature seamlessly integrates with Elmora's existing task system and plant growth mechanics.

## 🌱 Key Features

### Pomodoro Timer
- **25-minute focus sessions** followed by **5-minute breaks**
- **Circular progress visualization** with mood-responsive colors
- **Session counter** and total focus time tracking
- **Automatic phase transitions** with completion notifications

### Focus Music Player
- **3 ambient tracks**: Lofi beats, rain sounds, ocean waves
- **Auto-play during focus sessions** (respects browser policies)
- **Volume control** with smooth slider interface
- **Track switching** and seamless looping

### Plant Growth Integration
- **Automatic task creation** for completed focus sessions
- **Progressive plant growth** (20% per session, up to 100%)
- **Point rewards** (10 points per completed session)
- **Spline orb updates** with data attributes for 3D visualization

### Accessibility & Performance
- **Reduced motion support** with static fallbacks
- **Keyboard navigation** throughout all controls
- **Screen reader friendly** with proper ARIA labels
- **Mobile responsive** with touch-optimized controls

## 📁 File Structure

```
client/
├── components/
│   └── tasks/
│       ├── PomodoroCard.tsx          # Main Pomodoro component
│       └── README-Enhanced-Tasks.md   # This documentation
├── pages/
│   └── Tasks.tsx                     # Updated Tasks page with PomodoroCard
├── styles/
│   └── pomodoro.css                  # Enhanced CSS animations and styling
├── contexts/
│   └── TaskContext.tsx               # Updated with completed task support
└── utils/
    └── reactBitsLoader.tsx           # React Bits effects integration

public/
└── music/                            # Focus music files
    ├── lofi1.mp3                     # Lofi study beats
    ├── rain.mp3                      # Gentle rain sounds
    ├── ocean.mp3                     # Ocean waves
    ├── README.md                     # Music file instructions
    └── placeholder-audio.txt         # Development setup guide
```

## 🎨 Design System Integration

### Mood-Responsive Colors
The Pomodoro card automatically adapts to the current mood:

- **Sad**: Gray tones with subtle gradients
- **Mid**: Warm amber/yellow gradients
- **Amazing**: Vibrant emerald/teal gradients
- **Calm**: Cool blue/indigo gradients
- **Default**: Purple/pink/rose gradients

### Visual Elements
- **Frosted glass effects** with backdrop-blur
- **Subtle shadows and borders** with white/opacity overlays
- **Smooth transitions** and hover states
- **Consistent border radius** (rounded-2xl, rounded-3xl)

## ⚙️ Technical Implementation

### Component Architecture

```tsx
interface PomodoroCardProps {
  onFocusSessionComplete: (sessionData: { duration: number; timestamp: Date }) => void;
  onProgressUpdate: (progress: number) => void;
  currentMood?: 'sad' | 'mid' | 'amazing' | 'content' | 'calm';
}
```

### State Management
- **Pomodoro State**: Timer, phase, session count
- **Music State**: Playing status, track index, volume
- **UI State**: Completion messages, loading states

### React Bits Effects Integration
```tsx
// Lazy-loaded effects with accessibility guards
const VariableProximity = loadReactBit('VariableProximity');
const CountUp = loadReactBit('CountUp');
const TrueFocus = loadReactBit('TrueFocus');
const ClickSpark = loadReactBit('ClickSpark');
```

## 🎵 Music Integration

### Audio Setup
1. Place 3 MP3 files in `/public/music/`:
   - `lofi1.mp3` - Lofi study beats
   - `rain.mp3` - Gentle rain sounds  
   - `ocean.mp3` - Ocean waves

2. Files should be:
   - 10-25 minutes long (will loop)
   - Pre-normalized volume
   - 128kbps MP3 format minimum

### Player Features
- **HTML5 Audio API** with loop support
- **Volume control** (default 30%)
- **Track switching** with smooth transitions
- **Graceful degradation** if files are missing

## 🌐 Spline Integration Ready

### Orb Placeholder
```html
<div 
  id="spline-pomodoro-orb" 
  data-spline="pomodoro-orb"
  data-phase={currentPhase}
  data-remaining={timeRemaining}
>
```

### PostMessage Events
```javascript
// Timer state updates
window.postMessage({
  type: 'pomodoro',
  state: 'focus' | 'break',
  remaining: timeInSeconds
}, '*');

// Plant growth updates
window.postMessage({
  type: 'updateProgress',
  value: progressPercentage
}, '*');
```

## 🎯 Integration Points

### Task System Integration
```tsx
// Automatically creates completed focus session tasks
addTodo(
  `🧘 Focus Session - ${duration} min (${timestamp})`,
  'wellness',
  true // Mark as completed
);
```

### Points System Integration
```tsx
// Awards points for completed sessions
const sessionBonus = 10;
onPointsUpdate(userPoints + sessionBonus);
```

### Plant Growth Integration
```tsx
// Progressive growth: 20% per session, max 100%
const newProgress = Math.min(100, sessionCount * 20);
onProgressUpdate(newProgress);
```

## 🧪 Testing Guide

### Functionality Testing
1. **Timer Operations**:
   - Start/pause/reset functionality
   - Automatic phase transitions (focus → break → focus)
   - Session counting and time accumulation

2. **Music Player**:
   - Play/pause controls
   - Track switching
   - Volume adjustment
   - Looping behavior

3. **Integration Testing**:
   - Task creation on focus completion
   - Points awarded correctly
   - Plant growth progression
   - Spline data attribute updates

### Accessibility Testing
1. **Keyboard Navigation**:
   - Tab through all controls
   - Enter/Space activation
   - Volume slider keyboard control

2. **Screen Reader Testing**:
   - Timer announcements (aria-live)
   - Button labels and descriptions
   - Phase change notifications

3. **Motion Preferences**:
   - Enable "Reduce motion" in OS settings
   - Verify animations are disabled
   - Confirm fallback states work

### Performance Testing
1. **Mobile Performance**:
   - Touch interactions work smoothly
   - No cursor effects on touch devices
   - Responsive layout at all breakpoints

2. **Audio Performance**:
   - Files load without blocking UI
   - Memory usage remains stable
   - Graceful handling of missing files

## 📱 Mobile Considerations

### Responsive Design
- **Smaller orb size** (48px vs 64px)
- **Reduced timer font size** (2.5rem vs 4xl)
- **Compact progress circle** (150px vs 200px)
- **Touch-friendly controls** (44px minimum touch targets)

### Mobile-Specific Features
- **Auto-play restrictions**: Music requires user interaction first
- **Background playback**: Continues when app is backgrounded
- **Battery optimization**: Pauses when device is idle

## 🔧 Configuration Options

### Timer Customization
```tsx
// Default durations (in minutes)
const DEFAULT_FOCUS_TIME = 25;
const DEFAULT_BREAK_TIME = 5;
const LONG_BREAK_TIME = 15; // After 4 sessions (future feature)
```

### Music Tracks
```tsx
// Easily add new tracks
const musicTracks: MusicTrack[] = [
  {
    id: 'custom',
    name: 'Custom Track Name',
    src: '/music/custom-track.mp3'
  }
];
```

### Growth Rate
```tsx
// Customize plant growth progression
const GROWTH_PER_SESSION = 20; // Percentage points per session
const MAX_GROWTH = 100;        // Maximum growth percentage
```

## 🚀 Future Enhancements

### Planned Features
- **Customizable timer durations** (15/20/25/30 min focus sessions)
- **Long break intervals** (15 min break after 4 sessions)
- **Focus session statistics** (daily/weekly/monthly views)
- **Achievement system** (streak tracking, milestones)
- **Custom music uploads** (user's own focus tracks)

### Advanced Integrations
- **Calendar integration** (schedule focus sessions)
- **Notification system** (desktop/push notifications)
- **Team focus sessions** (synchronized sessions with friends)
- **Advanced Spline interactions** (3D plant responds to focus intensity)

## 📄 Usage Examples

### Basic Usage
```tsx
<PomodoroCard 
  onFocusSessionComplete={handleFocusSessionComplete}
  onProgressUpdate={handleProgressUpdate}
  currentMood="amazing"
/>
```

### With Custom Handlers
```tsx
const handleFocusSessionComplete = (sessionData) => {
  // Custom completion logic
  console.log(`Focus session completed: ${sessionData.duration}min`);
  updatePlantGrowth();
  awardPoints(10);
};

const handleProgressUpdate = (progress) => {
  // Custom progress handling
  updateSplineVisualization(progress);
  saveProgressToLocalStorage(progress);
};
```

This enhanced Tasks section transforms the basic task management into an engaging, productive experience that combines time management, ambient focus music, and gamified plant growth mechanics.