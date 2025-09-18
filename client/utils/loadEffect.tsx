/**
 * Dynamic Import Helper for React Bits Components
 * 
 * This utility provides lazy loading for React Bits components with
 * accessibility-aware fallbacks and error boundaries.
 * 
 * @example
 * ```tsx
 * const DecryptText = loadEffect('DecryptText');
 * const TrueFocus = loadEffect('TrueFocus', { 
 *   fallback: <div>Loading effect...</div> 
 * });
 * ```
 */

import React, { ComponentType, lazy, Suspense, ReactNode } from 'react';

// Type definitions for common React Bits components
export interface EffectProps {
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface DecryptTextProps extends EffectProps {
  text: string;
  speed?: number;
  tabIndex?: number;
}

export interface TrueFocusProps extends EffectProps {
  scale?: number;
  glowColor?: string;
}

export interface CountUpProps extends EffectProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export interface ClickSparkProps extends EffectProps {
  color?: string;
  size?: number;
}

// Available effect components mapping
type EffectComponents = {
  DecryptText: ComponentType<DecryptTextProps>;
  TrueFocus: ComponentType<TrueFocusProps>;
  CountUp: ComponentType<CountUpProps>;
  ClickSpark: ComponentType<ClickSparkProps>;
};

type EffectName = keyof EffectComponents;

interface LoadEffectOptions {
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

/**
 * Error boundary component for effect loading failures
 */
class EffectErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Effect loading failed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

/**
 * Dynamically loads React Bits effect components with proper error handling
 * @param effectName - Name of the effect component to load
 * @param options - Loading options including fallbacks
 * @returns Lazy-loaded component with error boundary
 */
export function loadEffect<T extends EffectName>(
  effectName: T,
  options: LoadEffectOptions = {}
): ComponentType<EffectComponents[T] extends ComponentType<infer P> ? P : never> {
  const { fallback = null, errorFallback } = options;

  // Create lazy component with dynamic import
  const LazyComponent = lazy(async () => {
    try {
      // Dynamic import based on component name
      const module = await import(`react-bits/${effectName}`);
      return { default: module.default || module[effectName] };
    } catch (error) {
      console.warn(`Failed to load effect "${effectName}":`, error);
      
      // Return a no-op component on failure
      return {
        default: ({ children, ...props }: any) => 
          children || <span {...props} />
      };
    }
  });

  // Return wrapped component with error boundary and suspense
  return function LoadedEffect(props: any) {
    return (
      <EffectErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </EffectErrorBoundary>
    );
  } as ComponentType<EffectComponents[T] extends ComponentType<infer P> ? P : never>;
}

/**
 * Pre-configured effect loaders for common use cases
 */
export const Effects = {
  DecryptText: loadEffect('DecryptText', {
    fallback: <span>Loading text effect...</span>
  }),
  
  TrueFocus: loadEffect('TrueFocus', {
    fallback: <div>Loading focus effect...</div>
  }),
  
  CountUp: loadEffect('CountUp', {
    fallback: <span>0</span>
  }),
  
  ClickSpark: loadEffect('ClickSpark', {
    fallback: null
  })
};

export default loadEffect;