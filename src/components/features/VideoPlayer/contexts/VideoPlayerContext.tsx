/**
 * VideoPlayer Context
 * 
 * React Context for sharing video player state across components.
 */

import { createContext, useContext, ReactNode, RefObject } from 'react';
import type { 
    VideoState, 
    VideoBookmark, 
    VideoNote, 
    VideoChapter,
    VideoSource 
} from '../VideoPlayer.types';

export interface VideoPlayerContextValue {
    // State
    state: VideoState;
    bookmarks: VideoBookmark[];
    notes: VideoNote[];
    chapters: VideoChapter[];
    videoSource: VideoSource;
    
    // Refs
    videoRef: RefObject<HTMLVideoElement>;
    containerRef: RefObject<HTMLDivElement>;
    
    // Actions
    actions: {
        // Playback
        play: () => void;
        pause: () => void;
        seek: (time: number) => void;
        seekRelative: (seconds: number) => void;
        
        // Volume
        setVolume: (volume: number) => void;
        toggleMute: () => void;
        volumeUp: () => void;
        volumeDown: () => void;
        
        // Playback rate
        setPlaybackRate: (rate: number) => void;
        increaseSpeed: () => void;
        decreaseSpeed: () => void;
        
        // Display modes
        toggleFullscreen: () => void;
        togglePiP: () => void;
        
        // Bookmarks
        addBookmark: (time: number, label?: string) => void;
        removeBookmark: (id: string) => void;
        
        // Notes
        addNote: (timestamp: number, content: string) => void;
        updateNote: (id: string, content: string) => void;
        removeNote: (id: string) => void;
        
        // Chapters
        jumpToChapter: (chapterId: string) => void;
        
        // Error handling
        clearError: () => void;
    };
    
    // Config
    config: {
        playbackRates: number[];
        skipDuration: number;
        volumeStep: number;
        enablePiP: boolean;
        enableFullscreen: boolean;
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
