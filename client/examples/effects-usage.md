# React Bits Effects - Usage Examples

This document demonstrates how the React Bits effects have been integrated into the NUDGY app pages with accessibility and reduced motion considerations.

## Journal Page Enhancements

### 1. TextCursor for Empty State
Shows a typing cursor effect to encourage users to start writing:

```tsx
// In Journal.tsx - Empty state
<TextCursor 
  text="No entries yet — write one thing you're grateful for." 
  speed={50} 
  disabled={prefersReducedMotion}
  className="text-gray-600"
/>
```

### 2. DecryptedText for AI Summary
Reveals AI insights character by character for engaging reveal:

```tsx
// In Journal.tsx - AI Summary section
<DecryptedText 
  text={selectedEntry.aiSummary}
  speed={30}
  className="text-sm text-blue-700 leading-relaxed"
  disabled={prefersReducedMotion}
/>
```

### 3. CountUp for Statistics
Animates numbers counting up for entry statistics:

```tsx
// In Journal.tsx - Stats cards
<CountUp 
  end={entries.length} 
  duration={1000} 
  disabled={prefersReducedMotion} 
/>
```

### 4. FallingText for Save Confirmation
Shows a celebratory message that falls down after saving:

```tsx
// In Journal.tsx - Save confirmation
<FallingText 
  trigger={showSavedMessage} 
  duration={1.8} 
  className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-medium"
>
  Saved — well done! ✨
</FallingText>
```

## Community/Friends Page Enhancements

### 1. RotatingText Tagline
Rotates between motivational words in the header:

```tsx
// In Friends.tsx - Community header
<RotatingText 
  words={['Share', 'Support', 'Grow']} 
  interval={2500} 
  disabled={prefersReducedMotion}
  className="text-primary"
/>
```

### 2. Magnet Effect for Profile Cards
Adds subtle hover magnetism to friend profile cards:

```tsx
// In Friends.tsx - Friend match cards
<Magnet strength={10} disabled={prefersReducedMotion}>
  <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
    {/* Friend card content */}
  </div>
</Magnet>
```

### 3. ClickSpark for Interactive Buttons
Creates spark effects when sending friend requests:

```tsx
// In Friends.tsx - Send friend request button
<ClickSpark 
  trigger={sparkTrigger} 
  disabled={prefersReducedMotion}
  color="#10b981"
>
  <button onClick={handleSendRequest}>
    {requestSent ? 'Request Sent! ✓' : 'Send Friend Request'}
  </button>
</ClickSpark>
```

### 4. ScrollReveal for Card Animation
Reveals cards as they scroll into view:

```tsx
// In Friends.tsx - Match cards
<ScrollReveal duration={0.6} delay={0.1} disabled={prefersReducedMotion}>
  <Magnet strength={10} disabled={prefersReducedMotion}>
    {/* Card content */}
  </Magnet>
</ScrollReveal>
```

## Rewards Page Enhancements

### 1. CountUp for Points Display
Animates the points counter in the header:

```tsx
// In Rewards.tsx - Points display
<CountUp 
  end={userPoints} 
  duration={1200} 
  disabled={prefersReducedMotion}
/>
```

### 2. ScrollReveal for Staggered Card Animation
Reveals achievement badges with staggered delays:

```tsx
// In Rewards.tsx - Achievement badges
<ScrollReveal duration={0.4} delay={0.6} disabled={prefersReducedMotion}>
  <div className="text-center">
    <div className="w-16 h-16 bg-yellow-500 rounded-full">
      <span className="text-2xl">🔥</span>
    </div>
    <h3>Week Warrior</h3>
  </div>
</ScrollReveal>
```

## Accessibility Features

### Reduced Motion Support
All effects check for `prefers-reduced-motion: reduce` and disable animations:

```tsx
// Check for reduced motion preference
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setPrefersReducedMotion(mediaQuery.matches);
  
  const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
  mediaQuery.addEventListener('change', handleMotionChange);
  
  return () => mediaQuery.removeEventListener('change', handleMotionChange);
}, []);
```

### Screen Reader Support
CountUp components include `aria-live="polite"` for screen reader announcements:

```tsx
<div className="text-2xl font-bold text-primary mb-1" aria-live="polite">
  <CountUp end={entries.length} duration={1000} disabled={prefersReducedMotion} />
</div>
```

### Fallback Content
All effects are lazy-loaded with fallbacks for immediate display:

```tsx
<Suspense fallback="Share • Support • Grow">
  <RotatingText 
    words={['Share', 'Support', 'Grow']} 
    interval={2500} 
    disabled={prefersReducedMotion}
  />
</Suspense>
```

## Spline 3D Placeholders

Reserved DOM elements for future Spline 3D scenes:

```tsx
// Journal notebook with petals
<div 
  id="spline-journal-placeholder" 
  data-spline="notebook-petals"
  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 pointer-events-none opacity-60"
>
  {/* Reserved slot for Spline 3D notebook with petals */}
</div>

// Rewards gift box
<div 
  id="spline-reward-placeholder" 
  data-spline="gift-box"
  className="absolute -top-4 -right-4 w-12 h-12 pointer-events-none opacity-60"
>
  {/* Reserved slot for Spline 3D gift box */}
</div>
```

## Performance Considerations

1. **Lazy Loading**: All effects are lazy-loaded to reduce initial bundle size
2. **Conditional Rendering**: Effects only render when needed (trigger states)
3. **Reduced Motion**: Respects user preferences for accessibility
4. **Fallbacks**: Immediate fallback content while effects load
5. **Optimal Delays**: Staggered animations prevent overwhelming users

## Integration Best Practices

1. **Consistent Timing**: Use similar duration ranges across effects
2. **Color Coordination**: Match spark and animation colors to brand palette  
3. **Context Appropriate**: Effects match the emotional context of the action
4. **Non-Intrusive**: Effects enhance rather than distract from content
5. **Progressive Enhancement**: Core functionality works without effects

This integration demonstrates thoughtful use of micro-interactions to enhance user engagement while maintaining accessibility and performance standards.