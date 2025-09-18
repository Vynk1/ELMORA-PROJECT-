import React, { useState, useEffect, lazy, Suspense } from 'react';

// Lazy load CountUp effect
const CountUp = lazy(() => import('../components/effects/CountUp'));

interface MeditationTimerProps {
  targetDuration: number; // Duration in seconds
  onComplete: () => void;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({ 
  targetDuration, 
  onComplete 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Timer logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isActive && currentTime < targetDuration) {
      intervalId = setInterval(() => {
        setCurrentTime(time => {
          const newTime = time + 1;
          if (newTime >= targetDuration) {
            setIsActive(false);
            onComplete();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, currentTime, targetDuration, onComplete]);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setCurrentTime(0);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercent = (currentTime / targetDuration) * 100;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
      {/* Timer Display */}
      <div className="mb-8">
        <div className="text-6xl font-light text-gray-800 mb-4" aria-live="polite">
          {/* Live-updating CountUp for current time */}
          <Suspense fallback={formatTime(currentTime)}>
            <CountUp 
              end={currentTime}
              duration={0} // No animation, immediate update for live timer
              disabled={prefersReducedMotion}
              formatter={(value: number) => formatTime(Math.floor(value))}
            />
          </Suspense>
        </div>
        
        <div className="text-lg text-gray-600 mb-2">
          of {formatTime(targetDuration)}
        </div>

        {/* Progress Circle */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercent / 100)}`}
              className="transition-all duration-300 ease-in-out"
            />
          </svg>
          
          {/* Progress percentage display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-semibold text-primary" aria-live="polite">
              <Suspense fallback={`${Math.round(progressPercent)}%`}>
                <CountUp 
                  end={progressPercent}
                  duration={0}
                  disabled={prefersReducedMotion}
                  formatter={(value: number) => `${Math.round(value)}%`}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        {!isActive && currentTime === 0 && (
          <button
            onClick={startTimer}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
          >
            Start Meditation
          </button>
        )}
        
        {!isActive && currentTime > 0 && currentTime < targetDuration && (
          <>
            <button
              onClick={startTimer}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
            >
              Resume
            </button>
            <button
              onClick={resetTimer}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </>
        )}
        
        {isActive && (
          <button
            onClick={pauseTimer}
            className="bg-yellow-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-yellow-600 transition-colors"
          >
            Pause
          </button>
        )}
        
        {currentTime >= targetDuration && (
          <button
            onClick={resetTimer}
            className="bg-green-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-green-600 transition-colors"
          >
            Start New Session
          </button>
        )}
      </div>

      {/* Session Status */}
      <div className="mt-6 text-sm text-gray-600">
        {isActive && 'Session in progress...'}
        {!isActive && currentTime > 0 && currentTime < targetDuration && 'Session paused'}
        {currentTime >= targetDuration && '🎉 Session complete! Well done!'}
        {!isActive && currentTime === 0 && 'Ready to begin'}
      </div>
    </div>
  );
};

// Usage example in a meditation page component
const MeditationPageExample: React.FC = () => {
  const [sessionDuration, setSessionDuration] = useState(300); // 5 minutes default
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const handleSessionComplete = () => {
    setShowCompletionMessage(true);
    setTimeout(() => setShowCompletionMessage(false), 3000);
    // Here you could update user stats, save session to journal, etc.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 pt-8">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-4">
            Mindful Meditation
          </h1>
          <p className="text-gray-600">
            Find your center with a guided meditation session
          </p>
        </div>

        {/* Duration Selector */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Session Duration</h3>
          <div className="flex space-x-4">
            {[180, 300, 600, 900].map(duration => (
              <button
                key={duration}
                onClick={() => setSessionDuration(duration)}
                className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                  sessionDuration === duration
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {Math.floor(duration / 60)}min
              </button>
            ))}
          </div>
        </div>

        {/* Timer Component */}
        <MeditationTimer
          targetDuration={sessionDuration}
          onComplete={handleSessionComplete}
        />

        {/* Completion Message */}
        {showCompletionMessage && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-medium">
              Meditation complete! 🧘‍♀️ +10 mindfulness points
            </div>
          </div>
        )}

        {/* Breathing Guide Placeholder */}
        <div className="mt-12 text-center">
          <div 
            id="spline-breathing-placeholder" 
            data-spline="breathing-shape"
            className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center opacity-60"
          >
            {/* Reserved for Spline 3D breathing animation */}
            <span className="text-gray-500 text-sm">🌸 Breathe</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Follow the gentle rhythm above
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeditationPageExample;

/*
Key features of this meditation timer implementation:

1. **Live Timer Updates**: CountUp with duration={0} for immediate updates
2. **Progress Visualization**: Circular progress with animated stroke
3. **Accessibility**: aria-live regions for screen reader updates
4. **Reduced Motion Support**: Respects user motion preferences
5. **State Management**: Handles start, pause, resume, reset states
6. **Format Functions**: Custom formatter for MM:SS display
7. **Completion Handling**: Callback for session completion events
8. **Spline Placeholder**: Reserved space for 3D breathing guide
9. **Responsive Design**: Works on all screen sizes
10. **Performance**: Lazy loading for the CountUp component

Integration points:
- Timer state can be saved to user's meditation history
- Completion triggers could award points/badges
- Could integrate with journal for post-session reflection
- Breathing guide could sync with timer for guided sessions
*/