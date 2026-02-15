/**
 * useVideoStorage Hook
 * 
 * localStorage persistence for bookmarks, notes, and progress.
 */

import { useCallback, useEffect, useState } from 'react';
import { generateId, createStorageKey } from '../VideoPlayer.utils';
import type { VideoBookmark, VideoNote } from '../VideoPlayer.types';

interface StorageData {
    bookmarks: VideoBookmark[];
    notes: VideoNote[];
    lastPosition: number;
    completed: boolean;
}

const defaultData: StorageData = {
    bookmarks: [],
    notes: [],
    lastPosition: 0,
    completed: false,
};

export function useVideoStorage(videoId: string, prefix?: string) {
    const storageKey = createStorageKey(videoId, prefix);
    const [data, setData] = useState<StorageData>(defaultData);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from storage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                setData({
                    bookmarks: parsed.bookmarks || [],
                    notes: parsed.notes || [],
                    lastPosition: parsed.lastPosition || 0,
                    completed: parsed.completed || false,
                });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to load video storage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, [storageKey]);

    // Save to storage when data changes
    useEffect(() => {
        if (!isLoaded) return;
        
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to save video storage:', error);
        }
    }, [data, storageKey, isLoaded]);

    const addBookmark = useCallback((time: number, label?: string) => {
        setData(prev => {
            // Prevent duplicates (within 1 second)
            if (prev.bookmarks.some(b => Math.abs(b.time - time) < 1)) {
                return prev;
            }
            
            const newBookmark: VideoBookmark = {
                id: generateId('bookmark'),
                time,
                label,
                createdAt: new Date(),
            };
            return {
                ...prev,
                bookmarks: [...prev.bookmarks, newBookmark].sort((a, b) => a.time - b.time),
            };
        });
    }, []);

    const removeBookmark = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            bookmarks: prev.bookmarks.filter(b => b.id !== id),
        }));
    }, []);

    const addNote = useCallback((timestamp: number, content: string) => {
        setData(prev => {
            const newNote: VideoNote = {
                id: generateId('note'),
                timestamp,
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            return {
                ...prev,
                notes: [...prev.notes, newNote].sort((a, b) => a.timestamp - b.timestamp),
            };
        });
    }, []);

    const updateNote = useCallback((id: string, content: string) => {
        setData(prev => ({
            ...prev,
            notes: prev.notes.map(n =>
                n.id === id ? { ...n, content, updatedAt: new Date() } : n
            ),
        }));
    }, []);

    const removeNote = useCallback((id: string) => {
        setData(prev => ({
            ...prev,
            notes: prev.notes.filter(n => n.id !== id),
        }));
    }, []);

    const updateLastPosition = useCallback((position: number) => {
        setData(prev => ({
            ...prev,
            lastPosition: position,
        }));
    }, []);

    const markCompleted = useCallback(() => {
        setData(prev => ({
            ...prev,
            completed: true,
        }));
    }, []);

    const clearAll = useCallback(() => {
        setData(defaultData);
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to clear video storage:', error);
        }
    }, [storageKey]);

    return {
        bookmarks: data.bookmarks,
        notes: data.notes,
        lastPosition: data.lastPosition,
        completed: data.completed,
        isLoaded,
        addBookmark,
        removeBookmark,
        addNote,
        updateNote,
        removeNote,
        updateLastPosition,
        markCompleted,
        clearAll,
    };
}
