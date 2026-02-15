/**
 * Tests for useVideoKeyboard Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVideoKeyboard } from './useVideoKeyboard';

describe('useVideoKeyboard', () => {
    const mockActions = {
        togglePlay: vi.fn(),
        seekBackward: vi.fn(),
        seekForward: vi.fn(),
        seekToPercentage: vi.fn(),
        volumeUp: vi.fn(),
        volumeDown: vi.fn(),
        toggleMute: vi.fn(),
        toggleFullscreen: vi.fn(),
        togglePiP: vi.fn(),
        increaseSpeed: vi.fn(),
        decreaseSpeed: vi.fn(),
        addBookmark: vi.fn(),
        jumpToStart: vi.fn(),
        jumpToEnd: vi.fn(),
    };

    const defaultProps = {
        enabled: true,
        isActive: true,
        skipDuration: 10,
        volumeStep: 0.1,
        playbackRates: [0.5, 1, 1.5, 2],
        currentPlaybackRate: 1,
        actions: mockActions,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Playback Control Keys', () => {
        it('toggles play on space key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: ' ' });
            document.dispatchEvent(event);

            expect(mockActions.togglePlay).toHaveBeenCalled();
        });

        it('toggles play on k key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'k' });
            document.dispatchEvent(event);

            expect(mockActions.togglePlay).toHaveBeenCalled();
        });

        it('seeks backward on ArrowLeft', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            document.dispatchEvent(event);

            expect(mockActions.seekBackward).toHaveBeenCalledWith(10);
        });

        it('seeks forward on ArrowRight', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            document.dispatchEvent(event);

            expect(mockActions.seekForward).toHaveBeenCalledWith(10);
        });

        it('doubles skip duration with shift key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true });
            document.dispatchEvent(event);

            expect(mockActions.seekForward).toHaveBeenCalledWith(20);
        });
    });

    describe('Percentage-Based Seeking', () => {
        it('seeks to 0% on 0 key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: '0' });
            document.dispatchEvent(event);

            expect(mockActions.seekToPercentage).toHaveBeenCalledWith(0);
        });

        it('seeks to 10% on 1 key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: '1' });
            document.dispatchEvent(event);

            expect(mockActions.seekToPercentage).toHaveBeenCalledWith(10);
        });

        it('seeks to 50% on 5 key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: '5' });
            document.dispatchEvent(event);

            expect(mockActions.seekToPercentage).toHaveBeenCalledWith(50);
        });

        it('seeks to 90% on 9 key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: '9' });
            document.dispatchEvent(event);

            expect(mockActions.seekToPercentage).toHaveBeenCalledWith(90);
        });

        it('prevents default behavior for number keys', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: '5' });
            const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
            document.dispatchEvent(event);

            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });

    describe('Volume Control', () => {
        it('increases volume on ArrowUp', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            document.dispatchEvent(event);

            expect(mockActions.volumeUp).toHaveBeenCalled();
        });

        it('decreases volume on ArrowDown', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            document.dispatchEvent(event);

            expect(mockActions.volumeDown).toHaveBeenCalled();
        });

        it('toggles mute on m key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'm' });
            document.dispatchEvent(event);

            expect(mockActions.toggleMute).toHaveBeenCalled();
        });
    });

    describe('Display Mode Keys', () => {
        it('toggles fullscreen on f key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'f' });
            document.dispatchEvent(event);

            expect(mockActions.toggleFullscreen).toHaveBeenCalled();
        });

        it('toggles PiP on p key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'p' });
            document.dispatchEvent(event);

            expect(mockActions.togglePiP).toHaveBeenCalled();
        });
    });

    describe('Playback Rate Keys', () => {
        it('increases speed on > key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: '>' });
            document.dispatchEvent(event);

            expect(mockActions.increaseSpeed).toHaveBeenCalled();
        });

        it('increases speed on . key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: '.' });
            document.dispatchEvent(event);

            expect(mockActions.increaseSpeed).toHaveBeenCalled();
        });

        it('decreases speed on < key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: '<' });
            document.dispatchEvent(event);

            expect(mockActions.decreaseSpeed).toHaveBeenCalled();
        });

        it('decreases speed on , key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: ',' });
            document.dispatchEvent(event);

            expect(mockActions.decreaseSpeed).toHaveBeenCalled();
        });
    });

    describe('Navigation Keys', () => {
        it('jumps to start on Home key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'Home' });
            document.dispatchEvent(event);

            expect(mockActions.jumpToStart).toHaveBeenCalled();
        });

        it('jumps to end on End key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'End' });
            document.dispatchEvent(event);

            expect(mockActions.jumpToEnd).toHaveBeenCalled();
        });

        it('adds bookmark on b key', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const event = new KeyboardEvent('keydown', { key: 'b' });
            document.dispatchEvent(event);

            expect(mockActions.addBookmark).toHaveBeenCalled();
        });
    });

    describe('Disabled States', () => {
        it('does not handle keys when disabled', () => {
            renderHook(() => useVideoKeyboard({ ...defaultProps, enabled: false }));
            
            const event = new KeyboardEvent('keydown', { key: ' ' });
            document.dispatchEvent(event);

            expect(mockActions.togglePlay).not.toHaveBeenCalled();
        });

        it('does not handle keys when not active', () => {
            renderHook(() => useVideoKeyboard({ ...defaultProps, isActive: false }));
            
            const event = new KeyboardEvent('keydown', { key: ' ' });
            document.dispatchEvent(event);

            expect(mockActions.togglePlay).not.toHaveBeenCalled();
        });
    });

    describe('Input Element Handling', () => {
        it('ignores keys when user is typing in input', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();
            
            const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
            input.dispatchEvent(event);

            expect(mockActions.togglePlay).not.toHaveBeenCalled();
            
            document.body.removeChild(input);
        });

        it('ignores keys when user is typing in textarea', () => {
            renderHook(() => useVideoKeyboard(defaultProps));
            
            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.focus();
            
            const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
            textarea.dispatchEvent(event);

            expect(mockActions.togglePlay).not.toHaveBeenCalled();
            
            document.body.removeChild(textarea);
        });
    });

    describe('getNextPlaybackRate', () => {
        it('returns next higher playback rate', () => {
            const { result } = renderHook(() => useVideoKeyboard(defaultProps));
            
            const nextRate = result.current.getNextPlaybackRate('up');
            expect(nextRate).toBe(1.5);
        });

        it('returns next lower playback rate', () => {
            const { result } = renderHook(() => useVideoKeyboard({
                ...defaultProps,
                currentPlaybackRate: 1.5,
            }));
            
            const prevRate = result.current.getNextPlaybackRate('down');
            expect(prevRate).toBe(1);
        });

        it('caps at maximum rate', () => {
            const { result } = renderHook(() => useVideoKeyboard({
                ...defaultProps,
                currentPlaybackRate: 2,
            }));
            
            const nextRate = result.current.getNextPlaybackRate('up');
            expect(nextRate).toBe(2);
        });

        it('caps at minimum rate', () => {
            const { result } = renderHook(() => useVideoKeyboard({
                ...defaultProps,
                currentPlaybackRate: 0.5,
            }));
            
            const prevRate = result.current.getNextPlaybackRate('down');
            expect(prevRate).toBe(0.5);
        });

        it('returns 1 for unknown current rate', () => {
            const { result } = renderHook(() => useVideoKeyboard({
                ...defaultProps,
                currentPlaybackRate: 3,
            }));
            
            const nextRate = result.current.getNextPlaybackRate('up');
            expect(nextRate).toBe(1);
        });
    });
});
