/**
 * Tests for useVideoState Hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVideoState } from './useVideoState';

describe('useVideoState', () => {
    it('initializes with correct default state', () => {
        const { result } = renderHook(() => useVideoState());

        expect(result.current.state.isPlaying).toBe(false);
        expect(result.current.state.isLoading).toBe(true);
        expect(result.current.state.isBuffering).toBe(false);
        expect(result.current.state.currentTime).toBe(0);
        expect(result.current.state.duration).toBe(0);
        expect(result.current.state.volume).toBe(1);
        expect(result.current.state.isMuted).toBe(false);
        expect(result.current.state.playbackRate).toBe(1);
        expect(result.current.state.isFullscreen).toBe(false);
        expect(result.current.state.isPiP).toBe(false);
        expect(result.current.state.error).toBeNull();
    });

    describe('play action', () => {
        it('sets isPlaying to true', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.play();
            });

            expect(result.current.state.isPlaying).toBe(true);
        });

        it('clears any existing error', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setError({ code: 'ERROR', message: 'Test', recoverable: true });
            });

            expect(result.current.state.error).not.toBeNull();

            act(() => {
                result.current.actions.play();
            });

            expect(result.current.state.error).toBeNull();
        });
    });

    describe('pause action', () => {
        it('sets isPlaying to false', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.play();
            });

            act(() => {
                result.current.actions.pause();
            });

            expect(result.current.state.isPlaying).toBe(false);
        });
    });

    describe('setLoading action', () => {
        it('sets isLoading to true', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setLoading(true);
            });

            expect(result.current.state.isLoading).toBe(true);
        });

        it('sets isLoading to false', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setLoading(false);
            });

            expect(result.current.state.isLoading).toBe(false);
        });
    });

    describe('setBuffering action', () => {
        it('sets isBuffering to true', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setBuffering(true);
            });

            expect(result.current.state.isBuffering).toBe(true);
        });

        it('sets isBuffering to false', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setBuffering(true);
            });

            act(() => {
                result.current.actions.setBuffering(false);
            });

            expect(result.current.state.isBuffering).toBe(false);
        });
    });

    describe('setTime action', () => {
        it('updates currentTime', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setTime(30);
            });

            expect(result.current.state.currentTime).toBe(30);
        });

        it('handles zero', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setTime(100);
            });

            act(() => {
                result.current.actions.setTime(0);
            });

            expect(result.current.state.currentTime).toBe(0);
        });
    });

    describe('setDuration action', () => {
        it('updates duration', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setDuration(120);
            });

            expect(result.current.state.duration).toBe(120);
        });
    });

    describe('setVolume action', () => {
        it('updates volume', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setVolume(0.5);
            });

            expect(result.current.state.volume).toBe(0.5);
        });

        it('sets isMuted to true when volume is 0', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setVolume(0);
            });

            expect(result.current.state.volume).toBe(0);
            expect(result.current.state.isMuted).toBe(true);
        });

        it('sets isMuted to false when volume is greater than 0', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setMuted(true);
            });

            act(() => {
                result.current.actions.setVolume(0.5);
            });

            expect(result.current.state.isMuted).toBe(false);
        });
    });

    describe('toggleMute action', () => {
        it('toggles isMuted from false to true', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.toggleMute();
            });

            expect(result.current.state.isMuted).toBe(true);
        });

        it('toggles isMuted from true to false', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.toggleMute();
            });

            act(() => {
                result.current.actions.toggleMute();
            });

            expect(result.current.state.isMuted).toBe(false);
        });
    });

    describe('setMuted action', () => {
        it('sets isMuted directly', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setMuted(true);
            });

            expect(result.current.state.isMuted).toBe(true);

            act(() => {
                result.current.actions.setMuted(false);
            });

            expect(result.current.state.isMuted).toBe(false);
        });
    });

    describe('setPlaybackRate action', () => {
        it('updates playbackRate', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setPlaybackRate(1.5);
            });

            expect(result.current.state.playbackRate).toBe(1.5);
        });

        it('handles different playback rates', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setPlaybackRate(0.5);
            });

            expect(result.current.state.playbackRate).toBe(0.5);

            act(() => {
                result.current.actions.setPlaybackRate(2);
            });

            expect(result.current.state.playbackRate).toBe(2);
        });
    });

    describe('setFullscreen action', () => {
        it('updates isFullscreen', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setFullscreen(true);
            });

            expect(result.current.state.isFullscreen).toBe(true);

            act(() => {
                result.current.actions.setFullscreen(false);
            });

            expect(result.current.state.isFullscreen).toBe(false);
        });
    });

    describe('setPiP action', () => {
        it('updates isPiP', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setPiP(true);
            });

            expect(result.current.state.isPiP).toBe(true);

            act(() => {
                result.current.actions.setPiP(false);
            });

            expect(result.current.state.isPiP).toBe(false);
        });
    });

    describe('setError action', () => {
        it('sets error and pauses playback', () => {
            const { result } = renderHook(() => useVideoState());
            const error = { code: 'LOAD_ERROR', message: 'Failed to load', recoverable: true };

            act(() => {
                result.current.actions.play();
            });

            act(() => {
                result.current.actions.setError(error);
            });

            expect(result.current.state.error).toEqual(error);
            expect(result.current.state.isPlaying).toBe(false);
            expect(result.current.state.isLoading).toBe(false);
        });
    });

    describe('clearError action', () => {
        it('clears the error', () => {
            const { result } = renderHook(() => useVideoState());
            const error = { code: 'LOAD_ERROR', message: 'Failed to load', recoverable: true };

            act(() => {
                result.current.actions.setError(error);
            });

            act(() => {
                result.current.actions.clearError();
            });

            expect(result.current.state.error).toBeNull();
        });
    });

    describe('reset action', () => {
        it('resets state to initial values', () => {
            const { result } = renderHook(() => useVideoState());

            // Modify various state values
            act(() => {
                result.current.actions.play();
                result.current.actions.setTime(100);
                result.current.actions.setDuration(200);
                result.current.actions.setVolume(0.5);
                result.current.actions.setPlaybackRate(1.5);
                result.current.actions.setFullscreen(true);
            });

            // Reset
            act(() => {
                result.current.actions.reset();
            });

            // Verify back to initial state
            expect(result.current.state.isPlaying).toBe(false);
            expect(result.current.state.isLoading).toBe(true);
            expect(result.current.state.currentTime).toBe(0);
            expect(result.current.state.duration).toBe(0);
            expect(result.current.state.volume).toBe(1);
            expect(result.current.state.playbackRate).toBe(1);
            expect(result.current.state.isFullscreen).toBe(false);
        });
    });

    describe('complex state interactions', () => {
        it('handles play/pause toggle flow', () => {
            const { result } = renderHook(() => useVideoState());

            expect(result.current.state.isPlaying).toBe(false);

            act(() => {
                result.current.actions.play();
            });
            expect(result.current.state.isPlaying).toBe(true);

            act(() => {
                result.current.actions.pause();
            });
            expect(result.current.state.isPlaying).toBe(false);

            act(() => {
                result.current.actions.play();
            });
            expect(result.current.state.isPlaying).toBe(true);
        });

        it('maintains time during pause/play cycles', () => {
            const { result } = renderHook(() => useVideoState());

            act(() => {
                result.current.actions.setTime(60);
                result.current.actions.play();
            });
            expect(result.current.state.currentTime).toBe(60);

            act(() => {
                result.current.actions.pause();
            });
            expect(result.current.state.currentTime).toBe(60);

            act(() => {
                result.current.actions.play();
            });
            expect(result.current.state.currentTime).toBe(60);
        });

        it('handles error recovery flow', () => {
            const { result } = renderHook(() => useVideoState());

            // Start playing
            act(() => {
                result.current.actions.play();
            });
            expect(result.current.state.isPlaying).toBe(true);

            // Error occurs
            act(() => {
                result.current.actions.setError({ code: 'ERROR', message: 'Test', recoverable: true });
            });
            expect(result.current.state.isPlaying).toBe(false);
            expect(result.current.state.error).not.toBeNull();

            // Clear error and resume
            act(() => {
                result.current.actions.clearError();
            });
            expect(result.current.state.error).toBeNull();

            act(() => {
                result.current.actions.play();
            });
            expect(result.current.state.isPlaying).toBe(true);
        });
    });
});
