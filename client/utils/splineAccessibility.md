# Spline 3D Component Accessibility Guidelines

## Overview
This document outlines accessibility best practices for Spline 3D components used in the NUDGY application, ensuring compliance with WCAG 2.1 guidelines and providing an inclusive user experience.

## Placeholder Policy

### When Spline Components Are Not Available
If Spline 3D components fail to load or are not supported, the application must provide meaningful fallbacks:

```jsx
// Example implementation
function SplinePlaceholder({ 
  ariaLabel, 
  description, 
  fallbackContent,
  className = "w-full h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center" 
}) {
  return (
    <div 
      className={className}
      role="img" 
      aria-label={ariaLabel}
      aria-describedby="spline-description"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-primary/60" fill="currentColor" viewBox="0 0 20 20">
            {/* Icon representing the 3D content */}
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">
            {fallbackContent || "3D Interactive Content"}
          </p>
          <p id="spline-description" className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Accessibility Requirements

### 1. Reduced Motion Compliance
- **MUST** respect `prefers-reduced-motion` media query
- **MUST** disable or reduce animations when user prefers reduced motion
- **SHOULD** provide static alternatives for dynamic content

```jsx
// Implementation example
const prefersReducedMotion = useReducedMotion();

<Spline
  scene={sceneUrl}
  autoRotate={!prefersReducedMotion}
  animation={prefersReducedMotion ? 'none' : 'auto'}
/>
```

### 2. Keyboard Navigation
- **MUST** be keyboard navigable where interactive
- **MUST** provide focus indicators
- **SHOULD** support standard keyboard shortcuts (Tab, Enter, Space)

### 3. Screen Reader Support
- **MUST** include descriptive `aria-label` attributes
- **MUST** provide `role` attributes where appropriate
- **SHOULD** include `aria-describedby` for detailed descriptions
- **MUST** announce state changes for interactive elements

```jsx
<Spline
  scene={sceneUrl}
  aria-label="Interactive 3D model of task progress visualization"
  aria-describedby="3d-model-description"
  role="img"
/>
<div id="3d-model-description" className="sr-only">
  A 3D visualization showing your task completion progress as an interactive sphere. 
  Completed tasks appear as glowing segments around the sphere.
</div>
```

### 4. Performance Considerations
- **MUST** lazy load Spline components
- **SHOULD** provide loading states with progress indicators
- **MUST** handle loading failures gracefully
- **SHOULD** preload critical 3D assets

```jsx
const SplineLazy = lazy(() => import('@splinetool/react-spline'));

function OptimizedSpline({ scene, ...props }) {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  const [loadFailed, setLoadFailed] = useState(false);
  
  if (loadFailed) {
    return <SplinePlaceholder {...props} />;
  }
  
  return (
    <div ref={ref}>
      {isVisible && (
        <Suspense fallback={<SplineLoadingPlaceholder />}>
          <SplineLazy 
            scene={scene}
            onError={() => setLoadFailed(true)}
            {...props}
          />
        </Suspense>
      )}
    </div>
  );
}
```

### 5. Color and Contrast
- **MUST** maintain WCAG AA contrast ratios (4.5:1 for normal text)
- **SHOULD** provide high contrast mode support
- **MUST NOT** rely solely on color to convey information

### 6. Touch and Mobile Support
- **MUST** support touch gestures on mobile devices
- **MUST** maintain minimum touch target size (44x44 CSS pixels)
- **SHOULD** provide alternative interaction methods

## Implementation Checklist

### Before Adding Spline Components:
- [ ] Implement fallback placeholder component
- [ ] Add loading states and error handling
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Test with keyboard-only navigation
- [ ] Verify reduced motion compliance
- [ ] Check mobile touch interaction
- [ ] Validate contrast ratios
- [ ] Test loading performance

### Code Review Requirements:
- [ ] All interactive 3D elements have proper ARIA labels
- [ ] Fallback placeholders are meaningful and descriptive
- [ ] Loading states provide clear progress indication
- [ ] Error states offer actionable alternatives
- [ ] Reduced motion preferences are respected
- [ ] Performance impact is minimized

## Common Use Cases in NUDGY

### 1. Dashboard 3D Visualization
```jsx
<OptimizedSpline
  scene="/models/dashboard-progress.splinecode"
  aria-label="Your daily progress visualization in 3D"
  description="Interactive 3D chart showing today's completed tasks and goals"
  fallbackContent="Daily Progress Chart"
  className="w-full h-80 rounded-xl"
/>
```

### 2. Friend Connection Animation
```jsx
<OptimizedSpline
  scene="/models/connection-animation.splinecode"
  aria-label="Friend connection animation"
  description="Animated visualization of making a new friend connection"
  fallbackContent="Friend Connection Illustration"
  className="w-32 h-32 mx-auto"
/>
```

### 3. Onboarding 3D Guide
```jsx
<OptimizedSpline
  scene="/models/onboarding-guide.splinecode"
  aria-label="Interactive onboarding tutorial"
  description="Step-by-step 3D guide for setting up your profile"
  fallbackContent="Profile Setup Guide"
  className="w-full h-96"
/>
```

## Testing Tools
- **Screen Readers**: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
- **Keyboard Testing**: Tab through all interactive elements
- **Motion Testing**: Enable "Reduce motion" in OS accessibility settings
- **Performance**: Lighthouse accessibility audit
- **Color**: WebAIM Contrast Checker

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Spline Documentation](https://docs.spline.design/)
- [WebAIM Accessibility Guide](https://webaim.org/)