/**
 * useVideoVisibility Hook
 * 
 * Tracks video visibility using Intersection Observer.
 * Useful for pausing video when scrolled out of view.
 */

import { useEffect, useState } from 'react';

interface UseVideoVisibilityProps {
    containerRef: React.RefObject<HTMLElement>;
    threshold?: number;
    rootMargin?: string;
}

export function useVideoVisibility({
    containerRef,
    threshold = 0.5,
    rootMargin = '0px',
}: UseVideoVisibilityProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const currentlyVisible = entry?.isIntersecting ?? false;
                setIsVisible(currentlyVisible);
                
                if (currentlyVisible) {
                    setHasBeenVisible(true);
                }
            },
            { 
                threshold,
                rootMargin,
            }
        );

        observer.observe(element);
        
        return () => {
            observer.disconnect();
        };
    }, [containerRef, threshold, rootMargin]);

    return { isVisible, hasBeenVisible };
}
