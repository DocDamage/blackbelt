/**
 * VideoControls Component
 * 
 * Main control bar container with all video controls.
 */

import { memo } from 'react';
import { PlayButton } from './PlayButton';
import { PauseButton } from './PauseButton';
import { SeekBar } from './SeekBar';
import { VolumeControl } from './VolumeControl';
import { PlaybackRate } from './PlaybackRate';
import { TimeDisplay } from './TimeDisplay';
import { FullscreenButton } from './FullscreenButton';
import { PiPButton } from './PiPButton';
import { SkipButton } from './SkipButton';
import { BookmarkButton } from './BookmarkButton';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const VideoControls = memo(function VideoControls() {
    const { state } = useVideoPlayer();

    return (
        <div 
            className={`video-controls ${state.isPlaying ? 'playing' : 'paused'}`}
            role="toolbar"
            aria-label="Video controls"
        >
            {/* Progress bar */}
            <div className="controls-progress">
                <SeekBar />
            </div>
            
            {/* Control buttons row */}
            <div className="controls-row">
                {/* Left controls */}
                <div className="controls-left">
                    {state.isPlaying ? <PauseButton /> : <PlayButton />}
                    <SkipButton direction="backward" />
                    <SkipButton direction="forward" />
                    <VolumeControl />
                </div>
                
                {/* Center - Time display */}
                <div className="controls-center">
                    <TimeDisplay />
                </div>
                
                {/* Right controls */}
                <div className="controls-right">
                    <PlaybackRate />
                    <BookmarkButton />
                    <PiPButton />
                    <FullscreenButton />
                </div>
            </div>
        </div>
    );
});
