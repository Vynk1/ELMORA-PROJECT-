import React, { useEffect, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  className?: string;
}

const DecryptedText: React.FC<DecryptedTextProps> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        setIsAnimating(false);
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={`font-mono ${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {displayText}
    </span>
  );
};

export default DecryptedText;