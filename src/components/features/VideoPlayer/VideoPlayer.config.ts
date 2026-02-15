/**
 * VideoPlayer Configuration
 * 
 * Default constants and configuration values.
 */

import type { VideoPlayerConfig } from './VideoPlayer.types';

export const DEFAULT_VIDEO_CONFIG: VideoPlayerConfig = {
    completionThreshold: 90,
    throttleInterval: 500,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    skipDuration: 10,
    volumeStep: 0.1,
    enableKeyboardShortcuts: true,
    enablePiP: true,
    enableFullscreen: true,
    storageKey: 'video-player',
} as const;

export const VIDEO_ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    DECODE_ERROR: 'DECODE_ERROR',
    SRC_NOT_SUPPORTED: 'SRC_NOT_SUPPORTED',
    YOUTUBE_ERROR: 'YOUTUBE_ERROR',
    YOUTUBE_EMBED_DISABLED: 'YOUTUBE_EMBED_DISABLED',
    YOUTUBE_VIDEO_NOT_FOUND: 'YOUTUBE_VIDEO_NOT_FOUND',
    VIMEO_ERROR: 'VIMEO_ERROR',
    VIMEO_PRIVATE: 'VIMEO_PRIVATE',
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
    HOME: ['Home'],
    END: ['End'],
} as const;

// YouTube Player State Constants
// YouTube Player States (used internally by providers)
// These are accessed via window.YT.PlayerState
// See: https://developers.google.com/youtube/iframe_api_reference#Playback_status

// YouTube Error Codes
export const YOUTUBE_ERROR_CODES: Record<number, string> = {
    2: 'Invalid parameter',
    5: 'HTML5 player error',
    100: 'Video not found',
    101: 'Embedding disabled',
    150: 'Embedding disabled',
};
