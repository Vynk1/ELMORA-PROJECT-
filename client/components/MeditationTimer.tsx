import React, { useState, useEffect } from 'react';

interface MeditationTimerProps {
  totalSeconds: number;
  isActive: boolean;
  onTimeUpdate?: (elapsedMinutes: number, remainingTime: string) => void;
  className?: string;
  disabled?: boolean;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({
  totalSeconds,
  isActive,
  onTimeUpdate,
  className = '',
  disabled = false
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !disabled) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const newElapsed = Math.min(prev + 1, totalSeconds);
          const remaining = Math.max(0, totalSeconds - newElapsed);
          const elapsedMinutes = Math.floor(newElapsed / 60);
          
          const mins = Math.floor(remaining / 60);
          const secs = remaining % 60;
          const remainingTimeString = `${mins}:${secs.toString().padStart(2, '0')}`;
          
          onTimeUpdate?.(elapsedMinutes, remainingTimeString);
          
          return newElapsed;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, totalSeconds, disabled, onTimeUpdate]);

  // Reset when totalSeconds changes (new session)
  useEffect(() => {
    setElapsedSeconds(0);
  }, [totalSeconds]);

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={className}>
      <div className="text-3xl font-light mb-2" aria-live="polite">
        {formatTime(remainingSeconds)}
      </div>
      <div className="text-sm opacity-70" aria-live="polite">
        {elapsedMinutes} minute{elapsedMinutes !== 1 ? 's' : ''} completed
      </div>
    </div>
  );
};

export default MeditationTimer;