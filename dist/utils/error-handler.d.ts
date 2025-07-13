/**
 * Centralized error handling middleware and utilities
 */
import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    constructor(message: string, statusCode: number, isOperational?: boolean);
}
export declare class ValidationError extends AppError {
    constructor(message: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
export declare class RateLimitError extends AppError {
    constructor(message?: string);
}
export declare class ExternalServiceError extends AppError {
    readonly service: string;
    readonly originalError: Error | undefined;
    constructor(service: string, message: string, originalError?: Error);
}
export declare class CostLimitError extends AppError {
    readonly service: string;
    readonly cost: number;
    readonly limit: number;
    constructor(service: string, cost: number, limit: number);
}
export declare function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void;
export declare function asyncHandler<T extends Request, U extends Response>(fn: (req: T, res: U, next: NextFunction) => Promise<void>): (req: T, res: U, next: NextFunction) => void;
export declare function notFoundHandler(req: Request, res: Response): void;
export declare function setupGlobalErrorHandlers(): void;
export declare function handleExternalApiError(service: string, response: {
    status?: number;
    statusText?: string;
}, _data?: unknown): never;
export declare function validateRequired<T>(value: T | undefined | null, fieldName: string): T;
export declare function validateApiKey(apiKey: string | undefined, service: string): string;
export declare function checkCostLimit(service: string, cost: number, limit: number): void;
//# sourceMappingURL=error-handler.d.ts.map