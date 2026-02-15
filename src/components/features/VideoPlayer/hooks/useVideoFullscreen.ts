/**
 * useVideoFullscreen Hook
 * 
 * Fullscreen API integration for video player.
 */

import { useCallback, useEffect, useState } from 'react';

interface UseVideoFullscreenProps {
    containerRef: React.RefObject<HTMLElement>;
    onFullscreenChange?: (isFullscreen: boolean) => void;
}

export function useVideoFullscreen({
    containerRef,
    onFullscreenChange,
}: UseVideoFullscreenProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Check if fullscreen API is supported
        setIsEnabled(
            !!(document.fullscreenEnabled ||
            (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled)
        );
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenElement =
                document.fullscreenElement ||
                (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement;
            
            const isCurrentlyFullscreen = !!fullscreenElement;
            setIsFullscreen(isCurrentlyFullscreen);
            onFullscreenChange?.(isCurrentlyFullscreen);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, [onFullscreenChange]);

    const enterFullscreen = useCallback(async () => {
        if (!containerRef.current || !isEnabled) return;

        try {
            const element = containerRef.current;
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if ((element as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
                await (element as unknown as { webkitRequestFullscreen(): Promise<void> }).webkitRequestFullscreen();
            }
        } catch (error) {
            console.error('Failed to enter fullscreen:', error);
        }
    }, [containerRef, isEnabled]);

    const exitFullscreen = useCallback(async () => {
        if (!isEnabled) return;

        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
                await (document as unknown as { webkitExitFullscreen(): Promise<void> }).webkitExitFullscreen();
            }
        } catch (error) {
            console.error('Failed to exit fullscreen:', error);
        }
    }, [isEnabled]);

    const toggleFullscreen = useCallback(() => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }, [isFullscreen, enterFullscreen, exitFullscreen]);

    return {
        isFullscreen,
        isEnabled,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
    };
}
