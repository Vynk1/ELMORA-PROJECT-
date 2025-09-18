import React, { useEffect, useRef, ReactNode, useState } from 'react';

interface MagnetProps {
  children: ReactNode;
  strength?: number;
  disabled?: boolean;
  className?: string;
  onlyDesktop?: boolean;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  strength = 0.2,
  disabled = false,
  className = '',
  onlyDesktop = true
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (onlyDesktop) {
      const checkMobile = window.matchMedia('(max-width: 768px)');
      setIsMobile(checkMobile.matches);
      
      const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      checkMobile.addEventListener('change', handleChange);
      
      return () => checkMobile.removeEventListener('change', handleChange);
    }
  }, [onlyDesktop]);

  useEffect(() => {
    if (disabled || (onlyDesktop && isMobile)) return;

    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px) scale(1)';
    };

    const handleMouseEnter = () => {
      element.style.transition = 'none';
    };

    const handleMouseOut = () => {
      element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseout', handleMouseOut);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mouseout', handleMouseOut);
    };
  }, [strength, disabled, isMobile, onlyDesktop]);

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

export default Magnet;