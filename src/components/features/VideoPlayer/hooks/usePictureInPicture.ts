/**
 * usePictureInPicture Hook
 * 
 * Picture-in-Picture API integration for video player.
 */

import { useCallback, useEffect, useState } from 'react';

interface UsePictureInPictureProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    onPiPChange?: (isPiP: boolean) => void;
}

// Extend HTMLVideoElement with PiP properties
type VideoElementWithPiP = HTMLVideoElement & {
    webkitSetPresentationMode?: (mode: 'inline' | 'picture-in-picture' | 'fullscreen') => Promise<void>;
    webkitPresentationMode?: 'inline' | 'picture-in-picture' | 'fullscreen';
};

export function usePictureInPicture({
    videoRef,
    onPiPChange,
}: UsePictureInPictureProps) {
    const [isPiP, setIsPiP] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        const video = videoRef.current as VideoElementWithPiP | null;
        if (!video) return;

        // Check if PiP is supported
        const hasPiP = 
            document.pictureInPictureEnabled ||
            !!video.webkitSetPresentationMode;
        
        setIsEnabled(hasPiP);
    }, [videoRef]);

    useEffect(() => {
        const handleEnterPiP = () => {
            setIsPiP(true);
            onPiPChange?.(true);
        };

        const handleLeavePiP = () => {
            setIsPiP(false);
            onPiPChange?.(false);
        };

        const video = videoRef.current as VideoElementWithPiP | null;
        if (!video) return;

        video.addEventListener('enterpictureinpicture', handleEnterPiP);
        video.addEventListener('leavepictureinpicture', handleLeavePiP);

        return () => {
            video.removeEventListener('enterpictureinpicture', handleEnterPiP);
            video.removeEventListener('leavepictureinpicture', handleLeavePiP);
        };
    }, [videoRef, onPiPChange]);

    const enterPiP = useCallback(async () => {
        const video = videoRef.current as VideoElementWithPiP | null;
        if (!video || !isEnabled) return;

        try {
            if (video.requestPictureInPicture) {
                await video.requestPictureInPicture();
            } else if (video.webkitSetPresentationMode) {
                await video.webkitSetPresentationMode('picture-in-picture');
            }
        } catch (error) {
            console.error('Failed to enter PiP:', error);
        }
    }, [videoRef, isEnabled]);

    const exitPiP = useCallback(async () => {
        const video = videoRef.current as VideoElementWithPiP | null;
        if (!isEnabled) return;

        try {
            if (document.exitPictureInPicture) {
                await document.exitPictureInPicture();
            } else if (video?.webkitSetPresentationMode) {
                await video.webkitSetPresentationMode('inline');
            }
        } catch (error) {
            console.error('Failed to exit PiP:', error);
        }
    }, [isEnabled, videoRef]);

    const togglePiP = useCallback(() => {
        if (isPiP) {
            exitPiP();
        } else {
            enterPiP();
        }
    }, [isPiP, enterPiP, exitPiP]);

    return {
        isPiP,
        isEnabled,
        enterPiP,
        exitPiP,
        togglePiP,
    };
}
