/**
 * useVideoState Hook
 * 
 * Core video playback state management using useReducer.
 */

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
    | { type: 'MUTE'; payload: boolean }
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
            return { 
                ...state, 
                volume: action.payload, 
                isMuted: action.payload === 0 
            };
        case 'MUTE_TOGGLE':
            return { ...state, isMuted: !state.isMuted };
        case 'MUTE':
            return { ...state, isMuted: action.payload };
        case 'RATE_CHANGE':
            return { ...state, playbackRate: action.payload };
        case 'FULLSCREEN_CHANGE':
            return { ...state, isFullscreen: action.payload };
        case 'PIP_CHANGE':
            return { ...state, isPiP: action.payload };
        case 'ERROR':
            return { 
                ...state, 
                error: action.payload, 
                isPlaying: false, 
                isLoading: false 
            };
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
        setMuted: useCallback((muted: boolean) => {
            dispatch({ type: 'MUTE', payload: muted });
        }, []),
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

export type VideoStateActions = ReturnType<typeof useVideoState>['actions'];
