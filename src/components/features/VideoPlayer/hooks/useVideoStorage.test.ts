/**
 * Tests for useVideoStorage Hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVideoStorage } from './useVideoStorage';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useVideoStorage', () => {
    const videoId = 'test-video-123';
    const prefix = 'test-player';

    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        localStorageMock.clear();
    });

    it('initializes with empty data', () => {
        const { result } = renderHook(() => useVideoStorage(videoId, prefix));

        expect(result.current.bookmarks).toEqual([]);
        expect(result.current.notes).toEqual([]);
        expect(result.current.lastPosition).toBe(0);
        expect(result.current.completed).toBe(false);
    });

    it('loads data from localStorage on mount', async () => {
        const savedData = {
            bookmarks: [{ id: 'bm-1', time: 30, createdAt: new Date().toISOString() }],
            notes: [{ id: 'note-1', timestamp: 60, content: 'Test note', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
            lastPosition: 120,
            completed: true,
        };
        localStorageMock.setItem(`${prefix}-${videoId}`, JSON.stringify(savedData));

        const { result } = renderHook(() => useVideoStorage(videoId, prefix));

        await waitFor(() => {
            expect(result.current.isLoaded).toBe(true);
        });

        expect(result.current.bookmarks).toHaveLength(1);
        expect(result.current.notes).toHaveLength(1);
        expect(result.current.lastPosition).toBe(120);
        expect(result.current.completed).toBe(true);
    });

    describe('addBookmark', () => {
        it('adds a bookmark', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(30);
            });

            expect(result.current.bookmarks).toHaveLength(1);
            expect(result.current.bookmarks[0]!.time).toBe(30);
            expect(result.current.bookmarks[0]!.id).toBeDefined();
        });

        it('adds a bookmark with label', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(45, 'Important moment');
            });

            expect(result.current.bookmarks[0]!.time).toBe(45);
            expect(result.current.bookmarks[0]!.label).toBe('Important moment');
        });

        it('prevents duplicate bookmarks within 1 second', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(30);
            });

            act(() => {
                result.current.addBookmark(30.5); // Within 1 second
            });

            expect(result.current.bookmarks).toHaveLength(1);
        });

        it('allows bookmarks more than 1 second apart', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(30);
            });

            act(() => {
                result.current.addBookmark(32); // More than 1 second
            });

            expect(result.current.bookmarks).toHaveLength(2);
        });

        it('sorts bookmarks by time', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(60);
                result.current.addBookmark(30);
                result.current.addBookmark(90);
            });

            expect(result.current.bookmarks[0]!.time).toBe(30);
            expect(result.current.bookmarks[1]!.time).toBe(60);
            expect(result.current.bookmarks[2]!.time).toBe(90);
        });
    });

    describe('removeBookmark', () => {
        it('removes a bookmark by id', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(30);
            });

            const bookmarkId = result.current.bookmarks[0]!.id;

            act(() => {
                result.current.removeBookmark(bookmarkId);
            });

            expect(result.current.bookmarks).toHaveLength(0);
        });

        it('only removes the specified bookmark', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(30);
                result.current.addBookmark(60);
                result.current.addBookmark(90);
            });

            const middleId = result.current.bookmarks[1]!.id;

            act(() => {
                result.current.removeBookmark(middleId);
            });

            expect(result.current.bookmarks).toHaveLength(2);
            expect(result.current.bookmarks[0]!.time).toBe(30);
            expect(result.current.bookmarks[1]!.time).toBe(90);
        });

        it('handles removing non-existent bookmark gracefully', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(30);
            });

            act(() => {
                result.current.removeBookmark('non-existent-id');
            });

            expect(result.current.bookmarks).toHaveLength(1);
        });
    });

    describe('addNote', () => {
        it('adds a note', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addNote(45, 'This is a test note');
            });

            expect(result.current.notes).toHaveLength(1);
            expect(result.current.notes[0]!.timestamp).toBe(45);
            expect(result.current.notes[0]!.content).toBe('This is a test note');
            expect(result.current.notes[0]!.id).toBeDefined();
            expect(result.current.notes[0]!.createdAt).toBeDefined();
            expect(result.current.notes[0]!.updatedAt).toBeDefined();
        });

        it('sorts notes by timestamp', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addNote(120, 'Later note');
                result.current.addNote(30, 'Earlier note');
                result.current.addNote(60, 'Middle note');
            });

            expect(result.current.notes[0]!.timestamp).toBe(30);
            expect(result.current.notes[1]!.timestamp).toBe(60);
            expect(result.current.notes[2]!.timestamp).toBe(120);
        });
    });

    describe('updateNote', () => {
        it('updates note content', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addNote(30, 'Original content');
            });

            const noteId = result.current.notes[0]!.id;

            act(() => {
                result.current.updateNote(noteId, 'Updated content');
            });

            expect(result.current.notes[0]!.content).toBe('Updated content');
        });

        it('only updates the specified note', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addNote(30, 'First note');
                result.current.addNote(60, 'Second note');
            });

            const secondId = result.current.notes[1]!.id;

            act(() => {
                result.current.updateNote(secondId, 'Updated second');
            });

            expect(result.current.notes[0]!.content).toBe('First note');
            expect(result.current.notes[1]!.content).toBe('Updated second');
        });
    });

    describe('removeNote', () => {
        it('removes a note by id', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addNote(30, 'Test note');
            });

            const noteId = result.current.notes[0]!.id;

            act(() => {
                result.current.removeNote(noteId);
            });

            expect(result.current.notes).toHaveLength(0);
        });

        it('only removes the specified note', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addNote(30, 'First');
                result.current.addNote(60, 'Second');
                result.current.addNote(90, 'Third');
            });

            const middleId = result.current.notes[1]!.id;

            act(() => {
                result.current.removeNote(middleId);
            });

            expect(result.current.notes).toHaveLength(2);
            expect(result.current.notes[0]!.content).toBe('First');
            expect(result.current.notes[1]!.content).toBe('Third');
        });
    });

    describe('updateLastPosition', () => {
        it('updates last watched position', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.updateLastPosition(120);
            });

            expect(result.current.lastPosition).toBe(120);
        });

        it('updates multiple times', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.updateLastPosition(30);
            });

            act(() => {
                result.current.updateLastPosition(60);
            });

            act(() => {
                result.current.updateLastPosition(90);
            });

            expect(result.current.lastPosition).toBe(90);
        });
    });

    describe('markCompleted', () => {
        it('marks video as completed', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            expect(result.current.completed).toBe(false);

            act(() => {
                result.current.markCompleted();
            });

            expect(result.current.completed).toBe(true);
        });

        it('stays completed once marked', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.markCompleted();
            });

            expect(result.current.completed).toBe(true);

            // There's no unmark function, so it should stay completed
            expect(result.current.completed).toBe(true);
        });
    });

    describe('clearAll', () => {
        it('clears all data', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(30);
                result.current.addNote(60, 'Note');
                result.current.updateLastPosition(90);
                result.current.markCompleted();
            });

            act(() => {
                result.current.clearAll();
            });

            expect(result.current.bookmarks).toHaveLength(0);
            expect(result.current.notes).toHaveLength(0);
            expect(result.current.lastPosition).toBe(0);
            expect(result.current.completed).toBe(false);
        });

        it('removes item from localStorage', () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            act(() => {
                result.current.addBookmark(30);
            });

            act(() => {
                result.current.clearAll();
            });

            expect(localStorageMock.removeItem).toHaveBeenCalledWith(`${prefix}-${videoId}`);
        });
    });

    describe('localStorage persistence', () => {
        it('saves to localStorage when data changes', async () => {
            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            await waitFor(() => expect(result.current.isLoaded).toBe(true));

            act(() => {
                result.current.addBookmark(30);
            });

            // Wait for effect to run
            await waitFor(() => {
                const saved = localStorageMock.getItem(`${prefix}-${videoId}`);
                return saved && JSON.parse(saved).bookmarks.length > 0;
            });

            const savedData = JSON.parse(localStorageMock.getItem(`${prefix}-${videoId}`)!);
            expect(savedData.bookmarks).toHaveLength(1);
            expect(savedData.bookmarks[0].time).toBe(30);
        });

        it('uses correct storage key format', async () => {
            renderHook(() => useVideoStorage('my-video', 'custom-prefix'));

            await waitFor(() => {
                expect(localStorageMock.getItem).toHaveBeenCalledWith('custom-prefix-my-video');
            });
        });

        it('handles localStorage errors gracefully', () => {
            localStorageMock.setItem.mockImplementation(() => {
                throw new Error('Storage full');
            });

            const { result } = renderHook(() => useVideoStorage(videoId, prefix));

            // Should not throw
            act(() => {
                result.current.addBookmark(30);
            });

            expect(result.current.bookmarks).toHaveLength(1);
        });
    });

    describe('multiple video isolation', () => {
        it('keeps data separate for different videos', () => {
            const { result: result1 } = renderHook(() => useVideoStorage('video-1', prefix));
            const { result: result2 } = renderHook(() => useVideoStorage('video-2', prefix));

            act(() => {
                result1.current.addBookmark(30, 'Video 1 bookmark');
            });

            act(() => {
                result2.current.addBookmark(60, 'Video 2 bookmark');
            });

            expect(result1.current.bookmarks).toHaveLength(1);
            expect(result1.current.bookmarks[0]!.time).toBe(30);
            expect(result2.current.bookmarks).toHaveLength(1);
            expect(result2.current.bookmarks[0]!.time).toBe(60);
        });
    });
});
