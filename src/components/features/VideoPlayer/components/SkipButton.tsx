/**
 * SkipButton Component
 * 
 * Skip forward/backward control button.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

interface SkipButtonProps {
    direction: 'forward' | 'backward';
}

export const SkipButton = memo(function SkipButton({ direction }: SkipButtonProps) {
    const { actions, config } = useVideoPlayer();
    const isForward = direction === 'forward';

    return (
        <button
            onClick={() => actions.seekRelative(isForward ? config.skipDuration : -config.skipDuration)}
            aria-label={isForward ? `Skip forward ${config.skipDuration} seconds` : `Skip backward ${config.skipDuration} seconds`}
            className={`video-control-btn skip-btn skip-${direction}`}
            type="button"
        >
            {isForward ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                </svg>
            )}
            <span className="skip-label" aria-hidden="true">{config.skipDuration}</span>
        </button>
    );
});
