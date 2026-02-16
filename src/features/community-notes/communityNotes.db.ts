/**
 * Community Notes Database Operations
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { CommunityNote, NoteVote } from '../../utils/db.schema';

interface CommunityNotesDBSchema extends DBSchema {
    notes: {
        key: string;
        value: CommunityNote;
        indexes: {
            'by-lesson': string;
            'by-user': string;
            'by-votes': number;
        };
    };
    noteVotes: {
        key: string;
        value: NoteVote;
        indexes: {
            'by-note': string;
            'by-user': string;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<CommunityNotesDBSchema> | null = null;

export async function getNotesDB(): Promise<IDBPDatabase<CommunityNotesDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<CommunityNotesDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('notes')) {
                const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
                noteStore.createIndex('by-lesson', 'lessonId');
                noteStore.createIndex('by-user', 'userId');
                noteStore.createIndex('by-votes', 'votes');
            }

            if (!db.objectStoreNames.contains('noteVotes')) {
                const voteStore = db.createObjectStore('noteVotes', { keyPath: 'id' });
                voteStore.createIndex('by-note', 'noteId');
                voteStore.createIndex('by-user', 'userId');
            }
        },
    });

    return dbInstance;
}

// ============================================
// Note Operations
// ============================================

export async function getNotesForLesson(lessonId: string): Promise<CommunityNote[]> {
    const db = await getNotesDB();
    const index = db.transaction('notes').store.index('by-lesson');
    const notes = await index.getAll(lessonId);
    
    // Sort by votes (descending), then by date
    return notes.sort((a, b) => {
        if (b.votes !== a.votes) return b.votes - a.votes;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export async function saveNote(note: CommunityNote): Promise<void> {
    const db = await getNotesDB();
    await db.put('notes', note);
}

export async function deleteNote(noteId: string): Promise<void> {
    const db = await getNotesDB();
    await db.delete('notes', noteId);
}

// ============================================
// Voting Operations
// ============================================

export async function voteOnNote(
    noteId: string,
    userId: string,
    voteType: 'up' | 'down'
): Promise<void> {
    const db = await getNotesDB();
    
    // Check for existing vote
    const voteIndex = db.transaction('noteVotes').store.index('by-user');
    const existingVotes = await voteIndex.getAll(userId);
    const existingVote = existingVotes.find(v => v.noteId === noteId);
    
    const note = await db.get('notes', noteId);
    if (!note) return;
    
    if (existingVote) {
        if (existingVote.voteType === voteType) {
            // Remove vote (toggle off)
            await db.delete('noteVotes', existingVote.id);
            note.votes += voteType === 'up' ? -1 : 1;
        } else {
            // Change vote
            existingVote.voteType = voteType;
            await db.put('noteVotes', existingVote);
            note.votes += voteType === 'up' ? 2 : -2;
        }
    } else {
        // New vote
        const newVote: NoteVote = {
            id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            noteId,
            userId,
            voteType,
            createdAt: new Date(),
        };
        await db.put('noteVotes', newVote);
        note.votes += voteType === 'up' ? 1 : -1;
    }
    
    await db.put('notes', note);
}

export async function getUserVote(noteId: string, userId: string): Promise<'up' | 'down' | null> {
    const db = await getNotesDB();
    const index = db.transaction('noteVotes').store.index('by-note');
    const votes = await index.getAll(noteId);
    const userVote = votes.find(v => v.userId === userId);
    return userVote?.voteType || null;
}

// ============================================
// Utility Functions
// ============================================

export async function getTopNotes(limit: number = 10): Promise<CommunityNote[]> {
    const db = await getNotesDB();
    const index = db.transaction('notes').store.index('by-votes');
    const notes: CommunityNote[] = [];
    
    let cursor = await index.openCursor(undefined, 'prev');
    while (cursor && notes.length < limit) {
        notes.push(cursor.value);
        cursor = await cursor.continue();
    }
    
    return notes;
}

export async function getNotesByUser(userId: string): Promise<CommunityNote[]> {
    const db = await getNotesDB();
    const index = db.transaction('notes').store.index('by-user');
    return await index.getAll(userId);
}
