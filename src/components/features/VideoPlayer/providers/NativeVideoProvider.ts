/**
 * NativeVideoProvider
 * 
 * HTML5 <video> element implementation of BaseVideoProvider.
 */

import { BaseVideoProvider } from './BaseVideoProvider';
import type { VideoSource } from '../VideoPlayer.types';

export class NativeVideoProvider extends BaseVideoProvider {
    private videoElement: HTMLVideoElement | null = null;
    private cleanupFns: Array<() => void> = [];

    async load(source: VideoSource): Promise<void> {
        this.currentSource = source;
        
        // Create video element
        this.videoElement = document.createElement('video');
        this.videoElement.src = source.src;
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = '100%';
        this.videoElement.style.objectFit = 'contain';
        
        // Clear container and add video
        this.container.innerHTML = '';
        this.container.appendChild(this.videoElement);

        // Setup event listeners
        this.setupEventListeners();

        return new Promise((resolve, reject) => {
            if (!this.videoElement) {
                reject(new Error('Video element not created'));
                return;
            }

            const onLoadedMetadata = () => {
                this.isReady = true;
                this.emit('loadedmetadata', {
                    duration: this.videoElement!.duration,
                });
                this.emit('canplay');
                resolve();
            };

            const onError = () => {
                const error = this.videoElement!.error;
                const errorCode = error?.code ?? 'UNKNOWN_ERROR';
                const errorMessage = this.getErrorMessage(error?.code);
                this.handleError(
                    `VIDEO_${errorCode}`,
                    errorMessage,
                    error?.code !== 4 // MEDIA_ERR_SRC_NOT_SUPPORTED is not recoverable
                );
                reject(new Error(errorMessage));
            };

            this.videoElement.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
            this.videoElement.addEventListener('error', onError, { once: true });
        });
    }

    private setupEventListeners(): void {
        if (!this.videoElement) return;

        const events = {
            play: () => this.emit('play'),
            pause: () => this.emit('pause'),
            ended: () => this.emit('ended'),
            timeupdate: () => this.emit('timeupdate', this.videoElement!.currentTime),
            volumechange: () => this.emit('volumechange', this.videoElement!.volume),
            ratechange: () => this.emit('ratechange', this.videoElement!.playbackRate),
            waiting: () => this.emit('waiting'),
            canplay: () => this.emit('canplay'),
            progress: () => this.emit('progress'),
        };

        Object.entries(events).forEach(([event, handler]) => {
            this.videoElement!.addEventListener(event, handler);
            this.cleanupFns.push(() => this.videoElement!.removeEventListener(event, handler));
        });
    }

    private getErrorMessage(code?: number): string {
        const messages: Record<number, string> = {
            1: 'Video loading aborted',
            2: 'Network error while loading video',
            3: 'Video decoding error',
            4: 'Video format not supported',
        };
        return messages[code ?? 0] || 'Unknown video error';
    }

    async play(): Promise<void> {
        if (!this.videoElement) return;
        await this.videoElement.play();
    }

    pause(): void {
        if (!this.videoElement) return;
        this.videoElement.pause();
    }

    seek(time: number): void {
        if (!this.videoElement) return;
        this.videoElement.currentTime = Math.max(0, time);
    }

    setVolume(volume: number): void {
        if (!this.videoElement) return;
        this.videoElement.volume = Math.max(0, Math.min(1, volume));
    }

    setPlaybackRate(rate: number): void {
        if (!this.videoElement) return;
        this.videoElement.playbackRate = rate;
    }

    getCurrentTime(): number {
        return this.videoElement?.currentTime ?? 0;
    }

    getDuration(): number {
        return this.videoElement?.duration ?? 0;
    }

    getVideoElement(): HTMLVideoElement | null {
        return this.videoElement;
    }

    destroy(): void {
        this.emit('destroy', {});
        
        // Cleanup event listeners
        this.cleanupFns.forEach(cleanup => cleanup());
        this.cleanupFns = [];
        
        // Destroy video element
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.src = '';
            this.videoElement.load();
            this.videoElement = null;
        }
        
        // Clear container
        this.container.innerHTML = '';
        this.isReady = false;
        this.currentSource = null;
    }
}
