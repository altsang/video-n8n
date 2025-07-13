"use strict";
/**
 * Centralized error handling middleware and utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostLimitError = exports.ExternalServiceError = exports.RateLimitError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.AppError = void 0;
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
exports.notFoundHandler = notFoundHandler;
exports.setupGlobalErrorHandlers = setupGlobalErrorHandlers;
exports.handleExternalApiError = handleExternalApiError;
exports.validateRequired = validateRequired;
exports.validateApiKey = validateApiKey;
exports.checkCostLimit = checkCostLimit;
const logger_1 = require("@/utils/logger");
const environment_1 = require("@/config/environment");
// Custom error classes
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class RateLimitError extends AppError {
    constructor(message = 'Rate limit exceeded') {
        super(message, 429);
    }
}
exports.RateLimitError = RateLimitError;
class ExternalServiceError extends AppError {
    service;
    originalError;
    constructor(service, message, originalError) {
        super(`${service} error: ${message}`, 502);
        this.service = service;
        this.originalError = originalError;
    }
}
exports.ExternalServiceError = ExternalServiceError;
class CostLimitError extends AppError {
    service;
    cost;
    limit;
    constructor(service, cost, limit) {
        super(`Cost limit exceeded for ${service}: $${cost} > $${limit}`, 402);
        this.service = service;
        this.cost = cost;
        this.limit = limit;
    }
}
exports.CostLimitError = CostLimitError;
// Helper function to create error response
function createErrorResponse(error, statusCode, requestId) {
    const response = {
        error: {
            message: error.message,
            statusCode,
            timestamp: new Date().toISOString(),
        },
    };
    if (requestId) {
        response.error.requestId = requestId;
    }
    // Add error code for known error types
    if (error instanceof AppError) {
        response.error.code = error.constructor.name;
    }
    // Add additional details in development
    if (environment_1.config.isDevelopment) {
        response.error.details = {
            stack: error.stack,
            name: error.name,
        };
    }
    return response;
}
// Main error handling middleware
function errorHandler(error, req, res, next) {
    // If response already sent, delegate to Express default handler
    if (res.headersSent) {
        return next(error);
    }
    const { 'x-request-id': requestId } = req.headers;
    // Determine status code
    const { statusCode = 500 } = error instanceof AppError ? error : {};
    // Log the error
    const logData = {
        message: error.message,
        stack: error.stack,
        statusCode,
        url: req.url,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        requestId,
    };
    if (statusCode >= 500) {
        logger_1.logger.error('Server error', logData);
    }
    else if (statusCode >= 400) {
        logger_1.logger.warn('Client error', logData);
    }
    // Send error response
    const errorResponse = createErrorResponse(error, statusCode, Array.isArray(requestId) ? requestId[0] : requestId);
    res.status(statusCode).json(errorResponse);
}
// Async error wrapper for route handlers
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
// 404 handler for unmatched routes
function notFoundHandler(req, res) {
    const error = new NotFoundError(`Route ${req.originalUrl}`);
    const errorResponse = createErrorResponse(error, 404, req.headers['x-request-id']);
    res.status(404).json(errorResponse);
}
// Handle uncaught exceptions and unhandled rejections
function setupGlobalErrorHandlers() {
    process.on('uncaughtException', (error) => {
        logger_1.logger.error('Uncaught Exception - shutting down...', {
            message: error.message,
            stack: error.stack,
        });
        // Close server gracefully
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        logger_1.logger.error('Unhandled Rejection - shutting down...', {
            reason: reason instanceof Error ? reason.message : String(reason),
            stack: reason instanceof Error ? reason.stack : undefined,
            promise: String(promise),
        });
        // Close server gracefully
        process.exit(1);
    });
}
// Utility functions for common error scenarios
function handleExternalApiError(service, response) {
    const { status, statusText } = response;
    const message = `${service} API error: ${status} ${statusText}`;
    throw new ExternalServiceError(service, message);
}
function validateRequired(value, fieldName) {
    if (value === undefined || value === null) {
        throw new ValidationError(`${fieldName} is required`);
    }
    return value;
}
function validateApiKey(apiKey, service) {
    if (!apiKey) {
        throw new ValidationError(`${service} API key is required`);
    }
    return apiKey;
}
function checkCostLimit(service, cost, limit) {
    if (cost > limit) {
        throw new CostLimitError(service, cost, limit);
    }
}
//# sourceMappingURL=error-handler.js.map