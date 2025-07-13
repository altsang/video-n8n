"use strict";
/**
 * Centralized logging utility using Winston
 * Provides structured logging with different levels and transports
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.logPerformance = exports.logError = exports.logSecurityEvent = exports.logWorkflowExecution = exports.logCostTracking = exports.logApiCall = exports.createRequestLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const environment_1 = require("../config/environment");
// Custom log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
}), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
    });
}));
// Console format for development
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({
    format: 'HH:mm:ss',
}), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
}));
// Create transports array
const transports = [];
// Console transport (always enabled)
transports.push(new winston_1.default.transports.Console({
    format: environment_1.config.isDevelopment ? consoleFormat : logFormat,
    level: environment_1.config.logging.level,
}));
// File transport (for production and when file path is configured)
if (environment_1.config.logging.filePath && (environment_1.config.isProduction || environment_1.config.development.enableDebugLogging)) {
    transports.push(new winston_1.default.transports.File({
        filename: environment_1.config.logging.filePath,
        format: logFormat,
        level: environment_1.config.logging.level,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }));
}
// Create the logger
exports.logger = winston_1.default.createLogger({
    level: environment_1.config.logging.level,
    format: logFormat,
    transports,
    // Don't exit on handled exceptions
    exitOnError: false,
});
// Add request ID tracking for better debugging
const createRequestLogger = (requestId) => {
    return exports.logger.child({ requestId });
};
exports.createRequestLogger = createRequestLogger;
// Utility functions for common logging patterns
const logApiCall = (service, endpoint, method, statusCode, duration, error) => {
    const logData = {
        service,
        endpoint,
        method,
        statusCode,
        duration,
        error: error?.message,
        stack: error?.stack,
    };
    if (error ?? (statusCode != null && statusCode >= 400)) {
        exports.logger.error('API call failed', logData);
    }
    else {
        exports.logger.info('API call completed', logData);
    }
};
exports.logApiCall = logApiCall;
const logCostTracking = (service, operation, cost, currency = 'USD') => {
    exports.logger.info('Cost tracking', {
        service,
        operation,
        cost,
        currency,
        timestamp: new Date().toISOString(),
    });
};
exports.logCostTracking = logCostTracking;
const logWorkflowExecution = (workflowId, executionId, status, duration, error) => {
    const logData = {
        workflowId,
        executionId,
        status,
        duration,
        error: error?.message,
        stack: error?.stack,
    };
    if (status === 'failed' || error) {
        exports.logger.error('Workflow execution failed', logData);
    }
    else {
        exports.logger.info('Workflow execution update', logData);
    }
};
exports.logWorkflowExecution = logWorkflowExecution;
const logSecurityEvent = (event, userId, ipAddress, details) => {
    exports.logger.warn('Security event', {
        event,
        userId,
        ipAddress,
        details,
        timestamp: new Date().toISOString(),
    });
};
exports.logSecurityEvent = logSecurityEvent;
// Error logging with context
const logError = (error, context) => {
    exports.logger.error('Application error', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        context,
    });
};
exports.logError = logError;
// Performance logging
const logPerformance = (operation, duration, metadata) => {
    const level = duration > 5000 ? 'warn' : 'info'; // Warn if operation takes more than 5 seconds
    exports.logger[level]('Performance metric', {
        operation,
        duration,
        metadata,
    });
};
exports.logPerformance = logPerformance;
// Development helper for debugging
const debug = (message, data) => {
    if (environment_1.config.development.enableDebugLogging) {
        exports.logger.debug(message, data);
    }
};
exports.debug = debug;
//# sourceMappingURL=logger.js.map