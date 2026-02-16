/**
 * Community Notes Component
 * 
 * Allows users to share and vote on notes for each lesson
 */

import { useState, useEffect, useCallback } from 'react';
import { CommunityNote } from '../../utils/db.schema';
import { getNotesForLesson, saveNote, deleteNote, voteOnNote, getUserVote } from './communityNotes.db';
import { Loading } from '../../components/common/Loading/Loading';
import './CommunityNotes.css';

interface CommunityNotesProps {
    lessonId: string;
    videoTimestamp?: number;
    onTimestampClick?: (timestamp: number) => void;
}

const USER_ID = 'current-user'; // TODO: Get from auth context
const USER_NAME = 'You'; // TODO: Get from user profile

export function CommunityNotes({ lessonId, videoTimestamp, onTimestampClick }: CommunityNotesProps) {
    const [notes, setNotes] = useState<CommunityNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [includeTimestamp, setIncludeTimestamp] = useState(false);
    const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});

    const loadNotes = useCallback(async () => {
        setLoading(true);
        try {
            const lessonNotes = await getNotesForLesson(lessonId);
            setNotes(lessonNotes);
            
            // Load user's votes
            const votes: Record<string, 'up' | 'down' | null> = {};
            for (const note of lessonNotes) {
                votes[note.id] = await getUserVote(note.id, USER_ID);
            }
            setUserVotes(votes);
        } catch (error) {
            console.error('Failed to load notes:', error);
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        const note: CommunityNote = {
            id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            lessonId,
            userId: USER_ID,
            userName: USER_NAME,
            content: newNote.trim(),
            timestamp: includeTimestamp && videoTimestamp ? Math.floor(videoTimestamp) : undefined,
            votes: 0,
            isOfficial: false,
            isPinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await saveNote(note);
        setNewNote('');
        setIncludeTimestamp(false);
        await loadNotes();
    };

    const handleVote = async (noteId: string, voteType: 'up' | 'down') => {
        await voteOnNote(noteId, USER_ID, voteType);
        await loadNotes();
    };

    const handleDelete = async (noteId: string) => {
        if (confirm('Are you sure you want to delete this note?')) {
            await deleteNote(noteId);
            await loadNotes();
        }
    };

    const formatTimestamp = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(date));
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return <Loading size="small" message="Loading notes..." />;
    }

    const sortedNotes = [...notes].sort((a, b) => {
        // Pinned first, then official, then by votes, then by date
        if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
        if (a.isOfficial !== b.isOfficial) return b.isOfficial ? 1 : -1;
        if (b.votes !== a.votes) return b.votes - a.votes;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="notes-container">
            <div className="notes-header">
                <h3 className="notes-title">📝 Community Notes</h3>
                <span className="notes-count">{notes.length} notes</span>
            </div>

            <form className="notes-form" onSubmit={handleSubmit}>
                <textarea
                    className="notes-textarea"
                    placeholder="Share your notes with the community..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                />
                <div className="notes-form-actions">
                    {videoTimestamp !== undefined && (
                        <button
                            type="button"
                            className="notes-timestamp-btn"
                            onClick={() => setIncludeTimestamp(!includeTimestamp)}
                            style={{
                                background: includeTimestamp ? 'var(--primary)' : undefined,
                                color: includeTimestamp ? 'white' : undefined,
                            }}
                        >
                            {includeTimestamp ? '✓ ' : ''}Add Timestamp ({formatTimestamp(videoTimestamp)})
                        </button>
                    )}
                    <button
                        type="submit"
                        className="notes-submit-btn"
                        disabled={!newNote.trim()}
                    >
                        Post Note
                    </button>
                </div>
            </form>

            <div className="notes-list">
                {sortedNotes.length === 0 ? (
                    <div className="notes-empty">
                        <p>No notes yet. Be the first to share!</p>
                    </div>
                ) : (
                    sortedNotes.map((note) => (
                        <div
                            key={note.id}
                            className={`note-item ${note.isPinned ? 'pinned' : ''} ${note.isOfficial ? 'official' : ''}`}
                        >
                            <div className="note-header">
                                <div className="note-author">
                                    <div className="note-avatar">
                                        {getInitials(note.userName)}
                                    </div>
                                    <div className="note-info">
                                        <span className="note-username">{note.userName}</span>
                                        <span className="note-date">{formatDate(note.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="note-badges">
                                    {note.isPinned && (
                                        <span className="note-badge pinned">📌 Pinned</span>
                                    )}
                                    {note.isOfficial && (
                                        <span className="note-badge official">✓ Official</span>
                                    )}
                                </div>
                            </div>

                            {note.timestamp !== undefined && (
                                <div
                                    className="note-timestamp"
                                    onClick={() => onTimestampClick?.(note.timestamp!)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    ▶️ {formatTimestamp(note.timestamp)}
                                </div>
                            )}

                            <div className="note-content">{note.content}</div>

                            <div className="note-footer">
                                <div className="note-votes">
                                    <button
                                        className={`note-vote-btn ${userVotes[note.id] === 'up' ? 'active up' : ''}`}
                                        onClick={() => handleVote(note.id, 'up')}
                                        title="Upvote"
                                    >
                                        ▲
                                    </button>
                                    <span className="note-vote-count">{note.votes}</span>
                                    <button
                                        className={`note-vote-btn ${userVotes[note.id] === 'down' ? 'active down' : ''}`}
                                        onClick={() => handleVote(note.id, 'down')}
                                        title="Downvote"
                                    >
                                        ▼
                                    </button>
                                </div>

                                {note.userId === USER_ID && (
                                    <div className="note-actions">
                                        <button
                                            className="note-action-btn delete"
                                            onClick={() => handleDelete(note.id)}
                                            title="Delete"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommunityNotes;
