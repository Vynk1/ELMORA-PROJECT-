import React, { useState, useEffect } from 'react';

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  className?: string;
  disabled?: boolean;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  interval = 3000,
  className = '',
  disabled = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (disabled || texts.length <= 1) return;

    const rotateInterval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 150); // Brief fade out before changing text
    }, interval);

    return () => clearInterval(rotateInterval);
  }, [texts, interval, disabled]);

  if (disabled) {
    return <span className={className}>{texts.join(' • ')}</span>;
  }

  return (
    <span 
      className={`transition-opacity duration-150 ${className}`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? '0' : '2px'})`
      }}
    >
      {texts[currentIndex]}
    </span>
  );
};

export default RotatingText;