/**
 * PauseButton Component
 * 
 * Pause control button with accessibility support.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const PauseButton = memo(function PauseButton() {
    const { state, actions } = useVideoPlayer();

    return (
        <button
            onClick={actions.pause}
            aria-label="Pause"
            className="video-control-btn pause-btn"
            disabled={state.isLoading || !!state.error}
            type="button"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
        </button>
    );
});
