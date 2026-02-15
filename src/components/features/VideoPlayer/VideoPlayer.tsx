/**
 * VideoPlayer Component
 * 
 * A comprehensive, accessible video player with support for:
 * - Multiple video sources (MP4, WebM, YouTube)
 * - Progress tracking with throttling
 * - Chapters, bookmarks, and notes
 * - Keyboard navigation
 * - Fullscreen and Picture-in-Picture
 * - localStorage persistence
 */

import { useRef, useEffect, useMemo, useState, type FC } from 'react';
import { VideoPlayerProvider } from './contexts/VideoPlayerContext';
import { VideoControls } from './components/VideoControls';
import { VideoChapters } from './components/VideoChapters';
import { VideoBookmarks } from './components/VideoBookmarks';
import { VideoNotes } from './components/VideoNotes';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { PlayOverlay } from './components/PlayOverlay';
import { NativeVideoProvider } from './providers/NativeVideoProvider';
import { YouTubeProvider } from './providers/YouTubeProvider';
import { useVideoState, useVideoProgress, useVideoStorage } from './hooks';
import { useVideoFullscreen } from './hooks/useVideoFullscreen';
import { usePictureInPicture } from './hooks/usePictureInPicture';
import { useVideoKeyboard } from './hooks/useVideoKeyboard';
import { DEFAULT_VIDEO_CONFIG } from './VideoPlayer.config';
import { normalizeVideoSource, clamp } from './VideoPlayer.utils';
import type { VideoPlayerProps, VideoProviderInterface } from './VideoPlayer.types';
import './styles/VideoPlayer.css';

