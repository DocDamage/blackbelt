"""
Structured Logging Configuration
Centralized logging with correlation IDs and JSON formatting
"""

import logging
import sys
from typing import Any, Dict

import structlog


def configure_logging(log_level: str = "INFO", json_format: bool = False) -> None:
    """
    Configure structured logging for the application.
    
    Sets up structlog with:
    - Timestamp rendering
    - Log level filtering
    - Correlation ID tracking
    - JSON or console formatting
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR)
        json_format: If True, output JSON formatted logs
    """
    
    # Configure standard library logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )
    
    # Structlog processors chain
    shared_processors: list = [
        # Add timestamp
        structlog.processors.TimeStamper(fmt="iso"),
        # Add log level
        structlog.stdlib.add_log_level,
        # Add logger name
        structlog.stdlib.add_logger_name,
        # Format positional arguments
        structlog.stdlib.PositionalArgumentsFormatter(),
        # Add caller info for debugging
        structlog.processors.CallsiteParameterAdder(
            [
                structlog.processors.CallsiteParameter.FILENAME,
                structlog.processors.CallsiteParameter.FUNC_NAME,
                structlog.processors.CallsiteParameter.LINENO,
            ]
        ),
        # Render stack traces
        structlog.processors.format_exc_info,
        # Unicode decoding
        structlog.processors.UnicodeDecoder(),
    ]
    
    if json_format:
        # JSON formatting for production
        shared_processors.append(structlog.processors.JSONRenderer())
    else:
        # Pretty console formatting for development
        shared_processors.append(
            structlog.dev.ConsoleRenderer(colors=sys.stdout.isatty())
        )
    
    # Configure structlog
    structlog.configure(
        processors=shared_processors,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )


def get_logger(name: str, **context) -> structlog.stdlib.BoundLogger:
    """
    Get a structured logger with optional context.
    
    Args:
        name: Logger name (typically __name__)
        **context: Additional context to bind to all log messages
        
    Returns:
        BoundLogger with structured logging capabilities
        
    Example:
        logger = get_logger(__name__, service="analysis_api")
        logger.info("Processing file", filename="data.csv", size=1024)
    """
    logger = structlog.get_logger(name)
    if context:
        logger = logger.bind(**context)
    return logger


class CorrelationIdFilter(logging.Filter):
    """
    Logging filter that adds correlation ID to log records.
    
    This filter extracts the correlation ID from the log context
    and adds it to the log record for formatting.
    """
    
    def filter(self, record: logging.LogRecord) -> bool:
        # Try to get correlation_id from structlog context
        context = structlog.contextvars.get_contextvars()
        record.correlation_id = context.get("correlation_id", "unknown")
        return True


def bind_correlation_id(correlation_id: str) -> None:
    """
    Bind correlation ID to the current logging context.
    
    This makes the correlation ID available to all subsequent
    log messages in the current request context.
    
    Args:
        correlation_id: The correlation ID to bind
    """
    structlog.contextvars.bind_contextvars(correlation_id=correlation_id)


def clear_context() -> None:
    """
    Clear the logging context.
    
    Should be called at the end of request processing to
    prevent context leakage between requests.
    """
    structlog.contextvars.clear_contextvars()
