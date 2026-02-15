/**
 * VideoPlayer Type Definitions
 * 
 * Comprehensive type system for the VideoPlayer component.
 */

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
    | 'waiting' | 'canplay' | 'destroy';

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
    volumeStep: number;          // default: 0.1
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

// Provider Types
export interface VideoProviderInterface {
    load(source: VideoSource): Promise<void>;
    play(): Promise<void>;
    pause(): void;
    seek(time: number): void;
    setVolume(volume: number): void;
    setPlaybackRate(rate: number): void;
    getCurrentTime(): number;
    getDuration(): number;
    destroy(): void;
    on(event: string, callback: (event: VideoEvent) => void): () => void;
}
