import React, { useEffect, useState, useRef } from 'react';

interface TextTrailProps {
  text: string;
  speed?: number;
  stagger?: number;
  className?: string;
}

const TextTrail: React.FC<TextTrailProps> = ({
  text,
  speed = 1,
  stagger = 0.1,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const chars = text.split('');

  return (
    <div ref={containerRef} className={className}>
      <p>
        {chars.map((char, index) => (
          <span
            key={index}
            className={`inline-block transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{
              transitionDelay: `${index * stagger / speed}s`,
              transitionDuration: '0.8s',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
    </div>
  );
};

export default TextTrail;