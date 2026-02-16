/**
 * Structured Logging Utility with Correlation ID Support
 * 
 * Provides environment-aware logging with correlation IDs for request tracing.
 * Automatically disabled in production to prevent console noise.
 * 
 * Features:
 * - Log levels (debug, info, warn, error)
 * - Correlation ID generation and propagation
 * - Structured logging with context
 * - Automatic environment detection
 * 
 * @example
 * ```typescript
 * const logger = getLogger('ComponentName');
 * logger.info('User action', { userId: '123', action: 'click' });
 * ```
 */

// Generate or retrieve correlation ID
const CORRELATION_ID_KEY = 'x-correlation-id';

/**
 * Generate a UUID v4 for correlation IDs
 */
function generateCorrelationId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or create a correlation ID for the current session
 */
export function getCorrelationId(): string {
  if (typeof window === 'undefined') {
    return 'server-' + generateCorrelationId();
  }
  
  // Check for existing correlation ID in session storage
  let correlationId = sessionStorage.getItem(CORRELATION_ID_KEY);
  if (!correlationId) {
    correlationId = generateCorrelationId();
    sessionStorage.setItem(CORRELATION_ID_KEY, correlationId);
  }
  return correlationId;
}

/**
 * Set a custom correlation ID (useful for propagating IDs from backend)
 */
export function setCorrelationId(id: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(CORRELATION_ID_KEY, id);
  }
}

/**
 * Clear the current correlation ID
 */
export function clearCorrelationId(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(CORRELATION_ID_KEY);
  }
}

/**
 * Get correlation ID headers for API requests
 */
export function getCorrelationHeaders(): Record<string, string> {
  return {
    'X-Correlation-Id': getCorrelationId(),
  };
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private component: string;
  private correlationId: string;

  constructor(component: string) {
    this.component = component;
    this.correlationId = getCorrelationId();
  }

  /**
   * Check if logging is enabled based on environment
   */
  private isEnabled(): boolean {
    // Always disabled in production unless explicitly enabled
    if (import.meta.env.PROD && !import.meta.env.VITE_DEBUG_LOGS) {
      return false;
    }
    return true;
  }

  /**
   * Get log level priority
   */
  private getLevelPriority(level: LogLevel): number {
    const priorities: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return priorities[level];
  }

  /**
   * Check if the current log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.isEnabled()) return false;
    
    const configuredLevel = (import.meta.env.VITE_LOG_LEVEL || 'info') as LogLevel;
    return this.getLevelPriority(level) >= this.getLevelPriority(configuredLevel);
  }

  /**
   * Format log message with context
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): Record<string, unknown> {
    return {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      component: this.component,
      correlationId: this.correlationId,
      message,
      ...context,
    };
  }

  /**
   * Output log to console
   */
  private output(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): void {
    if (!this.shouldLog(level)) return;

    const formatted = this.formatMessage(level, message, context);
    const consoleMethod = level === 'error' ? 'error' : 
                          level === 'warn' ? 'warn' : 
                          level === 'debug' ? 'debug' : 'log';

    // Color coding for development
    if (!import.meta.env.PROD) {
      const colors: Record<LogLevel, string> = {
        debug: '\x1b[36m',  // Cyan
        info: '\x1b[32m',   // Green
        warn: '\x1b[33m',   // Yellow
        error: '\x1b[31m',  // Red
      };
      const reset = '\x1b[0m';
       
      console[consoleMethod](
        `${colors[level]}[${formatted.timestamp}] [${formatted.level}] [${this.component}]${reset}`,
        message,
        context ? context : ''
      );
    } else {
      // Production: structured JSON logging
       
      console[consoleMethod](JSON.stringify(formatted));
    }
  }

  debug(message: string, context?: LogContext): void {
    this.output('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.output('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.output('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.output('error', message, context);
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: LogContext): Logger {
    const childLogger = new Logger(this.component);
    const originalOutput = childLogger.output.bind(childLogger);
    childLogger.output = (level: LogLevel, message: string, context?: LogContext) => {
      originalOutput(level, message, { ...additionalContext, ...context });
    };
    return childLogger;
  }
}

/**
 * Get a logger instance for a component
 */
export function getLogger(component: string): Logger {
  return new Logger(component);
}

/**
 * Global logger for application-level logging
 */
export const appLogger = getLogger('App');

/**
 * API logger for HTTP request/response logging
 */
export const apiLogger = getLogger('API');
