/**
 * Tests for Sentry Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { captureError, captureMessage, setUserContext, clearUserContext } from './sentry';

// Mock Sentry
const mockSentryInit = vi.fn();
const mockCaptureException = vi.fn();
const mockCaptureMessage = vi.fn();
const mockSetContext = vi.fn();
const mockSetUser = vi.fn();
const mockBrowserTracingIntegration = vi.fn(() => 'browserTracing');
const mockReplayIntegration = vi.fn((_opts?: unknown) => 'replay');

vi.mock('@sentry/react', () => ({
    init: (...args: unknown[]) => mockSentryInit(...args),
    captureException: (...args: unknown[]) => mockCaptureException(...args),
    captureMessage: (...args: unknown[]) => mockCaptureMessage(...args),
    setContext: (...args: unknown[]) => mockSetContext(...args),
    setUser: (...args: unknown[]) => mockSetUser(...args),
    browserTracingIntegration: () => mockBrowserTracingIntegration(),
    replayIntegration: (opts: unknown) => mockReplayIntegration(opts),
}));

describe('Sentry Utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('console', { ...console, info: vi.fn() });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('captureError', () => {
        it('captures exception without context', () => {
            const error = new Error('Test error');
            captureError(error);
            expect(mockCaptureException).toHaveBeenCalledWith(error);
        });

        it('captures exception with context', () => {
            const error = new Error('Test error');
            const context = { userId: '123', action: 'test' };
            captureError(error, context);
            expect(mockSetContext).toHaveBeenCalledWith('additional', context);
            expect(mockCaptureException).toHaveBeenCalledWith(error);
        });
    });

    describe('captureMessage', () => {
        it('captures message with default level', () => {
            captureMessage('Test message');
            expect(mockCaptureMessage).toHaveBeenCalledWith('Test message', 'info');
        });

        it('captures message with custom level', () => {
            captureMessage('Test message', 'error');
            expect(mockCaptureMessage).toHaveBeenCalledWith('Test message', 'error');
        });

        it('captures message with warning level', () => {
            captureMessage('Test message', 'warning');
            expect(mockCaptureMessage).toHaveBeenCalledWith('Test message', 'warning');
        });
    });

    describe('setUserContext', () => {
        it('sets user context with all fields', () => {
            const user = { id: '123', email: 'test@example.com', username: 'testuser' };
            setUserContext(user);
            expect(mockSetUser).toHaveBeenCalledWith(user);
        });

        it('sets user context with partial fields', () => {
            const user = { id: '123' };
            setUserContext(user);
            expect(mockSetUser).toHaveBeenCalledWith(user);
        });
    });

    describe('clearUserContext', () => {
        it('clears user context', () => {
            clearUserContext();
            expect(mockSetUser).toHaveBeenCalledWith(null);
        });
    });
});
