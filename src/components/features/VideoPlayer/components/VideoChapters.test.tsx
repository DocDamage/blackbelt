/**
 * Tests for VideoChapters Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoChapters } from './VideoChapters';
import { VideoPlayerProvider } from '../contexts/VideoPlayerContext';
import type { VideoPlayerContextValue } from '../contexts/VideoPlayerContext';

describe('VideoChapters', () => {
    const createMockContext = (
        chapters: VideoPlayerContextValue['chapters'] = [],
        currentTime = 0
    ): VideoPlayerContextValue => ({
        state: {
            isPlaying: false,
            isLoading: false,
            isBuffering: false,
            currentTime,
            duration: 300,
            volume: 1,
            isMuted: false,
            playbackRate: 1,
            isFullscreen: false,
            isPiP: false,
            error: null,
        },
        bookmarks: [],
        notes: [],
        chapters,
        videoSource: { src: 'test.mp4', type: 'mp4' },
        videoRef: { current: null },
        containerRef: { current: null },
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
        config: {
            playbackRates: [0.5, 1, 1.5, 2],
            skipDuration: 10,
            volumeStep: 0.1,
            enablePiP: true,
            enableFullscreen: true,
        },
    });

    it('returns null when no chapters exist', () => {
        const { container } = render(
            <VideoPlayerProvider value={createMockContext([])}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        expect(container.firstChild).toBeNull();
    });

    it('renders chapters panel when chapters exist', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 60, title: 'Main Content' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        expect(screen.getByText(/chapters/i)).toBeInTheDocument();
    });

    it('renders all chapter titles', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 60, title: 'Main Content' },
            { id: 'ch3', time: 120, title: 'Conclusion' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        expect(screen.getByText('Introduction')).toBeInTheDocument();
        expect(screen.getByText('Main Content')).toBeInTheDocument();
        expect(screen.getByText('Conclusion')).toBeInTheDocument();
    });

    it('renders chapter timestamps', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 65, title: 'Main Content' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        expect(screen.getByText('0:00')).toBeInTheDocument();
        expect(screen.getByText('1:05')).toBeInTheDocument();
    });

    it('marks first chapter as active at start', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 60, title: 'Main Content' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters, 0)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        const chapterButtons = screen.getAllByRole('button');
        expect(chapterButtons[0]).toHaveAttribute('aria-current', 'true');
        expect(chapterButtons[1]).not.toHaveAttribute('aria-current');
    });

    it('marks correct chapter as active based on current time', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 60, title: 'Main Content' },
            { id: 'ch3', time: 120, title: 'Conclusion' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters, 75)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        const chapterButtons = screen.getAllByRole('button');
        expect(chapterButtons[0]).not.toHaveAttribute('aria-current');
        expect(chapterButtons[1]).toHaveAttribute('aria-current', 'true');
        expect(chapterButtons[2]).not.toHaveAttribute('aria-current');
    });

    it('marks last chapter as active when past its time', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 60, title: 'Main Content' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters, 180)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        const chapterButtons = screen.getAllByRole('button');
        expect(chapterButtons[0]).not.toHaveAttribute('aria-current');
        expect(chapterButtons[1]).toHaveAttribute('aria-current', 'true');
    });

    it('calls seek action when chapter is clicked', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 60, title: 'Main Content' },
        ];

        const mockContext = createMockContext(chapters);
        render(
            <VideoPlayerProvider value={mockContext}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        const mainContentButton = screen.getByText('Main Content').closest('button');
        fireEvent.click(mainContentButton!);

        expect(mockContext.actions.seek).toHaveBeenCalledWith(60);
    });

    it('renders chapter descriptions when provided', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction', description: 'Welcome to the course' },
            { id: 'ch2', time: 60, title: 'Main Content' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        expect(screen.getByText('Welcome to the course')).toBeInTheDocument();
    });

    it('renders as a list with correct roles', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 60, title: 'Main Content' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('has correct CSS classes', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        expect(document.querySelector('.video-chapters-panel')).toBeInTheDocument();
        expect(document.querySelector('.chapters-title')).toBeInTheDocument();
        expect(document.querySelector('.chapters-list')).toBeInTheDocument();
        expect(document.querySelector('.chapter-item')).toBeInTheDocument();
        expect(document.querySelector('.chapter-button')).toBeInTheDocument();
        expect(document.querySelector('.chapter-time')).toBeInTheDocument();
        expect(document.querySelector('.chapter-title')).toBeInTheDocument();
    });

    it('applies active class to current chapter', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'Introduction' },
            { id: 'ch2', time: 60, title: 'Main Content' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters, 75)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        const chapterItems = document.querySelectorAll('.chapter-item');
        expect(chapterItems[0]).not.toHaveClass('active');
        expect(chapterItems[1]).toHaveClass('active');
    });

    it('handles chapters with same time gracefully', () => {
        const chapters = [
            { id: 'ch1', time: 0, title: 'First' },
            { id: 'ch2', time: 0, title: 'Duplicate' },
            { id: 'ch3', time: 60, title: 'Next' },
        ];

        render(
            <VideoPlayerProvider value={createMockContext(chapters, 0)}>
                <VideoChapters />
            </VideoPlayerProvider>
        );

        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Duplicate')).toBeInTheDocument();
    });
});
