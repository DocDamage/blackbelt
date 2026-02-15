/**
 * SeekBar Component
 * 
 * Progress bar with chapter markers and preview tooltip.
 */

import { memo, useCallback, useRef, useState } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';
import { formatTime } from '../VideoPlayer.utils';

export const SeekBar = memo(function SeekBar() {
    const { state, actions, chapters } = useVideoPlayer();
    const [_isDragging, setIsDragging] = useState(false);
    const [previewTime, setPreviewTime] = useState<number | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const percentage = state.duration > 0 
        ? (state.currentTime / state.duration) * 100 
        : 0;

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || state.duration === 0) return;
        
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const time = pos * state.duration;
        actions.seek(time);
    }, [actions, state.duration]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || state.duration === 0) return;
        
        const rect = progressRef.current.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setPreviewTime(pos * state.duration);
    }, [state.duration]);

    const handleMouseLeave = useCallback(() => {
        setPreviewTime(null);
        setIsDragging(false);
    }, []);

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        const skipAmount = state.duration * 0.05; // 5% skip
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                actions.seekRelative(-skipAmount);
                break;
            case 'ArrowRight':
                e.preventDefault();
                actions.seekRelative(skipAmount);
                break;
            case 'Home':
                e.preventDefault();
                actions.seek(0);
                break;
            case 'End':
                e.preventDefault();
                actions.seek(state.duration);
                break;
        }
    }, [actions, state.duration]);

    return (
        <div 
            className="seek-bar-container"
            ref={progressRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onKeyDown={handleKeyDown}
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={Math.round(state.duration)}
            aria-valuenow={Math.round(state.currentTime)}
            aria-valuetext={`${formatTime(state.currentTime)} of ${formatTime(state.duration)}`}
            tabIndex={0}
        >
            {/* Background track */}
            <div className="seek-bar-track" />
            
            {/* Current progress */}
            <div 
                className="seek-bar-progress" 
                style={{ width: `${percentage}%` }}
            />
            
            {/* Chapter markers */}
            {chapters.map(chapter => {
                const chapterPercent = state.duration > 0 
                    ? (chapter.time / state.duration) * 100 
                    : 0;
                return (
                    <div
                        key={chapter.id}
                        className="chapter-marker"
                        style={{ left: `${chapterPercent}%` }}
                        title={chapter.title}
                        role="button"
                        aria-label={`Jump to chapter: ${chapter.title}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            actions.seek(chapter.time);
                        }}
                    />
                );
            })}
            
            {/* Drag handle */}
            <div 
                className="seek-bar-handle"
                style={{ left: `${percentage}%` }}
            />
            
            {/* Time preview tooltip */}
            {previewTime !== null && (
                <div 
                    className="time-preview"
                    style={{ 
                        left: `${(previewTime / state.duration) * 100}%` 
                    }}
                >
                    {formatTime(previewTime)}
                </div>
            )}
        </div>
    );
});
