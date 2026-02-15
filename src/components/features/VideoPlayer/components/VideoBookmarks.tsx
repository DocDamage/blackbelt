/**
 * VideoBookmarks Component
 * 
 * Bookmark list panel for quick navigation.
 */

import { memo, useState } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';
import { formatTime } from '../VideoPlayer.utils';

export const VideoBookmarks = memo(function VideoBookmarks() {
    const { bookmarks, actions } = useVideoPlayer();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState('');

    if (bookmarks.length === 0) {
        return null;
    }

    const handleEdit = (id: string, currentLabel?: string) => {
        setEditingId(id);
        setEditLabel(currentLabel || '');
    };

    const handleSave = (_id: string) => {
        // Note: This would need a method to update bookmark labels
        // For now, we'll just clear the editing state
        setEditingId(null);
    };

    return (
        <div className="video-bookmarks-panel">
            <h4 className="bookmarks-title">🔖 Bookmarks</h4>
            <ul className="bookmarks-list" role="list">
                {bookmarks.map(bookmark => (
                    <li key={bookmark.id} className="bookmark-item">
                        {editingId === bookmark.id ? (
                            <div className="bookmark-edit">
                                <input
                                    type="text"
                                    value={editLabel}
                                    onChange={(e) => setEditLabel(e.target.value)}
                                    placeholder="Bookmark label"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSave(bookmark.id);
                                        if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    autoFocus
                                />
                                <button 
                                    onClick={() => handleSave(bookmark.id)}
                                    aria-label="Save bookmark label"
                                    type="button"
                                >
                                    ✓
                                </button>
                            </div>
                        ) : (
                            <div className="bookmark-display">
                                <button
                                    onClick={() => actions.seek(bookmark.time)}
                                    className="bookmark-time-btn"
                                    type="button"
                                >
                                    {formatTime(bookmark.time)}
                                </button>
                                {bookmark.label && (
                                    <span className="bookmark-label">{bookmark.label}</span>
                                )}
                                <div className="bookmark-actions">
                                    <button
                                        onClick={() => handleEdit(bookmark.id, bookmark.label)}
                                        aria-label="Edit bookmark"
                                        className="bookmark-action-btn"
                                        type="button"
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={() => actions.removeBookmark(bookmark.id)}
                                        aria-label="Remove bookmark"
                                        className="bookmark-action-btn"
                                        type="button"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
});
