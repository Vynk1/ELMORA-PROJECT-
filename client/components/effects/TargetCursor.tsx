import React, { useEffect, useState, useRef, ReactNode } from 'react';

interface TargetCursorProps {
  children: ReactNode;
  disabled?: boolean;
  color?: string;
  size?: number;
  className?: string;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  children,
  disabled = false,
  color = '#10b981',
  size = 24,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleFocusIn = () => setIsFocused(true);
    const handleFocusOut = () => setIsFocused(false);

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);
    };
  }, [disabled]);

  const isActive = isHovered || isFocused;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      {!disabled && isActive && (
        <>
          <style>
            {`
              @keyframes targetPulse {
                0%, 100% {
                  box-shadow: 0 0 0 2px ${color}40, 0 0 ${size}px ${color}20;
                }
                50% {
                  box-shadow: 0 0 0 3px ${color}60, 0 0 ${size + 8}px ${color}30;
                }
              }
            `}
          </style>
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              boxShadow: `0 0 0 2px ${color}40, 0 0 ${size}px ${color}20`,
              animation: 'targetPulse 2s ease-in-out infinite',
            }}
          />
        </>
      )}
    </div>
  );
};

export default TargetCursor;