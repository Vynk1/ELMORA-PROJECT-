import React, { useState, ReactNode } from 'react';

interface TrueFocusProps {
  children: ReactNode;
  scale?: number;
  glowColor?: string;
  className?: string;
  disabled?: boolean;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  children,
  scale = 1.03,
  glowColor = 'rgba(59, 130, 246, 0.5)',
  className = '',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        transform: isFocused ? `scale(${scale})` : 'scale(1)',
        filter: isFocused ? `drop-shadow(0 0 20px ${glowColor})` : 'none',
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export default TrueFocus;