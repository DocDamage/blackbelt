/**
 * VideoPlayer Component Accessibility Tests
 * 
 * Validates WCAG compliance for VideoPlayer sub-components
 * Note: Full VideoPlayer integration tests are covered in VideoPlayer.test.tsx
 * @technical_debt Issue 53: Automated Accessibility Testing
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { VideoPlayerProvider } from './contexts/VideoPlayerContext';
import { VideoControls } from './components/VideoControls';
import { VideoChapters } from './components/VideoChapters';
import { PlayButton } from './components/PlayButton';
import { PauseButton } from './components/PauseButton';
import type { VideoPlayerContextValue } from './contexts/VideoPlayerContext';
import type { VideoChapter } from './VideoPlayer.types';

expect.extend(toHaveNoViolations);

const mockChapters: VideoChapter[] = [
    { id: '1', time: 0, title: 'Introduction', description: 'Course overview' },
    { id: '2', time: 60, title: 'Main Content', description: 'Core concepts' },
];

const createMockContext = (overrides = {}): VideoPlayerContextValue => ({
    state: {
        isPlaying: false,
        isLoading: false,
        isBuffering: false,
        currentTime: 30,
        duration: 300,
        volume: 1,
        isMuted: false,
        playbackRate: 1,
        isFullscreen: false,
        isPiP: false,
        error: null,
        ...overrides,
    },
    actions: {
        play: vi.fn(),
        pause: vi.fn(),
        seek: vi.fn(),
        seekRelative: vi.fn(),
        setVolume: vi.fn(),
        toggleMute: vi.fn(),
        volumeUp: vi.fn(),
        volumeDown: vi.fn(),
        setPlaybackRate: vi.fn(),
        increaseSpeed: vi.fn(),
        decreaseSpeed: vi.fn(),
        toggleFullscreen: vi.fn(),
        togglePiP: vi.fn(),
        addBookmark: vi.fn(),
        removeBookmark: vi.fn(),
        addNote: vi.fn(),
        updateNote: vi.fn(),
        removeNote: vi.fn(),
        jumpToChapter: vi.fn(),
        clearError: vi.fn(),
    },
    videoRef: { current: null },
    containerRef: { current: null },
    chapters: mockChapters,
    bookmarks: [],
    notes: [],
    videoSource: { type: 'mp4', src: 'https://example.com/video.mp4' },
    config: {
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        skipDuration: 10,
        volumeStep: 0.1,
        enablePiP: true,
        enableFullscreen: true,
    },
});

describe('VideoPlayer Accessibility', () => {
    describe('VideoControls', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(
                <VideoPlayerProvider value={createMockContext()}>
                    <VideoControls />
                </VideoPlayerProvider>
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have toolbar role with accessible label', () => {
            const { container } = render(
                <VideoPlayerProvider value={createMockContext()}>
                    <VideoControls />
                </VideoPlayerProvider>
            );
            const toolbar = container.querySelector('[role="toolbar"]');
            expect(toolbar).toBeInTheDocument();
            expect(toolbar).toHaveAttribute('aria-label', 'Video controls');
        });
    });

    describe('VideoChapters', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(
                <VideoPlayerProvider value={createMockContext()}>
                    <VideoChapters />
                </VideoPlayerProvider>
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have list role for chapters', () => {
            const { container } = render(
                <VideoPlayerProvider value={createMockContext()}>
                    <VideoChapters />
                </VideoPlayerProvider>
            );
            const list = container.querySelector('[role="list"]');
            expect(list).toBeInTheDocument();
        });

        it('should have accessible chapter buttons', () => {
            const { container } = render(
                <VideoPlayerProvider value={createMockContext()}>
                    <VideoChapters />
                </VideoPlayerProvider>
            );
            const buttons = container.querySelectorAll('.chapter-button');
            expect(buttons.length).toBeGreaterThan(0);
            buttons.forEach(button => {
                expect(button.tagName).toBe('BUTTON');
            });
        });
    });

    describe('PlayButton', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(
                <VideoPlayerProvider value={createMockContext()}>
                    <PlayButton />
                </VideoPlayerProvider>
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have accessible play button', () => {
            render(
                <VideoPlayerProvider value={createMockContext()}>
                    <PlayButton />
                </VideoPlayerProvider>
            );
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label');
        });
    });

    describe('PauseButton', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(
                <VideoPlayerProvider value={createMockContext()}>
                    <PauseButton />
                </VideoPlayerProvider>
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
