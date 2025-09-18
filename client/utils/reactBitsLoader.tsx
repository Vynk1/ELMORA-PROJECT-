/**
 * React Bits Lazy Loading Utility
 * 
 * Provides dynamic imports for React Bits components with
 * reduced motion detection and mobile/desktop guards.
 */

import React, { lazy, ComponentType, ReactNode, useState, useEffect } from 'react';

// Mock components for development when React Bits is not available
const MockVariableProximity: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
const MockGlareHover: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
const MockMagnet: React.FC<{ children: ReactNode; disabled?: boolean }> = ({ children }) => <>{children}</>;
const MockClickSpark: React.FC<{ children: ReactNode; color?: string; size?: number }> = ({ children }) => <>{children}</>;
const MockLogoLoop: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
const MockTrueFocus: React.FC<{ children: ReactNode; scale?: number; glowColor?: string; disabled?: boolean }> = ({ children }) => <>{children}</>;
const MockCountUp: React.FC<{ end: number; duration?: number; start?: number; suffix?: string; prefix?: string; disabled?: boolean }> = ({ end, suffix = '', prefix = '' }) => <>{prefix}{end}{suffix}</>;
const MockTextTrail: React.FC<{ children: ReactNode; text?: string; speed?: number; disabled?: boolean }> = ({ children }) => <>{children}</>;

// Utility to create lazy-loaded React Bits components
export const loadReactBit = (name: string): ComponentType<any> => {
  return lazy(async () => {
    try {
      const module = await import(/* @vite-ignore */ `react-bits/${name}`);
      return { default: module.default || module[name] };
    } catch (error) {
      console.warn(`Failed to load React Bit "${name}" - using mock component:`, error);
      
      // Return appropriate mock component based on name
      const mockComponents: { [key: string]: ComponentType<any> } = {
        'VariableProximity': MockVariableProximity,
        'GlareHover': MockGlareHover,
        'Magnet': MockMagnet,
        'ClickSpark': MockClickSpark,
        'LogoLoop': MockLogoLoop,
        'TrueFocus': MockTrueFocus,
        'CountUp': MockCountUp,
        'TextTrail': MockTextTrail,
      };
      
      return {
        default: mockComponents[name] || (({ children }: { children?: ReactNode }) => <>{children}</>)
      };
    }
  });
};

// Pre-loaded React Bits components for the topbar and tasks
export const VariableProximity = loadReactBit('VariableProximity');
export const GlareHover = loadReactBit('GlareHover');
export const Magnet = loadReactBit('Magnet');
export const ClickSpark = loadReactBit('ClickSpark');
export const LogoLoop = loadReactBit('LogoLoop');
export const TrueFocus = loadReactBit('TrueFocus');
export const CountUp = loadReactBit('CountUp');
export const TextTrail = loadReactBit('TextTrail');

// Hook to detect reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook to detect if device is desktop (for cursor-based effects)
export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768 && !('ontouchstart' in window));
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return isDesktop;
};

// Performance-aware effect wrapper
export const EffectWrapper: React.FC<{
  condition: boolean;
  fallback: ReactNode;
  children: ReactNode;
}> = ({ condition, fallback, children }) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};