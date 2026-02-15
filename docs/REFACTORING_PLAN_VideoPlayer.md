# VideoPlayer Component Refactoring Plan

## Executive Summary

**Component**: `VideoPlayer.tsx`  
**Current Size**: 308 lines  
**Complexity**: High (monolithic, multiple responsibilities)  
**Priority**: High (core learning experience component)  
**Estimated Effort**: 3-4 sprints (2-3 weeks with 1 developer)

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Goals & Success Criteria](#goals--success-criteria)
3. [Architecture Overview](#architecture-overview)
4. [Phase 1: Foundation (Hooks & State Management)](#phase-1-foundation-hooks--state-management)
5. [Phase 2: Component Decomposition](#phase-2-component-decomposition)
6. [Phase 3: Enhanced Video Providers](#phase-3-enhanced-video-providers)
7. [Phase 4: Accessibility & Performance](#phase-4-accessibility--performance)
8. [Phase 5: Testing & Documentation](#phase-5-testing--documentation)
9. [Edge Cases & Error Handling](#edge-cases--error-handling)
10. [Migration Strategy](#migration-strategy)
11. [Risks & Mitigations](#risks--mitigations)

---

## Current State Analysis

### Issues Identified

| Issue | Severity | Impact |
|-------|----------|--------|
| Monolithic component (308 lines) | High | Poor maintainability, difficult testing |
| Mixed video type handling (MP4/YouTube/Vimeo) | High | YouTube/Vimeo lack features (controls, tracking) |
| State logic tightly coupled to UI | Medium | No reusability, hard to test |
| localStorage logic in component | Medium | Side effects, testing complexity |
| No error boundaries | High | Potential crashes on video load failure |
| Missing keyboard accessibility | High | WCAG compliance issues |
| No loading/buffering states | Medium | Poor UX on slow connections |
| Time updates not throttled | Medium | Performance issues (excessive re-renders) |
| No Picture-in-Picture support | Low | Missing modern browser feature |
| Hardcoded constants (90% completion) | Low | Inflexible configuration |
| No fullscreen API integration | Medium | Limited user control |
| Chapter click no-op for embeds | High | Broken functionality |

### Code Smells

1. **God Component**: Handles video playback, notes, bookmarks, chapters, storage
2. **Feature Envy**: Chapter navigation for embeds is broken (empty onClick)
3. **Primitive Obsession**: Time as number instead of TimeValue object
4. **Magic Numbers**: `90` for completion, `10` for skip duration, `0.5/1/1.5/2` playback rates
5. **Inconsistent Error Handling**: No try/catch for localStorage

---

## Goals & Success Criteria

### Primary Goals

1. **Modularity**: Split into focused, single-responsibility components
2. **Testability**: Achieve 90%+ test coverage with isolated unit tests
3. **Accessibility**: WCAG 2.1 AA compliance with full keyboard navigation
4. **Performance**: Throttled updates, memoized callbacks, lazy loading
5. **Extensibility**: Plugin architecture for new video providers

### Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Component lines | 308 | <50 (main container) |
| Test coverage | ~85% | >95% |
| Render time (timeupdate) | Every 250ms | Throttled to 500ms |
| Accessibility violations | 5+ | 0 |
| Bundle size | Part of main chunk | Lazy-loaded (separate chunk) |

---

## Architecture Overview

### New Directory Structure

```
VideoPlayer/
├── index.ts                    # Public API exports
├── VideoPlayer.tsx             # Main container (orchestrator)
├── VideoPlayer.types.ts        # Shared TypeScript interfaces
├── VideoPlayer.config.ts       # Constants & configuration
├── VideoPlayer.utils.ts        # Pure utility functions
│
├── hooks/
│   ├── useVideoState.ts        # Core video playback state
│   ├── useVideoControls.ts     # Play/pause/seek/volume/rate
│   ├── useVideoProgress.ts     # Progress tracking with throttling
│   ├── useVideoStorage.ts      # localStorage persistence
│   ├── useVideoKeyboard.ts     # Keyboard shortcuts
│   ├── useVideoFullscreen.ts   # Fullscreen API
│   ├── usePictureInPicture.ts  # PiP API
│   └── useYouTubeAPI.ts        # YouTube iframe API integration
│
├── components/
│   ├── VideoContainer.tsx      # Video element wrapper
│   ├── VideoControls.tsx       # Control bar container
│   ├── PlayButton.tsx          # Individual control buttons
│   ├── PauseButton.tsx
│   ├── SeekBar.tsx             # Progress/seek slider
│   ├── VolumeControl.tsx       # Volume slider + mute
│   ├── PlaybackRate.tsx        # Speed selector
│   ├── TimeDisplay.tsx         # Current/total time
│   ├── FullscreenButton.tsx
│   ├── PiPButton.tsx
│   ├── VideoChapters.tsx       # Chapter sidebar
│   ├── VideoNotes.tsx          # Notes panel
│   ├── VideoBookmarks.tsx      # Bookmarks panel
│   ├── VideoOverlay.tsx        # Play button overlay
│   ├── LoadingSpinner.tsx      # Buffer indicator
│   ├── ErrorMessage.tsx        # Error display
│   └── ChapterMarker.tsx       # Chapter indicator on seekbar
│
├── providers/
│   ├── BaseVideoProvider.ts    # Abstract base class
│   ├── NativeVideoProvider.tsx # HTML5 <video> implementation
│   ├── YouTubeProvider.tsx     # YouTube iframe API
│   └── VimeoProvider.tsx       # Vimeo Player API
│
├── contexts/
│   └── VideoPlayerContext.tsx  # Context for child components
│
├── styles/
│   ├── VideoPlayer.css         # Main styles
│   ├── VideoControls.css       # Control bar styles
│   ├── VideoChapters.css       # Chapter panel styles
│   └── VideoNotes.css          # Notes panel styles
│
└── __tests__/
    ├── unit/                   # Individual hook/component tests
    ├── integration/            # Provider integration tests
    └── e2e/                    # Full player flow tests
```

### Component Relationships

```
VideoPlayer (Container)
├── VideoProvider (Strategy Pattern)
│   ├── NativeVideoProvider
│   ├── YouTubeProvider
│   └── VimeoProvider
├── VideoControls
│   ├── PlayPauseButton
│   ├── SeekBar
│   ├── VolumeControl
│   ├── PlaybackRate
│   ├── TimeDisplay
│   └── FullscreenButton
├── VideoChapters
├── VideoBookmarks
└── VideoNotes
```

---

## Phase 1: Foundation (Hooks & State Management)

### 1.1 Type Definitions

**File**: `VideoPlayer/VideoPlayer.types.ts`

```typescript
// Domain Types
export type VideoType = 'mp4' | 'webm' | 'youtube' | 'vimeo';

export interface VideoSource {
    src: string;
    type: VideoType;
    title?: string;
    thumbnail?: string;
}

export interface VideoChapter {
    id: string;
    title: string;
    time: number; // seconds
    description?: string;
    thumbnail?: string;
}

export interface VideoBookmark {
    id: string;
    time: number;
    label?: string;
    createdAt: Date;
}

export interface VideoNote {
    id: string;
    timestamp: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface VideoProgress {
    currentTime: number;
    duration: number;
    percentage: number;
    completed: boolean;
}

// State Types
export interface VideoState {
    isPlaying: boolean;
    isLoading: boolean;
    isBuffering: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    playbackRate: number;
    isFullscreen: boolean;
    isPiP: boolean;
    error: VideoError | null;
}

export interface VideoError {
    code: string;
    message: string;
    recoverable: boolean;
}

// Event Types
export type VideoEventType = 
    | 'play' | 'pause' | 'ended' 
    | 'timeupdate' | 'progress' 
    | 'volumechange' | 'ratechange'
    | 'error' | 'loadedmetadata' 
    | 'waiting' | 'canplay';

export interface VideoEvent {
    type: VideoEventType;
    timestamp: number;
    data?: unknown;
}

// Configuration
export interface VideoPlayerConfig {
    completionThreshold: number; // default: 90
    throttleInterval: number;    // default: 500ms
    storageKey: string;
    enableKeyboardShortcuts: boolean;
    enablePiP: boolean;
    enableFullscreen: boolean;
    playbackRates: number[];
    skipDuration: number;        // default: 10s
}

// Props
export interface VideoPlayerProps {
    video: VideoSource;
    title?: string;
    chapters?: VideoChapter[];
    config?: Partial<VideoPlayerConfig>;
    onComplete?: () => void;
    onProgress?: (progress: VideoProgress) => void;
    onTimeUpdate?: (currentTime: number) => void;
    onPlay?: () => void;
    onPause?: () => void;
    onError?: (error: VideoError) => void;
    initialBookmarks?: VideoBookmark[];
    initialNotes?: VideoNote[];
    className?: string;
}
```

### 1.2 Core Video State Hook

**File**: `VideoPlayer/hooks/useVideoState.ts`

```typescript
import { useReducer, useCallback } from 'react';
import type { VideoState, VideoError } from '../VideoPlayer.types';

type VideoAction =
    | { type: 'PLAY' }
    | { type: 'PAUSE' }
    | { type: 'LOADING_START' }
    | { type: 'LOADING_END' }
    | { type: 'BUFFERING_START' }
    | { type: 'BUFFERING_END' }
    | { type: 'TIME_UPDATE'; payload: number }
    | { type: 'DURATION_CHANGE'; payload: number }
    | { type: 'VOLUME_CHANGE'; payload: number }
    | { type: 'MUTE_TOGGLE' }
    | { type: 'RATE_CHANGE'; payload: number }
    | { type: 'FULLSCREEN_CHANGE'; payload: boolean }
    | { type: 'PIP_CHANGE'; payload: boolean }
    | { type: 'ERROR'; payload: VideoError }
    | { type: 'ERROR_CLEAR' }
    | { type: 'RESET' };

const initialState: VideoState = {
    isPlaying: false,
    isLoading: true,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
    isFullscreen: false,
    isPiP: false,
    error: null,
};

function videoReducer(state: VideoState, action: VideoAction): VideoState {
    switch (action.type) {
        case 'PLAY':
            return { ...state, isPlaying: true, error: null };
        case 'PAUSE':
            return { ...state, isPlaying: false };
        case 'LOADING_START':
            return { ...state, isLoading: true };
        case 'LOADING_END':
            return { ...state, isLoading: false };
        case 'BUFFERING_START':
            return { ...state, isBuffering: true };
        case 'BUFFERING_END':
            return { ...state, isBuffering: false };
        case 'TIME_UPDATE':
            return { ...state, currentTime: action.payload };
        case 'DURATION_CHANGE':
            return { ...state, duration: action.payload };
        case 'VOLUME_CHANGE':
            return { ...state, volume: action.payload, isMuted: action.payload === 0 };
        case 'MUTE_TOGGLE':
            return { ...state, isMuted: !state.isMuted };
        case 'RATE_CHANGE':
            return { ...state, playbackRate: action.payload };
        case 'FULLSCREEN_CHANGE':
            return { ...state, isFullscreen: action.payload };
        case 'PIP_CHANGE':
            return { ...state, isPiP: action.payload };
        case 'ERROR':
            return { ...state, error: action.payload, isPlaying: false, isLoading: false };
        case 'ERROR_CLEAR':
            return { ...state, error: null };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export function useVideoState() {
    const [state, dispatch] = useReducer(videoReducer, initialState);

    const actions = {
        play: useCallback(() => dispatch({ type: 'PLAY' }), []),
        pause: useCallback(() => dispatch({ type: 'PAUSE' }), []),
        setLoading: useCallback((loading: boolean) => {
            dispatch({ type: loading ? 'LOADING_START' : 'LOADING_END' });
        }, []),
        setBuffering: useCallback((buffering: boolean) => {
            dispatch({ type: buffering ? 'BUFFERING_START' : 'BUFFERING_END' });
        }, []),
        setTime: useCallback((time: number) => {
            dispatch({ type: 'TIME_UPDATE', payload: time });
        }, []),
        setDuration: useCallback((duration: number) => {
            dispatch({ type: 'DURATION_CHANGE', payload: duration });
        }, []),
        setVolume: useCallback((volume: number) => {
            dispatch({ type: 'VOLUME_CHANGE', payload: volume });
        }, []),
        toggleMute: useCallback(() => dispatch({ type: 'MUTE_TOGGLE' }), []),
        setPlaybackRate: useCallback((rate: number) => {
            dispatch({ type: 'RATE_CHANGE', payload: rate });
        }, []),
        setFullscreen: useCallback((fullscreen: boolean) => {
            dispatch({ type: 'FULLSCREEN_CHANGE', payload: fullscreen });
        }, []),
        setPiP: useCallback((pip: boolean) => {
            dispatch({ type: 'PIP_CHANGE', payload: pip });
        }, []),
        setError: useCallback((error: VideoError) => {
            dispatch({ type: 'ERROR', payload: error });
        }, []),
        clearError: useCallback(() => dispatch({ type: 'ERROR_CLEAR' }), []),
        reset: useCallback(() => dispatch({ type: 'RESET' }), []),
    };

    return { state, actions };
}
```

### 1.3 Throttled Progress Hook

**File**: `VideoPlayer/hooks/useVideoProgress.ts`

```typescript
import { useCallback, useRef, useEffect } from 'react';
import { useThrottle } from '../../../hooks/useThrottle'; // or lodash
import type { VideoProgress, VideoPlayerConfig } from '../VideoPlayer.types';

interface UseVideoProgressProps {
    config: VideoPlayerConfig;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    onProgress?: (progress: VideoProgress) => void;
    onComplete?: () => void;
}

export function useVideoProgress({
    config,
    currentTime,
    duration,
    isPlaying,
    onProgress,
    onComplete,
}: UseVideoProgressProps) {
    const hasCompletedRef = useRef(false);
    const lastProgressRef = useRef<VideoProgress | null>(null);

    const calculateProgress = useCallback((): VideoProgress => {
        const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
        const completed = percentage >= config.completionThreshold;
        
        return {
            currentTime,
            duration,
            percentage: Math.min(percentage, 100),
            completed,
        };
    }, [currentTime, duration, config.completionThreshold]);

    const throttledProgressUpdate = useThrottle(
        useCallback((progress: VideoProgress) => {
            // Only call if progress has meaningfully changed
            if (
                !lastProgressRef.current ||
                Math.abs(progress.percentage - lastProgressRef.current.percentage) >= 1
            ) {
                lastProgressRef.current = progress;
                onProgress?.(progress);
            }

            // Handle completion
            if (progress.completed && !hasCompletedRef.current) {
                hasCompletedRef.current = true;
                onComplete?.();
            }
        }, [onProgress, onComplete]),
        config.throttleInterval
    );

    useEffect(() => {
        const progress = calculateProgress();
        throttledProgressUpdate(progress);
    }, [calculateProgress, throttledProgressUpdate]);

    // Reset completion flag when video changes
    useEffect(() => {
        hasCompletedRef.current = false;
        lastProgressRef.current = null;
    }, [config.storageKey]);

    const reset = useCallback(() => {
        hasCompletedRef.current = false;
        lastProgressRef.current = null;
    }, []);

    return { calculateProgress, reset };
}
```

### 1.4 Video Storage Hook

**File**: `VideoPlayer/hooks/useVideoStorage.ts`

```typescript
import { useCallback, useEffect, useState } from 'react';
import { logger } from '../../../utils/logger';
import type { VideoBookmark, VideoNote } from '../VideoPlayer.types';

interface StorageData {
    bookmarks: VideoBookmark[];
    notes: VideoNote[];
    lastPosition: number;
    completed: boolean;
}

export function useVideoStorage(videoId: string) {
    const storageKey = `video-player-${videoId}`;
    const [data, setData] = useState<StorageData>({
        bookmarks: [],
        notes: [],
        lastPosition: 0,
        completed: false,
    });
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
            logger.error('Failed to load video storage:', error);
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
            logger.error('Failed to save video storage:', error);
        }
    }, [data, storageKey, isLoaded]);

    const addBookmark = useCallback((time: number, label?: string) => {
        setData(prev => {
            // Prevent duplicates
            if (prev.bookmarks.some(b => Math.abs(b.time - time) < 1)) {
                return prev;
            }
            
            const newBookmark: VideoBookmark = {
                id: `bookmark-${Date.now()}`,
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
                id: `note-${Date.now()}`,
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
        setData({
            bookmarks: [],
            notes: [],
            lastPosition: 0,
            completed: false,
        });
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            logger.error('Failed to clear video storage:', error);
        }
    }, [storageKey]);

    return {
        ...data,
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
```

### 1.5 Keyboard Shortcuts Hook

**File**: `VideoPlayer/hooks/useVideoKeyboard.ts`

```typescript
import { useEffect, useCallback } from 'react';

interface KeyboardActions {
    togglePlay: () => void;
    seekBackward: (seconds: number) => void;
    seekForward: (seconds: number) => void;
    volumeUp: () => void;
    volumeDown: () => void;
    toggleMute: () => void;
    toggleFullscreen: () => void;
    togglePiP: () => void;
    increaseSpeed: () => void;
    decreaseSpeed: () => void;
    addBookmark: () => void;
}

interface UseVideoKeyboardProps {
    enabled: boolean;
    actions: KeyboardActions;
    skipDuration: number;
    isActive: boolean; // Only capture when player is focused
}

export function useVideoKeyboard({
    enabled,
    actions,
    skipDuration,
    isActive,
}: UseVideoKeyboardProps) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled || !isActive) return;

        // Don't capture if user is typing in an input
        if (event.target instanceof HTMLInputElement || 
            event.target instanceof HTMLTextAreaElement) {
            return;
        }

        switch (event.key) {
            case ' ':
            case 'k':
                event.preventDefault();
                actions.togglePlay();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                actions.seekBackward(event.shiftKey ? skipDuration * 2 : skipDuration);
                break;
            case 'ArrowRight':
                event.preventDefault();
                actions.seekForward(event.shiftKey ? skipDuration * 2 : skipDuration);
                break;
            case 'ArrowUp':
                event.preventDefault();
                actions.volumeUp();
                break;
            case 'ArrowDown':
                event.preventDefault();
                actions.volumeDown();
                break;
            case 'm':
                event.preventDefault();
                actions.toggleMute();
                break;
            case 'f':
                event.preventDefault();
                actions.toggleFullscreen();
                break;
            case 'p':
                event.preventDefault();
                actions.togglePiP();
                break;
            case '>':
            case '.':
                event.preventDefault();
                actions.increaseSpeed();
                break;
            case '<':
            case ',':
                event.preventDefault();
                actions.decreaseSpeed();
                break;
            case 'b':
                event.preventDefault();
                actions.addBookmark();
                break;
            default:
                break;
        }
    }, [enabled, isActive, actions, skipDuration]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
```

---

## Phase 2: Component Decomposition

### 2.1 Video Player Context

**File**: `VideoPlayer/contexts/VideoPlayerContext.tsx`

```typescript
import { createContext, useContext, ReactNode } from 'react';
import type { VideoState, VideoBookmark, VideoNote, VideoChapter } from '../VideoPlayer.types';

interface VideoPlayerContextValue {
    state: VideoState;
    bookmarks: VideoBookmark[];
    notes: VideoNote[];
    chapters: VideoChapter[];
    videoRef: React.RefObject<HTMLVideoElement>;
    containerRef: React.RefObject<HTMLDivElement>;
    actions: {
        play: () => void;
        pause: () => void;
        seek: (time: number) => void;
        setVolume: (volume: number) => void;
        toggleMute: () => void;
        setPlaybackRate: (rate: number) => void;
        toggleFullscreen: () => void;
        togglePiP: () => void;
        addBookmark: (time: number, label?: string) => void;
        removeBookmark: (id: string) => void;
        addNote: (timestamp: number, content: string) => void;
        updateNote: (id: string, content: string) => void;
        removeNote: (id: string) => void;
        jumpToChapter: (chapterId: string) => void;
    };
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null);

export function useVideoPlayer() {
    const context = useContext(VideoPlayerContext);
    if (!context) {
        throw new Error('useVideoPlayer must be used within VideoPlayerProvider');
    }
    return context;
}

interface ProviderProps {
    children: ReactNode;
    value: VideoPlayerContextValue;
}

export function VideoPlayerProvider({ children, value }: ProviderProps) {
    return (
        <VideoPlayerContext.Provider value={value}>
            {children}
        </VideoPlayerContext.Provider>
    );
}
```

### 2.2 Control Button Components

**File**: `VideoPlayer/components/PlayButton.tsx`

```typescript
import React, { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const PlayButton = memo(function PlayButton() {
    const { state, actions } = useVideoPlayer();

    return (
        <button
            onClick={actions.play}
            aria-label="Play"
            className="video-control-btn play-btn"
            disabled={state.isLoading}
        >
            ▶
        </button>
    );
});
```

**File**: `VideoPlayer/components/SeekBar.tsx`

```typescript
import React, { memo, useCallback, useRef, useState } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';
import { formatTime } from '../VideoPlayer.utils';

export const SeekBar = memo(function SeekBar() {
    const { state, actions, chapters } = useVideoPlayer();
    const [isDragging, setIsDragging] = useState(false);
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
        actions.pause();
    }, [actions]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div 
            className="seek-bar-container"
            ref={progressRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            role="slider"
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={state.duration}
            aria-valuenow={state.currentTime}
            tabIndex={0}
        >
            {/* Background track */}
            <div className="seek-bar-track" />
            
            {/* Buffered progress */}
            <div className="seek-bar-buffered" />
            
            {/* Current progress */}
            <div 
                className="seek-bar-progress" 
                style={{ width: `${percentage}%` }}
            />
            
            {/* Chapter markers */}
            {chapters.map(chapter => {
                const chapterPercent = (chapter.time / state.duration) * 100;
                return (
                    <div
                        key={chapter.id}
                        className="chapter-marker"
                        style={{ left: `${chapterPercent}%` }}
                        title={chapter.title}
                    />
                );
            })}
            
            {/* Drag handle */}
            <div 
                className="seek-bar-handle"
                style={{ left: `${percentage}%` }}
            />
            
            {/* Time preview tooltip */}
            {previewTime !== null && isDragging && (
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
```

### 2.3 Video Controls Container

**File**: `VideoPlayer/components/VideoControls.tsx`

```typescript
import React, { memo } from 'react';
import { PlayButton } from './PlayButton';
import { PauseButton } from './PauseButton';
import { SeekBar } from './SeekBar';
import { VolumeControl } from './VolumeControl';
import { PlaybackRate } from './PlaybackRate';
import { TimeDisplay } from './TimeDisplay';
import { FullscreenButton } from './FullscreenButton';
import { PiPButton } from './PiPButton';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const VideoControls = memo(function VideoControls() {
    const { state } = useVideoPlayer();

    return (
        <div 
            className={`video-controls ${state.isPlaying ? 'playing' : 'paused'}`}
            role="toolbar"
            aria-label="Video controls"
        >
            <div className="controls-progress">
                <SeekBar />
            </div>
            
            <div className="controls-row">
                <div className="controls-left">
                    {state.isPlaying ? <PauseButton /> : <PlayButton />}
                    <SkipButton direction="backward" />
                    <SkipButton direction="forward" />
                    <VolumeControl />
                </div>
                
                <div className="controls-center">
                    <TimeDisplay />
                </div>
                
                <div className="controls-right">
                    <PlaybackRate />
                    <PiPButton />
                    <FullscreenButton />
                </div>
            </div>
            
            {/* Keyboard shortcuts hint */}
            <div className="keyboard-hints" aria-hidden="true">
                <span>Space: Play/Pause</span>
                <span>← →: Seek</span>
                <span>F: Fullscreen</span>
            </div>
        </div>
    );
});
```

---

## Phase 3: Enhanced Video Providers

### 3.1 Abstract Base Provider

**File**: `VideoPlayer/providers/BaseVideoProvider.ts`

```typescript
import type { VideoSource, VideoEvent, VideoError } from '../VideoPlayer.types';

export abstract class BaseVideoProvider {
    protected container: HTMLElement;
    protected eventListeners: Map<string, Set<(event: VideoEvent) => void>> = new Map();
    protected isReady = false;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    abstract load(source: VideoSource): Promise<void>;
    abstract play(): Promise<void>;
    abstract pause(): void;
    abstract seek(time: number): void;
    abstract setVolume(volume: number): void;
    abstract setPlaybackRate(rate: number): void;
    abstract getCurrentTime(): number;
    abstract getDuration(): number;
    abstract destroy(): void;

    // Event system
    on(event: string, callback: (event: VideoEvent) => void): () => void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event)!.add(callback);
        
        return () => {
            this.eventListeners.get(event)?.delete(callback);
        };
    }

    protected emit(event: string, data?: unknown) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const videoEvent: VideoEvent = {
                type: event as any,
                timestamp: Date.now(),
                data,
            };
            listeners.forEach(cb => cb(videoEvent));
        }
    }

    protected handleError(code: string, message: string, recoverable = false) {
        const error: VideoError = { code, message, recoverable };
        this.emit('error', error);
    }
}
```

### 3.2 YouTube Provider with API Integration

**File**: `VideoPlayer/providers/YouTubeProvider.tsx`

```typescript
import { BaseVideoProvider } from './BaseVideoProvider';
import type { VideoSource } from '../VideoPlayer.types';

// YouTube iframe API types
declare global {
    interface Window {
        YT: {
            Player: new (
                elementId: string,
                options: {
                    videoId: string;
                    playerVars?: Record<string, unknown>;
                    events?: {
                        onReady?: (event: { target: YTPlayer }) => void;
                        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
                        onError?: (event: { data: number }) => void;
                    };
                }
            ) => YTPlayer;
            PlayerState: {
                PLAYING: number;
                PAUSED: number;
                ENDED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
        onYouTubeIframeAPIReady?: () => void;
    }
}

interface YTPlayer {
    playVideo(): void;
    pauseVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    setVolume(volume: number): void;
    getVolume(): number;
    setPlaybackRate(rate: number): void;
    getPlaybackRate(): number;
    destroy(): void;
}

export class YouTubeProvider extends BaseVideoProvider {
    private player: YTPlayer | null = null;
    private playerId: string;
    private static apiLoaded = false;
    private static apiLoadPromise: Promise<void> | null = null;

    constructor(container: HTMLElement) {
        super(container);
        this.playerId = `youtube-player-${Date.now()}`;
    }

    private loadYouTubeAPI(): Promise<void> {
        if (YouTubeProvider.apiLoaded) {
            return Promise.resolve();
        }
        
        if (YouTubeProvider.apiLoadPromise) {
            return YouTubeProvider.apiLoadPromise;
        }

        YouTubeProvider.apiLoadPromise = new Promise((resolve) => {
            // Create script tag
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            
            window.onYouTubeIframeAPIReady = () => {
                YouTubeProvider.apiLoaded = true;
                resolve();
            };

            document.body.appendChild(tag);
        });

        return YouTubeProvider.apiLoadPromise;
    }

    async load(source: VideoSource): Promise<void> {
        await this.loadYouTubeAPI();

        // Create container for player
        const playerDiv = document.createElement('div');
        playerDiv.id = this.playerId;
        this.container.appendChild(playerDiv);

        return new Promise((resolve, reject) => {
            this.player = new window.YT.Player(this.playerId, {
                videoId: source.src,
                playerVars: {
                    enablejsapi: 1,
                    origin: window.location.origin,
                    rel: 0, // Don't show related videos
                    modestbranding: 1,
                },
                events: {
                    onReady: () => {
                        this.isReady = true;
                        this.setupEventListeners();
                        this.emit('canplay');
                        resolve();
                    },
                    onStateChange: (event) => {
                        this.handleStateChange(event.data);
                    },
                    onError: (event) => {
                        this.handleYouTubeError(event.data);
                        reject(new Error(`YouTube error: ${event.data}`));
                    },
                },
            });
        });
    }

    private setupEventListeners() {
        if (!this.player) return;

        // Poll for time updates
        const pollInterval = setInterval(() => {
            if (!this.player) {
                clearInterval(pollInterval);
                return;
            }
            this.emit('timeupdate', this.player.getCurrentTime());
        }, 250);

        // Cleanup on destroy
        this.on('destroy', () => clearInterval(pollInterval));
    }

    private handleStateChange(state: number) {
        const { PLAYING, PAUSED, ENDED, BUFFERING } = window.YT.PlayerState;
        
        switch (state) {
            case PLAYING:
                this.emit('play');
                break;
            case PAUSED:
                this.emit('pause');
                break;
            case ENDED:
                this.emit('ended');
                break;
            case BUFFERING:
                this.emit('waiting');
                break;
        }
    }

    private handleYouTubeError(errorCode: number) {
        const errors: Record<number, string> = {
            2: 'Invalid parameter',
            5: 'HTML5 player error',
            100: 'Video not found',
            101: 'Embedding disabled',
            150: 'Embedding disabled',
        };
        
        this.handleError(
            `YOUTUBE_${errorCode}`,
            errors[errorCode] || 'Unknown YouTube error',
            errorCode !== 100 && errorCode !== 101 && errorCode !== 150
        );
    }

    async play(): Promise<void> {
        this.player?.playVideo();
    }

    pause(): void {
        this.player?.pauseVideo();
    }

    seek(time: number): void {
        this.player?.seekTo(time, true);
    }

    setVolume(volume: number): void {
        // YouTube uses 0-100
        this.player?.setVolume(volume * 100);
    }

    setPlaybackRate(rate: number): void {
        this.player?.setPlaybackRate(rate);
    }

    getCurrentTime(): number {
        return this.player?.getCurrentTime() ?? 0;
    }

    getDuration(): number {
        return this.player?.getDuration() ?? 0;
    }

    destroy(): void {
        this.emit('destroy', {});
        this.player?.destroy();
        this.container.innerHTML = '';
    }
}
```

---

## Phase 4: Accessibility & Performance

### 4.1 Accessibility Requirements

#### Keyboard Navigation

| Key | Action |
|-----|--------|
| Space / K | Play/Pause |
| ← / → | Seek backward/forward 10s |
| Shift + ←/→ | Seek backward/forward 20s |
| ↑ / ↓ | Volume up/down |
| M | Mute toggle |
| F | Fullscreen toggle |
| P | Picture-in-Picture toggle |
| > / . | Increase playback speed |
| < / , | Decrease playback speed |
| B | Add bookmark at current time |
| Home | Jump to start |
| End | Jump to end |
| 0-9 | Jump to 0%-90% of video |

#### ARIA Labels & Roles

- `role="application"` for main container
- `role="toolbar"` for control bar
- `role="slider"` for seek bar with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-label` for all control buttons
- `aria-pressed` for toggle buttons
- `aria-live="polite"` for status announcements
- Focus indicators using `:focus-visible`

### 4.2 Performance Optimizations

1. **Throttled Time Updates**: Use 500ms throttle for progress callbacks
2. **Memoized Components**: All child components use `React.memo`
3. **Callback Memoization**: All event handlers use `useCallback`
4. **Virtual Scrolling**: For long chapter/bookmark lists
5. **Lazy Loading**: Video player chunk loaded on demand
6. **Intersection Observer**: Pause video when scrolled out of view
7. **Debounced Resize**: Recalculate layout only after resize ends

**File**: `VideoPlayer/hooks/useVideoVisibility.ts`

```typescript
import { useEffect, useState } from 'react';

export function useVideoVisibility(containerRef: React.RefObject<HTMLElement>) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [containerRef]);

    return isVisible;
}
```

---

## Phase 5: Testing & Documentation

### 5.1 Testing Strategy

#### Unit Tests (per hook/component)

```typescript
// useVideoState.test.ts
describe('useVideoState', () => {
    it('should initialize with correct default state', () => {
        const { result } = renderHook(() => useVideoState());
        
        expect(result.current.state.isPlaying).toBe(false);
        expect(result.current.state.volume).toBe(1);
        expect(result.current.state.error).toBeNull();
    });

    it('should toggle play/pause', () => {
        const { result } = renderHook(() => useVideoState());
        
        act(() => result.current.actions.play());
        expect(result.current.state.isPlaying).toBe(true);
        
        act(() => result.current.actions.pause());
        expect(result.current.state.isPlaying).toBe(false);
    });

    it('should update time without mutation', () => {
        const { result } = renderHook(() => useVideoState());
        
        act(() => result.current.actions.setTime(30));
        expect(result.current.state.currentTime).toBe(30);
    });
});
```

#### Integration Tests

```typescript
// VideoPlayer.integration.test.tsx
describe('VideoPlayer Integration', () => {
    it('should synchronize seek bar with video time', async () => {
        render(<VideoPlayer video={mockVideo} />);
        
        const video = screen.getByRole('video');
        const seekBar = screen.getByRole('slider', { name: /video progress/i });
        
        // Simulate time update
        fireEvent.timeUpdate(video, { target: { currentTime: 30 } });
        
        await waitFor(() => {
            expect(seekBar).toHaveAttribute('aria-valuenow', '30');
        });
    });

    it('should persist bookmarks to localStorage', async () => {
        render(<VideoPlayer video={mockVideo} />);
        
        const bookmarkBtn = screen.getByRole('button', { name: /add bookmark/i });
        await userEvent.click(bookmarkBtn);
        
        expect(localStorage.setItem).toHaveBeenCalledWith(
            expect.stringContaining('video-bookmarks'),
            expect.any(String)
        );
    });
});
```

#### E2E Tests (Playwright/Cypress)

```typescript
// video-player.spec.ts
test('user can watch video with chapters', async ({ page }) => {
    await page.goto('/lesson/1');
    
    // Play video
    await page.click('[aria-label="Play"]');
    
    // Click chapter
    await page.click('text=Chapter 2');
    
    // Verify time jumped
    await expect(page.locator('[aria-label="Current time"]')).
        toHaveText('2:00');
    
    // Add bookmark
    await page.click('[aria-label="Add Bookmark"]');
    
    // Verify bookmark appears
    await expect(page.locator('.bookmark-list')).
        toContainText('2:00');
});
```

### 5.2 Documentation

#### Component API Documentation

```typescript
/**
 * VideoPlayer Component
 * 
 * A comprehensive video player with support for multiple video sources,
 * progress tracking, chapters, bookmarks, and notes.
 * 
 * @example
 * ```tsx
 * <VideoPlayer
 *   video={{ src: 'video.mp4', type: 'mp4' }}
 *   title="Introduction to Six Sigma"
 *   chapters={[
 *     { id: '1', title: 'Overview', time: 0 },
 *     { id: '2', title: 'History', time: 120 },
 *   ]}
 *   onComplete={() => console.log('Video completed!')}
 * />
 * ```
 * 
 * @accessibility
 * - Full keyboard navigation support
 * - ARIA labels for all controls
 * - Screen reader announcements for time updates
 * - Focus management for modal panels
 */
```

---

## Edge Cases & Error Handling

### Video Loading Errors

| Error Code | Description | User Action | System Response |
|------------|-------------|-------------|-----------------|
| `NETWORK_ERROR` | Failed to load video | Show retry button | Log to Sentry, offer download |
| `FORMAT_UNSUPPORTED` | Video format not supported | Show message | Suggest alternative format |
| `YOUTUBE_EMBED_DISABLED` | Video can't be embedded | Show link to YouTube | Redirect with timestamp |
| `VIMEO_PRIVATE` | Private Vimeo video | Show authentication prompt | Request password |

### Network Conditions

1. **Slow Connection**: Show quality selector, auto-reduce quality
2. **Offline**: Cache video metadata, show offline indicator
3. **Intermittent**: Retry with exponential backoff

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Native Video | ✅ | ✅ | ✅ | ✅ |
| Fullscreen API | ✅ | ✅ | ✅ | ✅ |
| Picture-in-Picture | ✅ | ✅ | ✅ | ✅ |
| WebVTT (subtitles) | ✅ | ✅ | ✅ | ✅ |

---

## Migration Strategy

### Step 1: Parallel Implementation (Week 1)

```typescript
// Create new component alongside old one
import { VideoPlayer as VideoPlayerV2 } from './VideoPlayer/index';

// Feature flag for gradual rollout
const useNewVideoPlayer = import.meta.env.VITE_USE_VIDEOPLAYER_V2 === 'true';

export function LessonPage() {
    return useNewVideoPlayer 
        ? <VideoPlayerV2 {...props} />
        : <VideoPlayer {...props} />;
}
```

### Step 2: Testing Phase (Week 2)

- A/B test with 10% of users
- Monitor error rates, completion rates
- Collect performance metrics

### Step 3: Full Migration (Week 3)

- Remove feature flag
- Archive old component
- Update documentation

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Breaking existing lessons | High | Medium | Comprehensive test suite, feature flags |
| YouTube API changes | Medium | Low | Abstract provider pattern, fallback to embed |
| Performance regression | Medium | Low | Benchmarks, throttling, lazy loading |
| Accessibility violations | High | Low | Automated a11y testing, manual audit |
| localStorage quota exceeded | Low | Medium | Error handling, IndexedDB fallback |
| Browser compatibility issues | Medium | Medium | Polyfills, progressive enhancement |

---

## Appendix A: Constants & Configuration

**File**: `VideoPlayer/VideoPlayer.config.ts`

```typescript
export const DEFAULT_VIDEO_CONFIG = {
    completionThreshold: 90,
    throttleInterval: 500,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    skipDuration: 10,
    volumeStep: 0.1,
    enableKeyboardShortcuts: true,
    enablePiP: true,
    enableFullscreen: true,
} as const;

export const VIDEO_ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    DECODE_ERROR: 'DECODE_ERROR',
    SRC_NOT_SUPPORTED: 'SRC_NOT_SUPPORTED',
    YOUTUBE_ERROR: 'YOUTUBE_ERROR',
    VIMEO_ERROR: 'VIMEO_ERROR',
} as const;

export const KEYBOARD_SHORTCUTS = {
    PLAY_PAUSE: [' ', 'k'],
    SEEK_BACKWARD: ['ArrowLeft'],
    SEEK_FORWARD: ['ArrowRight'],
    VOLUME_UP: ['ArrowUp'],
    VOLUME_DOWN: ['ArrowDown'],
    MUTE: ['m'],
    FULLSCREEN: ['f'],
    PIP: ['p'],
    SPEED_UP: ['>', '.'],
    SPEED_DOWN: ['<', ','],
    BOOKMARK: ['b'],
} as const;
```

---

## Appendix B: File Size Estimates

| Module | Estimated Size (gzipped) |
|--------|-------------------------|
| Core (hooks + components) | ~15 KB |
| YouTube Provider | ~5 KB |
| Vimeo Provider | ~4 KB |
| CSS | ~8 KB |
| **Total** | **~32 KB** |

---

## Conclusion

This refactoring plan transforms the monolithic VideoPlayer component into a modular, maintainable, and accessible system. The phased approach minimizes risk while delivering incremental value. The architecture supports future video providers and features without major rewrites.

**Next Steps**:
1. Review and approve plan
2. Set up feature flag infrastructure
3. Begin Phase 1 implementation
4. Schedule accessibility audit
5. Plan A/B testing strategy

---

*Document Version*: 1.0  
*Created*: February 15, 2026  
*Author*: AI Assistant  
*Reviewers*: TBD
