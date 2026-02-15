/**
 * PlaybackRate Component
 * 
 * Playback speed selector.
 */

import React, { memo, useCallback } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const PlaybackRate = memo(function PlaybackRate() {
    const { state, actions, config } = useVideoPlayer();

    const handleRateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const rate = parseFloat(e.target.value);
        actions.setPlaybackRate(rate);
    }, [actions]);

    return (
        <div className="playback-rate-control">
            <label htmlFor="playback-rate" className="visually-hidden">
                Playback Speed
            </label>
            <select
                id="playback-rate"
                value={state.playbackRate}
                onChange={handleRateChange}
                className="playback-rate-select"
                aria-label="Playback speed"
            >
                {config.playbackRates.map(rate => (
                    <option key={rate} value={rate}>
                        {rate === 1 ? 'Normal' : `${rate}x`}
                    </option>
                ))}
            </select>
        </div>
    );
});
