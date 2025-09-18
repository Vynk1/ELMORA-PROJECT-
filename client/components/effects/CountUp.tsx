import React, { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  disabled?: boolean;
  onComplete?: () => void;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
  disabled = false,
  onComplete,
}) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (disabled) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          setIsVisible(true);
          hasStartedRef.current = true;
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, disabled]);

  useEffect(() => {
    if (!isVisible || disabled) return;

    const startTime = Date.now();
    const difference = end - start;

    const animateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (difference * easeOut);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
        onComplete?.();
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible, start, end, duration, disabled, onComplete]);

  const formatNumber = (num: number) => {
    return num.toFixed(decimals);
  };

  return (
    <span
      ref={elementRef}
      className={className}
      aria-live="polite"
      aria-label={`${prefix}${formatNumber(count)}${suffix}`}
    >
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CountUp;