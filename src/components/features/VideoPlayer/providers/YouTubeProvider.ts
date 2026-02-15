/**
 * YouTubeProvider
 * 
 * YouTube iframe API implementation of BaseVideoProvider.
 */

import { BaseVideoProvider } from './BaseVideoProvider';
import { YOUTUBE_ERROR_CODES } from '../VideoPlayer.config';
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
    private pollInterval: ReturnType<typeof setInterval> | null = null;

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
        this.currentSource = source;

        // Create container for player
        this.container.innerHTML = '';
        const playerDiv = document.createElement('div');
        playerDiv.id = this.playerId;
        playerDiv.style.width = '100%';
        playerDiv.style.height = '100%';
        this.container.appendChild(playerDiv);

        return new Promise((resolve, reject) => {
            this.player = new window.YT.Player(this.playerId, {
                videoId: source.src,
                playerVars: {
                    enablejsapi: 1,
                    origin: window.location.origin,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                },
                events: {
                    onReady: () => {
                        this.isReady = true;
                        this.setupEventListeners();
                        this.emit('canplay');
                        this.emit('loadedmetadata', {
                            duration: this.player?.getDuration() ?? 0,
                        });
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

    private setupEventListeners(): void {
        if (!this.player) return;

        // Poll for time updates (YouTube doesn't have a timeupdate event)
        this.pollInterval = setInterval(() => {
            if (!this.player) {
                if (this.pollInterval) {
                    clearInterval(this.pollInterval);
                    this.pollInterval = null;
                }
                return;
            }
            this.emit('timeupdate', this.player.getCurrentTime());
        }, 250);
    }

    private handleStateChange(state: number): void {
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

    private handleYouTubeError(errorCode: number): void {
        const errorMessage = YOUTUBE_ERROR_CODES[errorCode] || 'Unknown YouTube error';
        const isRecoverable = errorCode !== 100 && errorCode !== 101 && errorCode !== 150;
        
        this.handleError(
            `YOUTUBE_${errorCode}`,
            errorMessage,
            isRecoverable
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
        this.player?.setVolume(Math.round(volume * 100));
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
        
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        
        this.player?.destroy();
        this.container.innerHTML = '';
        this.isReady = false;
        this.currentSource = null;
    }
}
