/**
 * Tests for VideoPlayerContext
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useVideoPlayer, VideoPlayerProvider } from './VideoPlayerContext';
import type { VideoPlayerContextValue } from './VideoPlayerContext';

// Test component that uses the context
function TestConsumer() {
    const context = useVideoPlayer();
    return (
        <div>
            <span data-testid="isPlaying">{context.state.isPlaying ? 'playing' : 'paused'}</span>
            <span data-testid="volume">{context.state.volume}</span>
            <button onClick={context.actions.play}>Play</button>
            <button onClick={context.actions.pause}>Pause</button>
        </div>
    );
}

describe('VideoPlayerContext', () => {
    const createMockContextValue = (): VideoPlayerContextValue => ({
        state: {
            isPlaying: false,
            isLoading: false,
            isBuffering: false,
            currentTime: 0,
            duration: 100,
            volume: 0.8,
            isMuted: false,
            playbackRate: 1,
            isFullscreen: false,
            isPiP: false,
            error: null,
        },
        bookmarks: [],
        notes: [],
        chapters: [
            { id: 'ch1', time: 0, title: 'Intro' },
            { id: 'ch2', time: 60, title: 'Main' },
        ],
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

    describe('VideoPlayerProvider', () => {
        it('renders children with provided context value', () => {
            const mockValue = createMockContextValue();
            
            render(
                <VideoPlayerProvider value={mockValue}>
                    <TestConsumer />
                </VideoPlayerProvider>
            );

            expect(screen.getByText('paused')).toBeInTheDocument();
            expect(screen.getByText('0.8')).toBeInTheDocument();
        });

        it('provides access to state', () => {
            const mockValue = createMockContextValue();
            mockValue.state.isPlaying = true;
            mockValue.state.volume = 0.5;

            render(
                <VideoPlayerProvider value={mockValue}>
                    <TestConsumer />
                </VideoPlayerProvider>
            );

            expect(screen.getByText('playing')).toBeInTheDocument();
            expect(screen.getByText('0.5')).toBeInTheDocument();
        });

        it('provides access to actions', () => {
            const mockValue = createMockContextValue();
            
            render(
                <VideoPlayerProvider value={mockValue}>
                    <TestConsumer />
                </VideoPlayerProvider>
            );

            const playButton = screen.getByText('Play');
            const pauseButton = screen.getByText('Pause');

            expect(playButton).toBeInTheDocument();
            expect(pauseButton).toBeInTheDocument();
        });

        it('calls play action when clicked', () => {
            const mockValue = createMockContextValue();
            
            render(
                <VideoPlayerProvider value={mockValue}>
                    <TestConsumer />
                </VideoPlayerProvider>
            );

            screen.getByText('Play').click();
            expect(mockValue.actions.play).toHaveBeenCalledTimes(1);
        });

        it('calls pause action when clicked', () => {
            const mockValue = createMockContextValue();
            
            render(
                <VideoPlayerProvider value={mockValue}>
                    <TestConsumer />
                </VideoPlayerProvider>
            );

            screen.getByText('Pause').click();
            expect(mockValue.actions.pause).toHaveBeenCalledTimes(1);
        });
    });

    describe('useVideoPlayer', () => {
        it('throws error when used outside provider', () => {
            // Suppress console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                render(<TestConsumer />);
            }).toThrow('useVideoPlayer must be used within VideoPlayerProvider');

            consoleSpy.mockRestore();
        });

        it('returns context value when used inside provider', () => {
            const mockValue = createMockContextValue();
            let capturedContext: VideoPlayerContextValue | null = null;

            function ContextCapture() {
                capturedContext = useVideoPlayer();
                return null;
            }

            render(
                <VideoPlayerProvider value={mockValue}>
                    <ContextCapture />
                </VideoPlayerProvider>
            );

            expect(capturedContext).not.toBeNull();
            expect(capturedContext!.state).toEqual(mockValue.state);
            expect(capturedContext!.bookmarks).toEqual(mockValue.bookmarks);
            expect(capturedContext!.chapters).toEqual(mockValue.chapters);
        });

        it('provides all required actions', () => {
            const mockValue = createMockContextValue();
            let capturedContext: VideoPlayerContextValue | null = null;

            function ContextCapture() {
                capturedContext = useVideoPlayer();
                return null;
            }

            render(
                <VideoPlayerProvider value={mockValue}>
                    <ContextCapture />
                </VideoPlayerProvider>
            );

            const actions = capturedContext!.actions;
            expect(typeof actions.play).toBe('function');
            expect(typeof actions.pause).toBe('function');
            expect(typeof actions.seek).toBe('function');
            expect(typeof actions.seekRelative).toBe('function');
            expect(typeof actions.setVolume).toBe('function');
            expect(typeof actions.toggleMute).toBe('function');
            expect(typeof actions.volumeUp).toBe('function');
            expect(typeof actions.volumeDown).toBe('function');
            expect(typeof actions.setPlaybackRate).toBe('function');
            expect(typeof actions.increaseSpeed).toBe('function');
            expect(typeof actions.decreaseSpeed).toBe('function');
            expect(typeof actions.toggleFullscreen).toBe('function');
            expect(typeof actions.togglePiP).toBe('function');
            expect(typeof actions.addBookmark).toBe('function');
            expect(typeof actions.removeBookmark).toBe('function');
            expect(typeof actions.addNote).toBe('function');
            expect(typeof actions.updateNote).toBe('function');
            expect(typeof actions.removeNote).toBe('function');
            expect(typeof actions.jumpToChapter).toBe('function');
            expect(typeof actions.clearError).toBe('function');
        });

        it('provides config with required properties', () => {
            const mockValue = createMockContextValue();
            let capturedContext: VideoPlayerContextValue | null = null;

            function ContextCapture() {
                capturedContext = useVideoPlayer();
                return null;
            }

            render(
                <VideoPlayerProvider value={mockValue}>
                    <ContextCapture />
                </VideoPlayerProvider>
            );

            const config = capturedContext!.config;
            expect(Array.isArray(config.playbackRates)).toBe(true);
            expect(typeof config.skipDuration).toBe('number');
            expect(typeof config.volumeStep).toBe('number');
            expect(typeof config.enablePiP).toBe('boolean');
            expect(typeof config.enableFullscreen).toBe('boolean');
        });
    });

    describe('Context with bookmarks and notes', () => {
        it('provides bookmarks array', () => {
            const mockValue = createMockContextValue();
            mockValue.bookmarks = [
                { id: 'bm1', time: 30, label: 'Important', createdAt: new Date() },
            ];

            let capturedContext: VideoPlayerContextValue | null = null;
            function ContextCapture() {
                capturedContext = useVideoPlayer();
                return null;
            }

            render(
                <VideoPlayerProvider value={mockValue}>
                    <ContextCapture />
                </VideoPlayerProvider>
            );

            expect(capturedContext!.bookmarks).toHaveLength(1);
            expect(capturedContext!.bookmarks[0]!.time).toBe(30);
        });

        it('provides notes array', () => {
            const mockValue = createMockContextValue();
            mockValue.notes = [
                { 
                    id: 'note1', 
                    timestamp: 45, 
                    content: 'Key concept', 
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ];

            let capturedContext: VideoPlayerContextValue | null = null;
            function ContextCapture() {
                capturedContext = useVideoPlayer();
                return null;
            }

            render(
                <VideoPlayerProvider value={mockValue}>
                    <ContextCapture />
                </VideoPlayerProvider>
            );

            expect(capturedContext!.notes).toHaveLength(1);
            expect(capturedContext!.notes[0]!.content).toBe('Key concept');
        });
    });
});
