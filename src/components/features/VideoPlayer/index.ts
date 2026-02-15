/**
 * VideoPlayer Module
 * 
 * A modular, accessible video player component.
 * 
 * @example
 * ```tsx
 * import { VideoPlayer } from './components/features/VideoPlayer';
 * 
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
 */

// Main component
export { VideoPlayer } from './VideoPlayer';
export { VideoPlayer as default } from './VideoPlayer';

// Types
export type {
    VideoType,
    VideoSource,
    VideoChapter,
    VideoBookmark,
    VideoNote,
    VideoProgress,
    VideoState,
    VideoError,
    VideoPlayerConfig,
    VideoPlayerProps,
} from './VideoPlayer.types';

// Hooks
export {
    useVideoState,
    useVideoProgress,
    useVideoStorage,
    useVideoKeyboard,
    useVideoFullscreen,
    usePictureInPicture,
    useVideoVisibility,
} from './hooks';

// Context
export { VideoPlayerProvider, useVideoPlayer } from './contexts';
export type { VideoPlayerContextValue } from './contexts';

// Providers
export { BaseVideoProvider, NativeVideoProvider, YouTubeProvider } from './providers';

// Utils
export {
    formatTime,
    formatDuration,
    calculateProgress,
    normalizeVideoSource,
    clamp,
} from './VideoPlayer.utils';

// Config
export { DEFAULT_VIDEO_CONFIG } from './VideoPlayer.config';
