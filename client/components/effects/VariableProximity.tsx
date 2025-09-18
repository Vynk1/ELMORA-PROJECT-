import React, { useEffect, useRef, useState } from 'react';

interface VariableProximityProps {
  label: string;
  radius?: number;
  className?: string;
}

const VariableProximity: React.FC<VariableProximityProps> = ({
  label,
  radius = 100,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        
        if (distance < radius) {
          setMousePos({
            x: (e.clientX - centerX) / radius,
            y: (e.clientY - centerY) / radius,
          });
          setIsHovered(true);
        } else {
          setIsHovered(false);
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [radius]);

  const words = label.split(' ');

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{ willChange: 'transform' }}
    >
      <h1 className="relative">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-4 last:mr-0">
            {word.split('').map((char, charIndex) => {
              const globalIndex = wordIndex * 20 + charIndex; // Rough estimate for stagger
              const offsetX = isHovered ? mousePos.x * (5 + Math.sin(globalIndex) * 2) : 0;
              const offsetY = isHovered ? mousePos.y * (3 + Math.cos(globalIndex) * 1.5) : 0;
              const scale = isHovered ? 1 + (Math.abs(mousePos.x) + Math.abs(mousePos.y)) * 0.05 : 1;
              
              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all duration-300 ease-out"
                  style={{
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                    filter: isHovered ? `blur(${Math.random() * 0.5}px)` : 'none',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default VariableProximity;