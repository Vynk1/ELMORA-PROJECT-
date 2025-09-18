import React, { useEffect, useState, useRef, ReactNode } from 'react';

interface ScrollFloatProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  disabled?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  duration = 0.6,
  delay = 0,
  distance = 20,
  className = '',
  disabled = false,
  direction = 'up',
  scale = 1.02,
}) => {
  const [isVisible, setIsVisible] = useState(disabled);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, disabled]);

  const getTransform = () => {
    if (isVisible) {
      return `translate(0, 0) scale(1)`;
    }

    const translateMap = {
      up: `translateY(${distance}px)`,
      down: `translateY(-${distance}px)`,
      left: `translateX(${distance}px)`,
      right: `translateX(-${distance}px)`,
    };

    return `${translateMap[direction]} scale(${1 / scale})`;
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}s`,
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0)' : 'blur(2px)',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollFloat;