/**
 * PlayOverlay Component
 * 
 * Large play button overlay shown when video is paused.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const PlayOverlay = memo(function PlayOverlay() {
    const { state, actions } = useVideoPlayer();

    if (state.isPlaying || state.isLoading || state.error) {
        return null;
    }

    return (
        <button
            className="play-overlay"
            onClick={actions.play}
            aria-label="Play video"
            type="button"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
            </svg>
        </button>
    );
});
