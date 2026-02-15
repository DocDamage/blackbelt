/**
 * PlayButton Component
 * 
 * Play control button with accessibility support.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const PlayButton = memo(function PlayButton() {
    const { state, actions } = useVideoPlayer();

    return (
        <button
            onClick={actions.play}
            aria-label="Play"
            className="video-control-btn play-btn"
            disabled={state.isLoading || !!state.error}
            type="button"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
            </svg>
        </button>
    );
});
