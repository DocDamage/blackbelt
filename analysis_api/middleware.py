"""
FastAPI Middleware Configuration
Security headers and correlation ID middleware
"""

import logging
import time
import uuid
from typing import Optional

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

# Security headers configuration
SECURITY_HEADERS = {
    # Prevent clickjacking attacks
    "X-Frame-Options": "DENY",
    # Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    # XSS protection (legacy browsers)
    "X-XSS-Protection": "1; mode=block",
    # Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",
    # Permissions policy
    "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()",
    # Content Security Policy
    "Content-Security-Policy": (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: blob:; "
        "font-src 'self'; "
        "connect-src 'self'; "
        "media-src 'self'; "
        "object-src 'none'; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self';"
    ),
    # Strict Transport Security (HTTPS only)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    
    Headers added:
    - X-Frame-Options: Prevents clickjacking
    - X-Content-Type-Options: Prevents MIME sniffing
    - X-XSS-Protection: XSS filter for legacy browsers
    - Referrer-Policy: Controls referrer information
    - Permissions-Policy: Restricts browser features
    - Content-Security-Policy: Prevents XSS and data injection
    - Strict-Transport-Security: Enforces HTTPS
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        
        # Add security headers to response
        for header, value in SECURITY_HEADERS.items():
            response.headers[header] = value
        
        return response


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """
    Middleware to handle correlation IDs for request tracing.
    
    Generates or propagates correlation IDs to enable distributed tracing
    across the application. The correlation ID is:
    - Extracted from X-Correlation-Id header if present
    - Generated as UUID v4 if not present
    - Added to response headers
    - Stored in request state for logging
    """
    
    CORRELATION_ID_HEADER = "X-Correlation-Id"
    
    async def dispatch(self, request: Request, call_next) -> Response:
        # Get or generate correlation ID
        correlation_id = request.headers.get(
            self.CORRELATION_ID_HEADER,
            str(uuid.uuid4())
        )
        
        # Store in request state for access in route handlers
        request.state.correlation_id = correlation_id
        
        # Process request
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Add correlation ID to response headers
        response.headers[self.CORRELATION_ID_HEADER] = correlation_id
        
        # Add timing header
        response.headers["X-Response-Time"] = f"{process_time:.3f}s"
        
        return response


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all requests and responses.
    
    Logs include:
    - HTTP method and path
    - Client IP address
    - Correlation ID
    - Response status code
    - Processing time
    - User agent
    """
    
    def __init__(self, app, logger: Optional[logging.Logger] = None):
        super().__init__(app)
        self.logger = logger or logging.getLogger(__name__)
    
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        
        # Get correlation ID from request state if available
        correlation_id = getattr(request.state, 'correlation_id', 'unknown')
        
        # Log request
        self.logger.info(
            "Request started",
            extra={
                "correlation_id": correlation_id,
                "method": request.method,
                "path": request.url.path,
                "client_ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("User-Agent"),
            }
        )
        
        # Process request
        try:
            response = await call_next(request)
            status_code = response.status_code
        except Exception as exc:
            status_code = 500
            self.logger.exception(
                "Request failed",
                extra={
                    "correlation_id": correlation_id,
                    "method": request.method,
                    "path": request.url.path,
                    "error": str(exc),
                }
            )
            raise
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response
        self.logger.info(
            "Request completed",
            extra={
                "correlation_id": correlation_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": status_code,
                "processing_time_ms": round(process_time * 1000, 2),
            }
        )
        
        return response


def setup_middleware(app, logger: Optional[logging.Logger] = None):
    """
    Configure all middleware for the FastAPI application.
    
    Middleware order (first added = outermost):
    1. CorrelationIdMiddleware - Adds correlation ID first
    2. LoggingMiddleware - Logs with correlation ID
    3. SecurityHeadersMiddleware - Adds security headers last
    
    Args:
        app: FastAPI application instance
        logger: Optional logger instance for logging middleware
    """
    # Correlation ID must be first to be available to other middleware
    app.add_middleware(CorrelationIdMiddleware)
    
    # Logging middleware needs correlation ID
    app.add_middleware(LoggingMiddleware, logger=logger)
    
    # Security headers last (modifies response)
    app.add_middleware(SecurityHeadersMiddleware)
