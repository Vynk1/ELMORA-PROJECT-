import React, { useEffect, useState, useCallback } from 'react';

interface ClickSparkProps {
  children: React.ReactNode;
  trigger?: number; // Changed to number for trigger counting
  disabled?: boolean;
  onComplete?: () => void;
  className?: string;
  color?: string;
  size?: number;
  duration?: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  trigger = 0,
  disabled = false,
  onComplete,
  className = '',
  color = '#10b981',
  size = 20,
  duration = 800,
}) => {
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number; rotation: number; delay: number }>>([]);
  const [isActive, setIsActive] = useState(false);

  const createSparks = useCallback(() => {
    if (disabled) return;

    const sparkCount = 6;
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      id: Date.now() + i,
      x: Math.cos((i * Math.PI * 2) / sparkCount) * 15,
      y: Math.sin((i * Math.PI * 2) / sparkCount) * 15,
      rotation: Math.random() * 360,
      delay: Math.random() * 100,
    }));

    setSparks(newSparks);
    setIsActive(true);

    setTimeout(() => {
      setIsActive(false);
      setSparks([]);
      onComplete?.();
    }, duration);
  }, [disabled, duration, onComplete]);

  useEffect(() => {
    if (trigger > 0) {
      createSparks();
    }
  }, [trigger, createSparks]);

  return (
    <div className={`relative ${className}`}>
      {children}
      {isActive && !disabled && (
        <div className="absolute inset-0 pointer-events-none">
      <style>
        {`
          @keyframes clickSpark {
            0% {
              opacity: 1;
              transform: translate(0, 0) scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
            100% {
              opacity: 0;
              transform: scale(0);
            }
          }
        `}
      </style>
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute top-1/2 left-1/2"
          style={{
            width: `${size / 4}px`,
            height: `${size / 4}px`,
            backgroundColor: color,
            borderRadius: '50%',
            transform: `translate(-50%, -50%) translate(${spark.x}px, ${spark.y}px)`,
            animation: `clickSpark ${duration}ms ease-out forwards`,
            animationDelay: `${spark.delay}ms`,
          }}
        />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClickSpark;