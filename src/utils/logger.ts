/**
 * Centralized logging utility using Winston
 * Provides structured logging with different levels and transports
 */

import winston from 'winston';
import { config } from '@/config/environment';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  })
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss',
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Create transports array
const transports: winston.transport[] = [];

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    format: config.isDevelopment ? consoleFormat : logFormat,
    level: config.logging.level,
  })
);

// File transport (for production and when file path is configured)
if (config.logging.filePath && (config.isProduction || config.development.enableDebugLogging)) {
  transports.push(
    new winston.transports.File({
      filename: config.logging.filePath,
      format: logFormat,
      level: config.logging.level,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create the logger
export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Add request ID tracking for better debugging
export const createRequestLogger = (requestId: string): winston.Logger => {
  return logger.child({ requestId });
};

// Utility functions for common logging patterns
export const logApiCall = (
  service: string,
  endpoint: string,
  method: string,
  statusCode?: number,
  duration?: number,
  error?: Error
): void => {
  const logData = {
    service,
    endpoint,
    method,
    statusCode,
    duration,
    error: error?.message,
    stack: error?.stack,
  };

  if (error || (statusCode && statusCode >= 400)) {
    logger.error('API call failed', logData);
  } else {
    logger.info('API call completed', logData);
  }
};

export const logCostTracking = (
  service: string,
  operation: string,
  cost: number,
  currency = 'USD'
): void => {
  logger.info('Cost tracking', {
    service,
    operation,
    cost,
    currency,
    timestamp: new Date().toISOString(),
  });
};

export const logWorkflowExecution = (
  workflowId: string,
  executionId: string,
  status: 'started' | 'completed' | 'failed',
  duration?: number,
  error?: Error
): void => {
  const logData = {
    workflowId,
    executionId,
    status,
    duration,
    error: error?.message,
    stack: error?.stack,
  };

  if (status === 'failed' || error) {
    logger.error('Workflow execution failed', logData);
  } else {
    logger.info('Workflow execution update', logData);
  }
};

export const logSecurityEvent = (
  event: string,
  userId?: string,
  ipAddress?: string,
  details?: Record<string, unknown>
): void => {
  logger.warn('Security event', {
    event,
    userId,
    ipAddress,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Error logging with context
export const logError = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  logger.error('Application error', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    context,
  });
};

// Performance logging
export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, unknown>
): void => {
  const level = duration > 5000 ? 'warn' : 'info'; // Warn if operation takes more than 5 seconds
  
  logger[level]('Performance metric', {
    operation,
    duration,
    metadata,
  });
};

// Development helper for debugging
export const debug = (message: string, data?: Record<string, unknown>): void => {
  if (config.development.enableDebugLogging) {
    logger.debug(message, data);
  }
};