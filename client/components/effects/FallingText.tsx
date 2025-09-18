import React, { useEffect, useState, ReactNode } from 'react';

interface FallingTextProps {
  children: ReactNode;
  trigger?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
  disabled?: boolean;
  fallDistance?: number;
  onComplete?: () => void;
}

const FallingText: React.FC<FallingTextProps> = ({
  children,
  trigger = true,
  duration = 1.5,
  delay = 0,
  className = '',
  disabled = false,
  fallDistance = 30,
  onComplete,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (disabled || !trigger) return;

    const showTimer = setTimeout(() => {
      setShouldShow(true);
      setIsAnimating(true);
    }, delay * 1000);

    const hideTimer = setTimeout(() => {
      setIsAnimating(false);
      setShouldShow(false);
      onComplete?.();
    }, (delay + duration + 0.5) * 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [trigger, delay, duration, disabled, onComplete]);

  if (disabled || !shouldShow) return null;

  return (
    <div
      className={`inline-block transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}s`,
        transform: isAnimating 
          ? `translateY(${fallDistance}px) rotate(2deg)` 
          : 'translateY(-10px) rotate(-1deg)',
        opacity: isAnimating ? 0 : 1,
        filter: isAnimating ? 'blur(1px)' : 'blur(0)',
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default FallingText;