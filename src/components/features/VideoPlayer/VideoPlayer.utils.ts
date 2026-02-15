/**
 * VideoPlayer Utility Functions
 * 
 * Pure utility functions for the VideoPlayer component.
 */

import type { VideoProgress, VideoSource } from './VideoPlayer.types';

/**
 * Format seconds into MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds into a compact duration string
 */
export function formatDuration(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0m';
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

/**
 * Calculate progress percentage and completion status
 */
export function calculateProgress(
    currentTime: number,
    duration: number,
    completionThreshold: number
): VideoProgress {
    const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    const completed = percentage >= completionThreshold;
    
    return {
        currentTime,
        duration,
        percentage: Math.min(percentage, 100),
        completed,
    };
}

/**
 * Generate a unique ID for bookmarks and notes
 */
export function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse video ID from various YouTube URL formats
 */
export function parseYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1] ?? null;
    }
    return null;
}

/**
 * Parse video ID from Vimeo URL
 */
export function parseVimeoId(url: string): string | null {
    const patterns = [
        /vimeo\.com\/(\d+)/,
        /player\.vimeo\.com\/video\/(\d+)/,
        /^(\d+)$/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1] ?? null;
    }
    return null;
}

/**
 * Normalize video source to ensure consistent format
 */
export function normalizeVideoSource(source: VideoSource): VideoSource {
    let { src, type } = source;
    
    // Auto-detect type if not specified
    if (!type) {
        if (parseYouTubeId(src)) {
            type = 'youtube';
            src = parseYouTubeId(src)!;
        } else if (parseVimeoId(src)) {
            type = 'vimeo';
            src = parseVimeoId(src)!;
        } else if (src.endsWith('.webm')) {
            type = 'webm';
        } else {
            type = 'mp4';
        }
    }
    
    // Extract ID for embed sources
    if (type === 'youtube' && src.includes('youtube.com')) {
        src = parseYouTubeId(src) || src;
    } else if (type === 'vimeo' && src.includes('vimeo.com')) {
        src = parseVimeoId(src) || src;
    }
    
    return { ...source, src, type };
}

/**
 * Create storage key for a specific video
 */
export function createStorageKey(videoId: string, prefix = 'video-player'): string {
    return `${prefix}-${videoId}`;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Round number to specified decimal places
 */
export function round(value: number, decimals = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;
    
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
