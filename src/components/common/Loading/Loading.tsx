/**
 * Loading component for async operations
 * Provides consistent loading indicators across the application
 */

import './Loading.css';

export interface LoadingProps {
    /** Size variant */
    size?: 'small' | 'medium' | 'large';
    /** Optional loading message */
    message?: string;
    /** Full screen overlay */
    fullscreen?: boolean;
    /** Inline variant (shows spinner next to text) */
    inline?: boolean;
}

export function Loading({
    size = 'medium',
    message,
    fullscreen = false,
    inline = false
}: LoadingProps) {
    const classNames = [
        'loading',
        `loading--${size}`,
        fullscreen && 'loading--fullscreen',
        inline && 'loading--inline'
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} role="status" aria-live="polite">
            <div className="loading__spinner" aria-hidden="true">
                <div className="loading__ring"></div>
            </div>
            {message && <span className="loading__message">{message}</span>}
            <span className="sr-only">Loading...</span>
        </div>
    );
}

/**
 * Loading overlay for blocking content during async operations
 */
export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="loading-overlay" role="status" aria-live="polite">
            <Loading size="large" message={message} />
        </div>
    );
}

/**
 * Skeleton loader for content placeholders
 */
export function Skeleton({
    width,
    height,
    variant = 'text',
    count = 1
}: {
    width?: string;
    height?: string;
    variant?: 'text' | 'rectangular' | 'circular';
    count?: number;
}) {
    const items = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {items.map((i) => (
                <div
                    key={i}
                    className={`skeleton skeleton--${variant}`}
                    style={{ width, height }}
                    aria-hidden="true"
                />
            ))}
        </>
    );
}

export default Loading;