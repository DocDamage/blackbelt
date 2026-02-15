/**
 * VideoChapters Component
 * 
 * Chapter list sidebar for video navigation.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';
import { formatTime } from '../VideoPlayer.utils';

export const VideoChapters = memo(function VideoChapters() {
    const { state, actions, chapters } = useVideoPlayer();

    if (chapters.length === 0) {
        return null;
    }

    return (
        <div className="video-chapters-panel">
            <h4 className="chapters-title">📚 Chapters</h4>
            <ul className="chapters-list" role="list">
                {chapters.map(chapter => {
                    const isActive = state.currentTime >= chapter.time && 
                        state.currentTime < (chapters.find(c => c.time > chapter.time)?.time ?? Infinity);
                    
                    return (
                        <li 
                            key={chapter.id}
                            className={`chapter-item ${isActive ? 'active' : ''}`}
                        >
                            <button
                                onClick={() => actions.seek(chapter.time)}
                                className="chapter-button"
                                aria-current={isActive ? 'true' : undefined}
                                type="button"
                            >
                                <span className="chapter-time">{formatTime(chapter.time)}</span>
                                <span className="chapter-title">{chapter.title}</span>
                            </button>
                            {chapter.description && (
                                <p className="chapter-description">{chapter.description}</p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
});
