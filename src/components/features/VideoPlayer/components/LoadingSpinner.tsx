/**
 * LoadingSpinner Component
 * 
 * Buffering/loading indicator.
 */

import { memo } from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
    return (
        <div className="loading-spinner-overlay" role="status" aria-live="polite">
            <div className="loading-spinner">
                <svg viewBox="0 0 50 50" aria-hidden="true">
                    <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="80"
                        strokeDashoffset="60"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 25 25"
                            to="360 25 25"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </svg>
            </div>
            <span className="loading-message">{message}</span>
        </div>
    );
});
