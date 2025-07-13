/**
 * Centralized error handling middleware and utilities
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { config } from '@/config/environment';

// Custom error classes
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
  }
}

export class ExternalServiceError extends AppError {
  public readonly service: string;
  public readonly originalError: Error | undefined;

  constructor(service: string, message: string, originalError?: Error) {
    super(`${service} error: ${message}`, 502);
    this.service = service;
    this.originalError = originalError;
  }
}

export class CostLimitError extends AppError {
  public readonly service: string;
  public readonly cost: number;
  public readonly limit: number;

  constructor(service: string, cost: number, limit: number) {
    super(`Cost limit exceeded for ${service}: $${cost} > $${limit}`, 402);
    this.service = service;
    this.cost = cost;
    this.limit = limit;
  }
}

// Error response interface
interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    statusCode: number;
    details?: unknown;
    timestamp: string;
    requestId?: string;
  };
}

// Helper function to create error response
function createErrorResponse(error: Error, statusCode: number, requestId?: string): ErrorResponse {
  const response: ErrorResponse = {
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
  if (config.isDevelopment) {
    response.error.details = {
      stack: error.stack,
      name: error.name,
    };
  }

  return response;
}

// Main error handling middleware
export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
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
    logger.error('Server error', logData);
  } else if (statusCode >= 400) {
    logger.warn('Client error', logData);
  }

  // Send error response
  const errorResponse = createErrorResponse(
    error,
    statusCode,
    Array.isArray(requestId) ? requestId[0] : requestId
  );
  res.status(statusCode).json(errorResponse);
}

// Async error wrapper for route handlers
export function asyncHandler<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<void>
) {
  return (req: T, res: U, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404 handler for unmatched routes
export function notFoundHandler(req: Request, res: Response): void {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  const errorResponse = createErrorResponse(error, 404, req.headers['x-request-id'] as string);
  res.status(404).json(errorResponse);
}

// Handle uncaught exceptions and unhandled rejections
export function setupGlobalErrorHandlers(): void {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception - shutting down...', {
      message: error.message,
      stack: error.stack,
    });

    // Close server gracefully
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled Rejection - shutting down...', {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
      promise: String(promise),
    });

    // Close server gracefully
    process.exit(1);
  });
}

// Utility functions for common error scenarios
export function handleExternalApiError(
  service: string,
  response: { status?: number; statusText?: string }
): never {
  const { status, statusText } = response;
  const message = `${service} API error: ${status} ${statusText}`;
  throw new ExternalServiceError(service, message);
}

export function validateRequired<T>(value: T | undefined | null, fieldName: string): T {
  if (value === undefined || value === null) {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateApiKey(apiKey: string | undefined, service: string): string {
  if (!apiKey) {
    throw new ValidationError(`${service} API key is required`);
  }
  return apiKey;
}

export function checkCostLimit(service: string, cost: number, limit: number): void {
  if (cost > limit) {
    throw new CostLimitError(service, cost, limit);
  }
}
