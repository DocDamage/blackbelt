/**
 * TimeDisplay Component
 * 
 * Current time and duration display.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';
import { formatTime } from '../VideoPlayer.utils';

export const TimeDisplay = memo(function TimeDisplay() {
    const { state } = useVideoPlayer();

    return (
        <div className="time-display" aria-live="off">
            <span className="current-time" aria-label="Current time">
                {formatTime(state.currentTime)}
            </span>
            <span className="time-separator" aria-hidden="true"> / </span>
            <span className="duration" aria-label="Total duration">
                {formatTime(state.duration)}
            </span>
        </div>
    );
});
