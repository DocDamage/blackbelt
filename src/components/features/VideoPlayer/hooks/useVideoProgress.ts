/**
 * useVideoProgress Hook
 * 
 * Progress tracking with throttling and completion detection.
 */

import { useCallback, useRef, useEffect } from 'react';
import type { VideoProgress, VideoPlayerConfig } from '../VideoPlayer.types';

interface UseVideoProgressProps {
    config: Pick<VideoPlayerConfig, 'completionThreshold' | 'throttleInterval'>;
    currentTime: number;
    duration: number;
    onProgress?: (progress: VideoProgress) => void;
    onComplete?: () => void;
}

// Simple throttle implementation
function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn(...args);
        }
    };
}

export function useVideoProgress({
    config,
    currentTime,
    duration,
    onProgress,
    onComplete,
}: UseVideoProgressProps) {
    const hasCompletedRef = useRef(false);
    const lastProgressRef = useRef<VideoProgress | null>(null);

    const calculateProgress = useCallback((): VideoProgress => {
        const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
        const completed = percentage >= config.completionThreshold;
        
        return {
            currentTime,
            duration,
            percentage: Math.min(percentage, 100),
            completed,
        };
    }, [currentTime, duration, config.completionThreshold]);

    const throttledProgressUpdate = useCallback(
        throttle((progress: VideoProgress) => {
            // Only call if progress has meaningfully changed (>= 1%)
            if (
                !lastProgressRef.current ||
                Math.abs(progress.percentage - lastProgressRef.current.percentage) >= 1
            ) {
                lastProgressRef.current = progress;
                onProgress?.(progress);
            }

            // Handle completion
            if (progress.completed && !hasCompletedRef.current) {
                hasCompletedRef.current = true;
                onComplete?.();
            }
        }, config.throttleInterval),
        [onProgress, onComplete, config.throttleInterval]
    );

    useEffect(() => {
        const progress = calculateProgress();
        throttledProgressUpdate(progress);
    }, [calculateProgress, throttledProgressUpdate]);

    // Reset completion flag when video changes (duration changes indicate new video)
    useEffect(() => {
        hasCompletedRef.current = false;
        lastProgressRef.current = null;
    }, [duration]);

    const reset = useCallback(() => {
        hasCompletedRef.current = false;
        lastProgressRef.current = null;
    }, []);

    return { calculateProgress, reset };
}
