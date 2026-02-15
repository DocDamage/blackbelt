/**
 * PiPButton Component
 * 
 * Picture-in-Picture toggle button.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const PiPButton = memo(function PiPButton() {
    const { state, actions, config } = useVideoPlayer();

    // PiP availability would typically be checked via the hook
    // For now, we rely on the config flag
    if (!config.enablePiP) {
        return null;
    }

    return (
        <button
            onClick={actions.togglePiP}
            aria-label={state.isPiP ? 'Exit picture-in-picture' : 'Enter picture-in-picture'}
            aria-pressed={state.isPiP}
            className="video-control-btn pip-btn"
            type="button"
        >
            {state.isPiP ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" />
                </svg>
            )}
        </button>
    );
});
