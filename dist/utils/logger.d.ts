/**
 * Centralized logging utility using Winston
 * Provides structured logging with different levels and transports
 */
import winston from 'winston';
export declare const logger: winston.Logger;
export declare const createRequestLogger: (requestId: string) => winston.Logger;
export declare const logApiCall: (service: string, endpoint: string, method: string, statusCode?: number, duration?: number, error?: Error) => void;
export declare const logCostTracking: (service: string, operation: string, cost: number, currency?: string) => void;
export declare const logWorkflowExecution: (workflowId: string, executionId: string, status: "started" | "completed" | "failed", duration?: number, error?: Error) => void;
export declare const logSecurityEvent: (event: string, userId?: string, ipAddress?: string, details?: Record<string, unknown>) => void;
export declare const logError: (error: Error, context?: Record<string, unknown>) => void;
export declare const logPerformance: (operation: string, duration: number, metadata?: Record<string, unknown>) => void;
export declare const debug: (message: string, data?: Record<string, unknown>) => void;
//# sourceMappingURL=logger.d.ts.map