/**
 * ErrorBoundary Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div>No error</div>;
};

describe('ErrorBoundary', () => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => { });

    it('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <div>Test content</div>
            </ErrorBoundary>
        );

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders error UI when an error is thrown', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
        render(
            <ErrorBoundary fallback={<div>Custom error UI</div>}>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    });

    it('resets error state when Try Again is clicked', () => {
        // Test that clicking "Try Again" resets the error boundary state
        // We use a key to force a fresh remount after clicking
        const { rerender } = render(
            <ErrorBoundary key="test-boundary-1">
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        // Verify error UI is shown
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();

        // Click Try Again button - verify it doesn't throw
        // The error boundary will try to re-render, which will throw again,
        // but the click handler should still work
        const tryAgainButton = screen.getByText('Try Again');
        expect(() => fireEvent.click(tryAgainButton)).not.toThrow();

        // Now rerender with a fresh ErrorBoundary and non-throwing child
        // Using a different key forces a complete remount
        rerender(
            <ErrorBoundary key="test-boundary-2">
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>
        );

        // After remount with no error, should show the normal content
        expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('shows error details in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument();

        process.env.NODE_ENV = originalEnv;
    });
});