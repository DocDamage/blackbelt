/**
 * ErrorMessage Component
 * 
 * Video error display with retry option.
 */

import { memo } from 'react';
import { useVideoPlayer } from '../contexts/VideoPlayerContext';

export const ErrorMessage = memo(function ErrorMessage() {
    const { state, actions } = useVideoPlayer();

    if (!state.error) {
        return null;
    }

    return (
        <div className="error-overlay" role="alert" aria-live="assertive">
            <div className="error-content">
                <svg viewBox="0 0 24 24" fill="currentColor" className="error-icon" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <h3 className="error-title">Video Error</h3>
                <p className="error-message">{state.error.message}</p>
                {state.error.recoverable && (
                    <button 
                        onClick={actions.clearError}
                        className="error-retry-btn"
                        type="button"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
});