export const VideoPlayer: FC<VideoPlayerProps> = ({
    video: rawVideo,
    title,
    chapters = [],
    config: userConfig,
    onComplete,
    onProgress,
    onTimeUpdate,
    onPlay,
    onPause,
    onError,
    className = '',
}) => {
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const providerRef = useRef<VideoProviderInterface | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Normalize config
    const config = useMemo(() => ({
        ...DEFAULT_VIDEO_CONFIG,
        ...userConfig,
        storageKey: userConfig?.storageKey || `video-player-${rawVideo.src}`,
    }), [userConfig, rawVideo.src]);

    // Normalize video source
    const video = useMemo(() => normalizeVideoSource(rawVideo), [rawVideo]);

    // State hooks
    const { state, actions: stateActions } = useVideoState();
    const storage = useVideoStorage(video.src, config.storageKey);

    // Progress tracking
    useVideoProgress({
        config: {
            completionThreshold: config.completionThreshold,
            throttleInterval: config.throttleInterval,
        },
        currentTime: state.currentTime,
        duration: state.duration,
        onProgress,
        onComplete,
    });

    // Fullscreen
    const { isFullscreen, toggleFullscreen } = useVideoFullscreen({
        containerRef,
        onFullscreenChange: stateActions.setFullscreen,
    });

    // Picture-in-Picture
    const { isPiP, togglePiP } = usePictureInPicture({
        videoRef,
        onPiPChange: stateActions.setPiP,
    });

    // Initialize provider
    useEffect(() => {
        if (!videoContainerRef.current) return;

        let isMounted = true;

        const initProvider = async () => {
            // Clean up existing provider
            providerRef.current?.destroy();

            stateActions.setLoading(true);
            stateActions.clearError();

            try {
                let provider: VideoProviderInterface;

                if (video.type === 'youtube') {
                    provider = new YouTubeProvider(videoContainerRef.current!);
                } else {
                    provider = new NativeVideoProvider(videoContainerRef.current!);
                }

                providerRef.current = provider;

                // Setup event listeners
                provider.on('play', () => {
                    stateActions.play();
                    onPlay?.();
                });

                provider.on('pause', () => {
                    stateActions.pause();
                    onPause?.();
                });

                provider.on('timeupdate', (event) => {
                    const time = event.data as number;
                    stateActions.setTime(time);
                    onTimeUpdate?.(time);
                });

                provider.on('loadedmetadata', (event) => {
                    const data = event.data as { duration: number };
                    stateActions.setDuration(data.duration);
                });

                provider.on('canplay', () => {
                    stateActions.setLoading(false);
                });

                provider.on('waiting', () => {
                    stateActions.setBuffering(true);
                });

                provider.on('error', (event) => {
                    const error = event.data as { code: string; message: string };
                    stateActions.setError({
                        code: error.code,
                        message: error.message,
                        recoverable: true,
                    });
                    onError?.({
                        code: error.code,
                        message: error.message,
                        recoverable: true,
                    });
                });

                await provider.load(video);

                // Set initial volume and playback rate
                provider.setVolume(state.volume);
                provider.setPlaybackRate(state.playbackRate);

                // Get native video element reference for PiP
                if (provider instanceof NativeVideoProvider) {
                    const nativeVideo = provider.getVideoElement();
                    if (nativeVideo) {
                        // Update the ref
                        (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = nativeVideo;
                    }
                }

            } catch (error) {
                if (isMounted) {
                    stateActions.setError({
                        code: 'LOAD_ERROR',
                        message: error instanceof Error ? error.message : 'Failed to load video',
                        recoverable: true,
                    });
                }
            } finally {
                if (isMounted) {
                    stateActions.setLoading(false);
                }
            }
        };

        initProvider();

        return () => {
            isMounted = false;
            providerRef.current?.destroy();
            providerRef.current = null;
        };
    }, [video.src, video.type]);

    // Sync volume with provider
    useEffect(() => {
        if (providerRef.current) {
            providerRef.current.setVolume(state.isMuted ? 0 : state.volume);
        }
    }, [state.volume, state.isMuted]);

    // Sync playback rate with provider
    useEffect(() => {
        if (providerRef.current) {
            providerRef.current.setPlaybackRate(state.playbackRate);
        }
    }, [state.playbackRate]);

    // Keyboard shortcuts
    useVideoKeyboard({
        enabled: config.enableKeyboardShortcuts,
        isActive: isFocused,
        skipDuration: config.skipDuration,
        volumeStep: config.volumeStep,
        playbackRates: config.playbackRates,
        currentPlaybackRate: state.playbackRate,
        actions: {
            togglePlay: () => {
                if (state.isPlaying) {
                    providerRef.current?.pause();
                } else {
                    providerRef.current?.play();
                }
            },
            seekBackward: (seconds) => {
                const newTime = Math.max(0, state.currentTime - seconds);
                providerRef.current?.seek(newTime);
                stateActions.setTime(newTime);
            },
            seekForward: (seconds) => {
                const newTime = Math.min(state.duration, state.currentTime + seconds);
                providerRef.current?.seek(newTime);
                stateActions.setTime(newTime);
            },
            seekToPercentage: (percentage) => {
                const targetTime = (state.duration * percentage) / 100;
                providerRef.current?.seek(targetTime);
                stateActions.setTime(targetTime);
            },
            volumeUp: () => {
                stateActions.setVolume(clamp(state.volume + config.volumeStep, 0, 1));
            },
            volumeDown: () => {
                stateActions.setVolume(clamp(state.volume - config.volumeStep, 0, 1));
            },
            toggleMute: stateActions.toggleMute,
            toggleFullscreen,
            togglePiP,
            increaseSpeed: () => {
                const currentIndex = config.playbackRates.indexOf(state.playbackRate);
                const nextIndex = Math.min(currentIndex + 1, config.playbackRates.length - 1);
                const nextRate = config.playbackRates[nextIndex] ?? state.playbackRate;
                stateActions.setPlaybackRate(nextRate);
            },
            decreaseSpeed: () => {
                const currentIndex = config.playbackRates.indexOf(state.playbackRate);
                const prevIndex = Math.max(currentIndex - 1, 0);
                const prevRate = config.playbackRates[prevIndex] ?? state.playbackRate;
                stateActions.setPlaybackRate(prevRate);
            },
            addBookmark: () => {
                storage.addBookmark(state.currentTime);
            },
            jumpToStart: () => {
                providerRef.current?.seek(0);
                stateActions.setTime(0);
            },
            jumpToEnd: () => {
                providerRef.current?.seek(state.duration);
                stateActions.setTime(state.duration);
            },
        },
    });

    // Context value
    const contextValue = useMemo(() => ({
        state: {
            ...state,
            isFullscreen,
            isPiP,
        },
        bookmarks: storage.bookmarks,
        notes: storage.notes,
        chapters,
        videoSource: video,
        videoRef,
        containerRef,
        config: {
            playbackRates: config.playbackRates,
            skipDuration: config.skipDuration,
            volumeStep: config.volumeStep,
            enablePiP: config.enablePiP,
            enableFullscreen: config.enableFullscreen,
        },
        actions: {
            play: () => providerRef.current?.play(),
            pause: () => providerRef.current?.pause(),
            seek: (time: number) => {
                providerRef.current?.seek(time);
                stateActions.setTime(time);
            },
            seekRelative: (seconds: number) => {
                const newTime = clamp(state.currentTime + seconds, 0, state.duration);
                providerRef.current?.seek(newTime);
                stateActions.setTime(newTime);
            },
            setVolume: stateActions.setVolume,
            toggleMute: stateActions.toggleMute,
            volumeUp: () => stateActions.setVolume(clamp(state.volume + config.volumeStep, 0, 1)),
            volumeDown: () => stateActions.setVolume(clamp(state.volume - config.volumeStep, 0, 1)),
            setPlaybackRate: stateActions.setPlaybackRate,
            increaseSpeed: () => {
                const currentIndex = config.playbackRates.indexOf(state.playbackRate);
                const nextIndex = Math.min(currentIndex + 1, config.playbackRates.length - 1);
                const nextRate = config.playbackRates[nextIndex] ?? state.playbackRate;
                stateActions.setPlaybackRate(nextRate);
            },
            decreaseSpeed: () => {
                const currentIndex = config.playbackRates.indexOf(state.playbackRate);
                const prevIndex = Math.max(currentIndex - 1, 0);
                const prevRate = config.playbackRates[prevIndex] ?? state.playbackRate;
                stateActions.setPlaybackRate(prevRate);
            },
            toggleFullscreen,
            togglePiP,
            addBookmark: storage.addBookmark,
            removeBookmark: storage.removeBookmark,
            addNote: storage.addNote,
            updateNote: storage.updateNote,
            removeNote: storage.removeNote,
            jumpToChapter: (chapterId: string) => {
                const chapter = chapters.find(c => c.id === chapterId);
                if (chapter) {
                    providerRef.current?.seek(chapter.time);
                    stateActions.setTime(chapter.time);
                }
            },
            clearError: stateActions.clearError,
        },
    }), [
        state,
        isFullscreen,
        isPiP,
        storage.bookmarks,
        storage.notes,
        chapters,
        video,
        config,
        toggleFullscreen,
        togglePiP,
        storage.addBookmark,
        storage.removeBookmark,
        storage.addNote,
        storage.updateNote,
        storage.removeNote,
        stateActions,
    ]);

    return (
        <VideoPlayerProvider value={contextValue}>
            <div
                ref={containerRef}
                className={`video-player-container ${className} ${state.isFullscreen ? 'fullscreen' : ''}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                tabIndex={0}
                role="application"
                aria-label={`Video player${title ? `: ${title}` : ''}`}
            >
                {title && <h3 className="video-title">{title}</h3>}

                <div className="video-player-layout">
                    {/* Main video area */}
                    <div className="video-main-area">
                        <div 
                            ref={videoContainerRef}
                            className="video-element-container"
                        >
                            {state.isLoading && <LoadingSpinner />}
                            {state.error && <ErrorMessage />}
                            <PlayOverlay />
                        </div>

                        <VideoControls />
                    </div>

                    {/* Side panels */}
                    <div className="video-side-panels">
                        <VideoChapters />
                        <VideoBookmarks />
                        <VideoNotes />
                    </div>
                </div>
            </div>
        </VideoPlayerProvider>
    );
};

export default VideoPlayer;
