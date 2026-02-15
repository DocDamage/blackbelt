/**
 * useVideoKeyboard Hook
 * 
 * Keyboard shortcuts for video player controls.
 */

import { useEffect, useCallback } from 'react';

interface KeyboardActions {
    togglePlay: () => void;
    seekBackward: (seconds: number) => void;
    seekForward: (seconds: number) => void;
    seekToPercentage: (percentage: number) => void;
    volumeUp: () => void;
    volumeDown: () => void;
    toggleMute: () => void;
    toggleFullscreen: () => void;
    togglePiP: () => void;
    increaseSpeed: () => void;
    decreaseSpeed: () => void;
    addBookmark: () => void;
    jumpToStart: () => void;
    jumpToEnd: () => void;
}

interface UseVideoKeyboardProps {
    enabled: boolean;
    actions: KeyboardActions;
    skipDuration: number;
    volumeStep: number;
    isActive: boolean;
    playbackRates: number[];
    currentPlaybackRate: number;
}

export function useVideoKeyboard({
    enabled,
    actions,
    skipDuration,
    volumeStep,
    isActive,
    playbackRates,
    currentPlaybackRate,
}: UseVideoKeyboardProps) {
    const getNextPlaybackRate = useCallback((direction: 'up' | 'down'): number => {
        const currentIndex = playbackRates.indexOf(currentPlaybackRate);
        if (currentIndex === -1) return 1;
        
        if (direction === 'up') {
            const nextIndex = Math.min(currentIndex + 1, playbackRates.length - 1);
            return playbackRates[nextIndex] ?? 1;
        } else {
            const prevIndex = Math.max(currentIndex - 1, 0);
            return playbackRates[prevIndex] ?? 1;
        }
    }, [playbackRates, currentPlaybackRate]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled || !isActive) return;

        // Don't capture if user is typing in an input or textarea
        const target = event.target as HTMLElement;
        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target.isContentEditable
        ) {
            return;
        }

        switch (event.key) {
            case ' ':
            case 'k':
            case 'K':
                event.preventDefault();
                actions.togglePlay();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                actions.seekBackward(event.shiftKey ? skipDuration * 2 : skipDuration);
                break;
            case 'ArrowRight':
                event.preventDefault();
                actions.seekForward(event.shiftKey ? skipDuration * 2 : skipDuration);
                break;
            case 'ArrowUp':
                event.preventDefault();
                actions.volumeUp();
                break;
            case 'ArrowDown':
                event.preventDefault();
                actions.volumeDown();
                break;
            case 'm':
            case 'M':
                event.preventDefault();
                actions.toggleMute();
                break;
            case 'f':
            case 'F':
                event.preventDefault();
                actions.toggleFullscreen();
                break;
            case 'p':
            case 'P':
                event.preventDefault();
                actions.togglePiP();
                break;
            case '>':
            case '.':
                event.preventDefault();
                actions.increaseSpeed();
                break;
            case '<':
            case ',':
                event.preventDefault();
                actions.decreaseSpeed();
                break;
            case 'b':
            case 'B':
                event.preventDefault();
                actions.addBookmark();
                break;
            case 'Home':
                event.preventDefault();
                actions.jumpToStart();
                break;
            case 'End':
                event.preventDefault();
                actions.jumpToEnd();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9': {
                // Jump to percentage (0-9 -> 0%-90%)
                event.preventDefault();
                const percentage = parseInt(event.key, 10) * 10;
                actions.seekToPercentage(percentage);
                break;
            }
            default:
                break;
        }
    }, [enabled, isActive, actions, skipDuration, volumeStep]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return { getNextPlaybackRate };
}
