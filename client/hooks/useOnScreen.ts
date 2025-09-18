/**
 * useOnScreen Hook - IntersectionObserver for React
 * 
 * This hook uses the IntersectionObserver API to detect when an element
 * is visible in the viewport. Useful for lazy loading, animations, and
 * performance optimization.
 * 
 * @example
 * ```tsx
 * function LazyComponent() {
 *   const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
 *   
 *   return (
 *     <div ref={ref}>
 *       {isVisible ? <ExpensiveComponent /> : <PlaceholderSkeleton />}
 *     </div>
 *   );
 * }
 * ```
 */

import { useEffect, useRef, useState, RefObject } from 'react';

export interface UseOnScreenOptions {
  /** Threshold for intersection (0-1) */
  threshold?: number | number[];
  
  /** Root margin for intersection area */
  rootMargin?: string;
  
  /** Root element for intersection (default: viewport) */
  root?: Element | null;
  
  /** Only trigger once when element becomes visible */
  triggerOnce?: boolean;
  
  /** Initial visibility state */
  initialIsIntersecting?: boolean;
}

export interface UseOnScreenReturn<T extends Element> {
  /** Ref to attach to the element */
  ref: RefObject<T>;
  
  /** Whether the element is currently visible */
  isVisible: boolean;
  
  /** IntersectionObserver entry (if available) */
  entry?: IntersectionObserverEntry;
}

/**
 * Hook for detecting when an element is visible on screen
 * @param options - IntersectionObserver options
 * @returns Tuple of [ref, isVisible, entry]
 */
export function useOnScreen<T extends Element = HTMLDivElement>(
  options: UseOnScreenOptions = {}
): [RefObject<T>, boolean, IntersectionObserverEntry?] {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    triggerOnce = false,
    initialIsIntersecting = false
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(initialIsIntersecting);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver is not supported in this browser');
      setIsVisible(true); // Fallback to visible for unsupported browsers
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [observerEntry] = entries;
        setEntry(observerEntry);
        setIsVisible(observerEntry.isIntersecting);

        // If triggerOnce is true and element is visible, disconnect observer
        if (triggerOnce && observerEntry.isIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, triggerOnce]);

  return [ref, isVisible, entry];
}

/**
 * Alternative hook that returns an object instead of a tuple
 * @param options - IntersectionObserver options
 * @returns Object with ref, isVisible, and entry properties
 */
export function useOnScreenObject<T extends Element = HTMLDivElement>(
  options: UseOnScreenOptions = {}
): UseOnScreenReturn<T> {
  const [ref, isVisible, entry] = useOnScreen<T>(options);
  
  return { ref, isVisible, entry };
}

/**
 * Hook for lazy loading components based on visibility
 * @param options - IntersectionObserver options with triggerOnce defaulting to true
 * @returns Tuple of [ref, shouldLoad]
 */
export function useLazyLoad<T extends Element = HTMLDivElement>(
  options: Omit<UseOnScreenOptions, 'triggerOnce'> & { triggerOnce?: boolean } = {}
): [RefObject<T>, boolean] {
  const { triggerOnce = true, ...otherOptions } = options;
  const [ref, shouldLoad] = useOnScreen<T>({ ...otherOptions, triggerOnce });
  
  return [ref, shouldLoad];
}

/**
 * Hook for triggering animations when elements come into view
 * @param options - IntersectionObserver options
 * @returns Tuple of [ref, shouldAnimate, animationClass]
 */
export function useScrollAnimation<T extends Element = HTMLDivElement>(
  options: UseOnScreenOptions & {
    /** CSS class to apply when element is visible */
    animationClass?: string;
    /** CSS class to apply when element is not visible */
    hiddenClass?: string;
  } = {}
): [RefObject<T>, boolean, string] {
  const { 
    animationClass = 'animate-fade-in',
    hiddenClass = 'opacity-0 translate-y-4',
    ...observerOptions 
  } = options;
  
  const [ref, isVisible] = useOnScreen<T>(observerOptions);
  const className = isVisible ? animationClass : hiddenClass;
  
  return [ref, isVisible, className];
}

export default useOnScreen;