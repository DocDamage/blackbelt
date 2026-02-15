/**
 * BaseVideoProvider
 * 
 * Abstract base class for video provider implementations.
 * Supports Strategy Pattern for different video sources.
 */

import type { VideoSource, VideoEvent, VideoError, VideoEventType } from '../VideoPlayer.types';

export abstract class BaseVideoProvider {
    protected container: HTMLElement;
    protected eventListeners: Map<string, Set<(event: VideoEvent) => void>> = new Map();
    protected isReady = false;
    protected currentSource: VideoSource | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    // Abstract methods that must be implemented by subclasses
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
    on(event: VideoEventType, callback: (event: VideoEvent) => void): () => void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event)!.add(callback);
        
        // Return unsubscribe function
        return () => {
            this.eventListeners.get(event)?.delete(callback);
        };
    }

    protected emit(event: VideoEventType, data?: unknown): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const videoEvent: VideoEvent = {
                type: event,
                timestamp: Date.now(),
                data,
            };
            listeners.forEach(cb => cb(videoEvent));
        }
    }

    protected handleError(code: string, message: string, recoverable = false): void {
        const error: VideoError = { code, message, recoverable };
        this.emit('error', error);
    }

    get ready(): boolean {
        return this.isReady;
    }

    get source(): VideoSource | null {
        return this.currentSource;
    }
}
