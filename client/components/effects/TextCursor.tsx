import React, { useEffect, useState } from 'react';

interface TextCursorProps {
  text: string;
  className?: string;
  cursorChar?: string;
  blinkSpeed?: number;
  disabled?: boolean;
}

const TextCursor: React.FC<TextCursorProps> = ({
  text,
  className = '',
  cursorChar = '|',
  blinkSpeed = 1000,
  disabled = false,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (disabled) {
      setDisplayText(text);
      setShowCursor(false);
      return;
    }

    let typingTimeout: NodeJS.Timeout;
    let currentIndex = 0;

    const typeText = () => {
      setIsTyping(true);
      if (currentIndex < text.length) {
        setDisplayText(text.substring(0, currentIndex + 1));
        currentIndex++;
        typingTimeout = setTimeout(typeText, 100);
      } else {
        setIsTyping(false);
      }
    };

    const startTyping = setTimeout(typeText, 500);

    return () => {
      clearTimeout(startTyping);
      clearTimeout(typingTimeout);
    };
  }, [text, disabled]);

  useEffect(() => {
    if (disabled) return;

    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, blinkSpeed);

    return () => clearInterval(blinkInterval);
  }, [blinkSpeed, disabled]);

  return (
    <span className={`inline-block ${className}`}>
      {displayText}
      {!disabled && (
        <span 
          className={`inline-block transition-opacity duration-100 ${
            showCursor || isTyping ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TextCursor;