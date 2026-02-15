/**
 * VideoNotes Component
 * 
 * Notes panel for taking timestamped notes.
 */

import { memo, useState } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';
import { formatTime } from '../VideoPlayer.utils';

export const VideoNotes = memo(function VideoNotes() {
    const { state, notes, actions } = useVideoPlayer();
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        actions.addNote(state.currentTime, newNote.trim());
        setNewNote('');
    };

    const handleEdit = (id: string, content: string) => {
        setEditingId(id);
        setEditContent(content);
    };

    const handleSave = (id: string) => {
        if (editContent.trim()) {
            actions.updateNote(id, editContent.trim());
        }
        setEditingId(null);
    };

    return (
        <div className="video-notes-panel">
            <h4 className="notes-title">📝 Notes</h4>
            
            {/* Add new note */}
            <div className="notes-input-area">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Take a note at current time..."
                    rows={3}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                            handleAddNote();
                        }
                    }}
                />
                <button 
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="add-note-btn"
                    type="button"
                >
                    Add at {formatTime(state.currentTime)}
                </button>
            </div>

            {/* Notes list */}
            {notes.length > 0 && (
                <ul className="notes-list" role="list">
                    {notes.map(note => (
                        <li key={note.id} className="note-item">
                            {editingId === note.id ? (
                                <div className="note-edit">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={3}
                                        autoFocus
                                    />
                                    <div className="note-edit-actions">
                                        <button 
                                            onClick={() => handleSave(note.id)}
                                            type="button"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={() => setEditingId(null)}
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="note-display">
                                    <button
                                        onClick={() => actions.seek(note.timestamp)}
                                        className="note-timestamp"
                                        type="button"
                                    >
                                        {formatTime(note.timestamp)}
                                    </button>
                                    <p className="note-content">{note.content}</p>
                                    <div className="note-actions">
                                        <button
                                            onClick={() => handleEdit(note.id, note.content)}
                                            aria-label="Edit note"
                                            className="note-action-btn"
                                            type="button"
                                        >
                                            ✎
                                        </button>
                                        <button
                                            onClick={() => actions.removeNote(note.id)}
                                            aria-label="Delete note"
                                            className="note-action-btn"
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
            )}
        </div>
    );
});
