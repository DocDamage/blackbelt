/**
 * Sentry Error Tracking Configuration
 * 
 * Initialize Sentry for production error monitoring.
 * The DSN should be set via VITE_SENTRY_DSN environment variable.
 */

import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env['VITE_SENTRY_DSN'];
const ENVIRONMENT = import.meta.env['MODE'] || 'development';

export function initSentry(): void {
    if (!SENTRY_DSN) {
        console.info('Sentry DSN not configured - error tracking disabled');
        return;
    }

    Sentry.init({
        dsn: SENTRY_DSN,
        environment: ENVIRONMENT,
        // Enable React component name annotations
        integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
                maskAllText: false,
                blockAllMedia: false,
            }),
        ],
        // Performance monitoring sample rate
        tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
        // Session replay sample rate
        replaysSessionSampleRate: 0.1,
        // Error replay sample rate
        replaysOnErrorSampleRate: 1.0,
        // Only enable in production or when explicitly configured
        enabled: ENVIRONMENT === 'production' || import.meta.env['VITE_SENTRY_ENABLED'] === 'true',
    });
}

export { Sentry };

// Helper to capture errors with context
export function captureError(error: Error, context?: Record<string, unknown>): void {
    if (context) {
        Sentry.setContext('additional', context);
    }
    Sentry.captureException(error);
}

// Helper to capture messages
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    Sentry.captureMessage(message, level);
}

// Helper to set user context
export function setUserContext(user: { id?: string; email?: string; username?: string }): void {
    Sentry.setUser(user);
}

// Helper to clear user context
export function clearUserContext(): void {
    Sentry.setUser(null);
}