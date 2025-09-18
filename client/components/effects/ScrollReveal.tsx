import React, { useEffect, useState, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  disabled?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  duration = 0.25,
  delay = 0,
  distance = 30,
  className = '',
  disabled = false,
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, disabled]);

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}s`,
        transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;