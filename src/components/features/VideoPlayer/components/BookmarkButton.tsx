/**
 * BookmarkButton Component
 * 
 * Add bookmark at current time.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const BookmarkButton = memo(function BookmarkButton() {
    const { state, actions } = useVideoPlayer();

    const handleAddBookmark = () => {
        actions.addBookmark(state.currentTime);
    };

    return (
        <button
            onClick={handleAddBookmark}
            aria-label="Add bookmark at current time"
            className="video-control-btn bookmark-btn"
            title="Add Bookmark (B)"
            type="button"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
        </button>
    );
});
