/**
 * Tests for VideoPlayer Utility Functions
 */

import { describe, it, expect, vi } from 'vitest';
import {
    formatTime,
    formatDuration,
    calculateProgress,
    generateId,
    parseYouTubeId,
    parseVimeoId,
    normalizeVideoSource,
    createStorageKey,
    clamp,
    round,
    debounce,
    throttle,
} from './VideoPlayer.utils';
import type { VideoSource } from './VideoPlayer.types';

describe('VideoPlayer.utils', () => {
    describe('formatTime', () => {
        it('formats seconds to MM:SS format', () => {
            expect(formatTime(0)).toBe('0:00');
            expect(formatTime(5)).toBe('0:05');
            expect(formatTime(30)).toBe('0:30');
            expect(formatTime(60)).toBe('1:00');
            expect(formatTime(90)).toBe('1:30');
            expect(formatTime(125)).toBe('2:05');
        });

        it('formats seconds to HH:MM:SS for durations over 1 hour', () => {
            expect(formatTime(3600)).toBe('1:00:00');
            expect(formatTime(3661)).toBe('1:01:01');
            expect(formatTime(7200)).toBe('2:00:00');
        });

        it('handles invalid inputs', () => {
            expect(formatTime(-1)).toBe('0:00');
            expect(formatTime(NaN)).toBe('0:00');
        });

        it('pads minutes and seconds correctly', () => {
            expect(formatTime(1)).toBe('0:01');
            expect(formatTime(10)).toBe('0:10');
            expect(formatTime(61)).toBe('1:01');
            expect(formatTime(601)).toBe('10:01');
        });
    });

    describe('formatDuration', () => {
        it('formats duration in minutes', () => {
            expect(formatDuration(0)).toBe('0m');
            expect(formatDuration(60)).toBe('1m');
            expect(formatDuration(300)).toBe('5m');
            expect(formatDuration(599)).toBe('9m');
        });

        it('formats duration in hours and minutes', () => {
            expect(formatDuration(3600)).toBe('1h 0m');
            expect(formatDuration(3660)).toBe('1h 1m');
            expect(formatDuration(7200)).toBe('2h 0m');
            expect(formatDuration(7260)).toBe('2h 1m');
        });

        it('handles invalid inputs', () => {
            expect(formatDuration(-1)).toBe('0m');
            expect(formatDuration(NaN)).toBe('0m');
        });
    });

    describe('calculateProgress', () => {
        it('calculates progress percentage', () => {
            const result = calculateProgress(50, 100, 90);
            expect(result.currentTime).toBe(50);
            expect(result.duration).toBe(100);
            expect(result.percentage).toBe(50);
            expect(result.completed).toBe(false);
        });

        it('marks completed when threshold is reached', () => {
            const result = calculateProgress(95, 100, 90);
            expect(result.percentage).toBe(95);
            expect(result.completed).toBe(true);
        });

        it('caps percentage at 100', () => {
            const result = calculateProgress(150, 100, 90);
            expect(result.percentage).toBe(100);
            expect(result.completed).toBe(true);
        });

        it('handles zero duration', () => {
            const result = calculateProgress(50, 0, 90);
            expect(result.percentage).toBe(0);
            expect(result.completed).toBe(false);
        });

        it('handles different completion thresholds', () => {
            expect(calculateProgress(80, 100, 90).completed).toBe(false);
            expect(calculateProgress(80, 100, 80).completed).toBe(true);
            expect(calculateProgress(80, 100, 70).completed).toBe(true);
        });
    });

    describe('generateId', () => {
        it('generates ID with prefix', () => {
            const id = generateId('test');
            expect(id.startsWith('test-')).toBe(true);
        });

        it('generates unique IDs', () => {
            const id1 = generateId('test');
            const id2 = generateId('test');
            expect(id1).not.toBe(id2);
        });

        it('handles different prefixes', () => {
            const bookmarkId = generateId('bookmark');
            const noteId = generateId('note');
            expect(bookmarkId.startsWith('bookmark-')).toBe(true);
            expect(noteId.startsWith('note-')).toBe(true);
        });
    });

    describe('parseYouTubeId', () => {
        it('parses standard YouTube URL', () => {
            expect(parseYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
            expect(parseYouTubeId('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('parses shortened youtu.be URL', () => {
            expect(parseYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('parses embed URL', () => {
            expect(parseYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('parses raw video ID', () => {
            expect(parseYouTubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        });

        it('returns null for invalid URLs', () => {
            expect(parseYouTubeId('invalid')).toBeNull();
            expect(parseYouTubeId('https://example.com')).toBeNull();
            expect(parseYouTubeId('')).toBeNull();
        });

        it('handles URLs with additional parameters', () => {
            expect(parseYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s')).toBe('dQw4w9WgXcQ');
        });
    });

    describe('parseVimeoId', () => {
        it('parses standard Vimeo URL', () => {
            expect(parseVimeoId('https://vimeo.com/123456789')).toBe('123456789');
        });

        it('parses player.vimeo.com URL', () => {
            expect(parseVimeoId('https://player.vimeo.com/video/123456789')).toBe('123456789');
        });

        it('parses raw video ID', () => {
            expect(parseVimeoId('123456789')).toBe('123456789');
        });

        it('returns null for invalid URLs', () => {
            expect(parseVimeoId('invalid')).toBeNull();
            expect(parseVimeoId('https://example.com')).toBeNull();
            expect(parseVimeoId('')).toBeNull();
        });
    });

    describe('normalizeVideoSource', () => {
        it('returns MP4 source unchanged when type is specified', () => {
            const source: VideoSource = { src: 'https://example.com/video.mp4', type: 'mp4' };
            const result = normalizeVideoSource(source);
            expect(result.src).toBe('https://example.com/video.mp4');
            expect(result.type).toBe('mp4');
        });

        it('auto-detects MP4 from file extension', () => {
            const source: VideoSource = { src: 'https://example.com/video.mp4', type: undefined as unknown as 'mp4' };
            const result = normalizeVideoSource(source);
            expect(result.type).toBe('mp4');
        });

        it('auto-detects WebM from file extension', () => {
            const source: VideoSource = { src: 'https://example.com/video.webm', type: undefined as unknown as 'mp4' };
            const result = normalizeVideoSource(source);
            expect(result.type).toBe('webm');
        });

        it('auto-detects YouTube from URL', () => {
            const source: VideoSource = { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: undefined as unknown as 'mp4' };
            const result = normalizeVideoSource(source);
            expect(result.type).toBe('youtube');
            expect(result.src).toBe('dQw4w9WgXcQ');
        });

        it('auto-detects Vimeo from URL', () => {
            const source: VideoSource = { src: 'https://vimeo.com/123456789', type: undefined as unknown as 'mp4' };
            const result = normalizeVideoSource(source);
            expect(result.type).toBe('vimeo');
            expect(result.src).toBe('123456789');
        });

        it('extracts YouTube ID from embed URL', () => {
            const source: VideoSource = { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', type: 'youtube' };
            const result = normalizeVideoSource(source);
            expect(result.src).toBe('dQw4w9WgXcQ');
        });

        it('preserves additional source properties', () => {
            const source: VideoSource = {
                src: 'https://example.com/video.mp4',
                type: 'mp4',
                title: 'Test Video',
                thumbnail: 'https://example.com/thumb.jpg',
            };
            const result = normalizeVideoSource(source);
            expect(result.title).toBe('Test Video');
            expect(result.thumbnail).toBe('https://example.com/thumb.jpg');
        });
    });

    describe('createStorageKey', () => {
        it('creates storage key with default prefix', () => {
            expect(createStorageKey('abc123')).toBe('video-player-abc123');
        });

        it('creates storage key with custom prefix', () => {
            expect(createStorageKey('abc123', 'my-app')).toBe('my-app-abc123');
        });

        it('handles special characters in video ID', () => {
            expect(createStorageKey('video/with/slashes')).toBe('video-player-video/with/slashes');
            expect(createStorageKey('video:with:colons')).toBe('video-player-video:with:colons');
        });
    });

    describe('clamp', () => {
        it('returns value when within range', () => {
            expect(clamp(5, 0, 10)).toBe(5);
            expect(clamp(0, 0, 10)).toBe(0);
            expect(clamp(10, 0, 10)).toBe(10);
        });

        it('clamps to min when below range', () => {
            expect(clamp(-5, 0, 10)).toBe(0);
            expect(clamp(-100, -50, 50)).toBe(-50);
        });

        it('clamps to max when above range', () => {
            expect(clamp(15, 0, 10)).toBe(10);
            expect(clamp(100, -50, 50)).toBe(50);
        });

        it('handles negative ranges', () => {
            expect(clamp(-75, -100, -50)).toBe(-75);
            expect(clamp(-25, -100, -50)).toBe(-50);
        });
    });

    describe('round', () => {
        it('rounds to 2 decimal places by default', () => {
            expect(round(3.14159)).toBe(3.14);
            expect(round(2.71828)).toBe(2.72);
        });

        it('rounds to specified decimal places', () => {
            expect(round(3.14159, 0)).toBe(3);
            expect(round(3.14159, 1)).toBe(3.1);
            expect(round(3.14159, 3)).toBe(3.142);
            expect(round(3.14159, 4)).toBe(3.1416);
        });

        it('handles whole numbers', () => {
            expect(round(5, 2)).toBe(5);
            expect(round(5.0, 2)).toBe(5);
        });

        it('handles negative numbers', () => {
            expect(round(-3.14159, 2)).toBe(-3.14);
        });
    });

    describe('debounce', () => {
        it('delays function execution', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const debouncedFn = debounce(fn, 100);

            debouncedFn();
            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(50);
            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(50);
            expect(fn).toHaveBeenCalledTimes(1);

            vi.useRealTimers();
        });

        it('resets timer on subsequent calls', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const debouncedFn = debounce(fn, 100);

            debouncedFn();
            vi.advanceTimersByTime(50);
            debouncedFn();
            vi.advanceTimersByTime(50);
            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(50);
            expect(fn).toHaveBeenCalledTimes(1);

            vi.useRealTimers();
        });

        it('passes arguments to debounced function', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const debouncedFn = debounce(fn, 100);

            debouncedFn('arg1', 'arg2');
            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
            vi.useRealTimers();
        });
    });

    describe('throttle', () => {
        it('executes function immediately on first call', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const throttledFn = throttle(fn, 100);

            throttledFn();
            expect(fn).toHaveBeenCalledTimes(1);

            vi.useRealTimers();
        });

        it('ignores calls within throttle period', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const throttledFn = throttle(fn, 100);

            throttledFn();
            throttledFn();
            throttledFn();
            expect(fn).toHaveBeenCalledTimes(1);

            vi.useRealTimers();
        });

        it('executes again after throttle period', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const throttledFn = throttle(fn, 100);

            throttledFn();
            vi.advanceTimersByTime(100);
            throttledFn();
            expect(fn).toHaveBeenCalledTimes(2);

            vi.useRealTimers();
        });

        it('passes arguments to throttled function', () => {
            vi.useFakeTimers();
            const fn = vi.fn();
            const throttledFn = throttle(fn, 100);

            throttledFn('arg1', 'arg2');
            expect(fn).toHaveBeenCalledWith('arg1', 'arg2');

            vi.useRealTimers();
        });
    });
});
