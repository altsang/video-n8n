/**
 * Health check utility for monitoring application and service status
 */
import { Request, Response } from 'express';
interface HealthStatus {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
    version: string;
    environment: string;
    services: {
        [key: string]: {
            status: 'up' | 'down' | 'degraded';
            responseTime?: number;
            error?: string;
        };
    };
    system: {
        uptime: number;
        memory: {
            used: number;
            total: number;
            percentage: number;
        };
        cpu: {
            usage: string;
        };
    };
}
export declare function performHealthCheck(): Promise<HealthStatus>;
export declare function healthCheck(req: Request, res: Response): Promise<void>;
export declare function simpleHealthCheck(): Promise<boolean>;
export {};
//# sourceMappingURL=health-check.d.ts.map