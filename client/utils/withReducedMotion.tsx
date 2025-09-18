/**
 * Higher-Order Component for Reduced Motion Accessibility
 * 
 * This HOC automatically detects the user's reduced motion preference
 * and disables animations/effects accordingly for accessibility compliance.
 * 
 * @example
 * ```tsx
 * const AccessibleComponent = withReducedMotion(MyAnimatedComponent);
 * // Component will automatically receive `disabled` prop based on user preference
 * ```
 */

import React, { ComponentType, useEffect, useState } from 'react';

export interface ReducedMotionProps {
  disabled?: boolean;
}

/**
 * Higher-order component that provides reduced motion accessibility
 * @param WrappedComponent - The component to wrap with reduced motion detection
 * @returns Component with reduced motion support
 */
export function withReducedMotion<P extends object>(
  WrappedComponent: ComponentType<P & ReducedMotionProps>
) {
  const WithReducedMotionComponent = (props: P) => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      // Check user's reduced motion preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      // Listen for changes to the preference
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }, []);

    return (
      <WrappedComponent 
        {...props} 
        disabled={prefersReducedMotion || (props as any).disabled}
      />
    );
  };

  WithReducedMotionComponent.displayName = 
    `withReducedMotion(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithReducedMotionComponent;
}

/**
 * Custom hook for reduced motion preference detection
 * @returns boolean indicating if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

export default withReducedMotion;