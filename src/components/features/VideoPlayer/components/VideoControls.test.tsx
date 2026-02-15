/**
 * Tests for VideoControls Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VideoControls } from './VideoControls';
import { VideoPlayerProvider } from '../contexts/VideoPlayerContext';
import type { VideoPlayerContextValue } from '../contexts/VideoPlayerContext';

describe('VideoControls', () => {
    const createMockContext = (overrides?: Partial<VideoPlayerContextValue['state']>): VideoPlayerContextValue => ({
        state: {
            isPlaying: false,
            isLoading: false,
            isBuffering: false,
            currentTime: 0,
            duration: 100,
            volume: 1,
            isMuted: false,
            playbackRate: 1,
            isFullscreen: false,
            isPiP: false,
            error: null,
            ...overrides,
        },
        bookmarks: [],
        notes: [],
        chapters: [],
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

    it('renders controls toolbar', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(screen.getByRole('toolbar', { name: /video controls/i })).toBeInTheDocument();
    });

    it('shows play button when paused', () => {
        render(
            <VideoPlayerProvider value={createMockContext({ isPlaying: false })}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        // Use getAllByLabelText since there may be multiple matches
        const playButtons = screen.getAllByLabelText(/play/i);
        expect(playButtons.length).toBeGreaterThan(0);
    });

    it('shows pause button when playing', () => {
        render(
            <VideoPlayerProvider value={createMockContext({ isPlaying: true })}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        const pauseButtons = screen.getAllByLabelText(/pause/i);
        expect(pauseButtons.length).toBeGreaterThan(0);
    });

    it('applies paused class when not playing', () => {
        render(
            <VideoPlayerProvider value={createMockContext({ isPlaying: false })}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        const toolbar = screen.getByRole('toolbar');
        expect(toolbar).toHaveClass('paused');
    });

    it('applies playing class when playing', () => {
        render(
            <VideoPlayerProvider value={createMockContext({ isPlaying: true })}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        const toolbar = screen.getByRole('toolbar');
        expect(toolbar).toHaveClass('playing');
    });

    it('renders skip buttons', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(screen.getByLabelText(/skip backward/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/skip forward/i)).toBeInTheDocument();
    });

    it('renders volume control', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(screen.getByLabelText(/volume/i)).toBeInTheDocument();
    });

    it('renders time display', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        // Time display uses aria-label on span elements
        const timeElements = screen.getAllByLabelText(/current time/i);
        expect(timeElements.length).toBeGreaterThan(0);
    });

    it('renders playback rate selector', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(screen.getByLabelText(/playback speed/i)).toBeInTheDocument();
    });

    it('renders bookmark button', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(screen.getByLabelText(/bookmark/i)).toBeInTheDocument();
    });

    it('renders PiP button when enabled', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(screen.getByLabelText(/picture.in.picture|pip/i)).toBeInTheDocument();
    });

    it('renders fullscreen button when enabled', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(screen.getByLabelText(/fullscreen/i)).toBeInTheDocument();
    });

    it('renders seek bar', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(screen.getByRole('slider', { name: /video progress/i })).toBeInTheDocument();
    });

    it('has correct CSS classes for layout', () => {
        render(
            <VideoPlayerProvider value={createMockContext()}>
                <VideoControls />
            </VideoPlayerProvider>
        );

        expect(document.querySelector('.video-controls')).toBeInTheDocument();
        expect(document.querySelector('.controls-progress')).toBeInTheDocument();
        expect(document.querySelector('.controls-row')).toBeInTheDocument();
        expect(document.querySelector('.controls-left')).toBeInTheDocument();
        expect(document.querySelector('.controls-center')).toBeInTheDocument();
        expect(document.querySelector('.controls-right')).toBeInTheDocument();
    });
});
