"use strict";
/**
 * Health check utility for monitoring application and service status
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.performHealthCheck = performHealthCheck;
exports.healthCheck = healthCheck;
exports.simpleHealthCheck = simpleHealthCheck;
const environment_1 = require("@/config/environment");
const logger_1 = require("@/utils/logger");
// Helper function to check service connectivity
async function checkService(name, checkFunction) {
    const startTime = Date.now();
    try {
        const isHealthy = await Promise.race([
            checkFunction(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
        ]);
        const responseTime = Date.now() - startTime;
        return {
            status: isHealthy ? 'up' : 'down',
            responseTime,
        };
    }
    catch (error) {
        const responseTime = Date.now() - startTime;
        return {
            status: 'down',
            responseTime,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
// Database connectivity check
function checkDatabase() {
    try {
        // Placeholder for database connection check
        // Will be implemented when database client is available
        return Promise.resolve(true);
    }
    catch {
        return Promise.resolve(false);
    }
}
// Redis connectivity check
function checkRedis() {
    try {
        // Placeholder for Redis connection check
        // Will be implemented when Redis client is available
        return Promise.resolve(true);
    }
    catch {
        return Promise.resolve(false);
    }
}
// n8n service check
function checkN8n() {
    try {
        // Placeholder for n8n health check
        // Will check n8n API endpoint when available
        return Promise.resolve(true);
    }
    catch {
        return Promise.resolve(false);
    }
}
// File system check
async function checkFileSystem() {
    try {
        const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
        // Check if required directories exist and are writable
        const requiredPaths = [
            environment_1.config.storage.assetsPath,
            environment_1.config.storage.finalDraftPath,
            environment_1.config.storage.mediaPath,
            environment_1.config.storage.premierePath,
        ];
        for (const path of requiredPaths) {
            try {
                await fs.access(path, fs.constants.W_OK);
            }
            catch {
                // Try to create the directory if it doesn't exist
                await fs.mkdir(path, { recursive: true });
            }
        }
        return true;
    }
    catch {
        return false;
    }
}
// Get system metrics
function getSystemMetrics() {
    try {
        const memoryUsage = process.memoryUsage();
        const uptime = process.uptime();
        return {
            uptime,
            memory: {
                used: memoryUsage.heapUsed,
                total: memoryUsage.heapTotal,
                percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
            },
            cpu: {
                usage: 'N/A', // CPU usage calculation would require additional monitoring
            },
        };
    }
    catch {
        // Return default values if metrics collection fails
        return {
            uptime: 0,
            memory: {
                used: 0,
                total: 0,
                percentage: 0,
            },
            cpu: {
                usage: 'N/A',
            },
        };
    }
}
// Main health check function
async function performHealthCheck() {
    const startTime = Date.now();
    try {
        // Check all services in parallel
        const serviceChecks = await Promise.all([
            checkService('database', checkDatabase),
            checkService('redis', checkRedis),
            checkService('n8n', checkN8n),
            checkService('filesystem', checkFileSystem),
        ]);
        const services = {
            database: serviceChecks[0],
            redis: serviceChecks[1],
            n8n: serviceChecks[2],
            filesystem: serviceChecks[3],
        };
        // Determine overall health status
        const downServices = Object.values(services).filter(service => service.status === 'down');
        const degradedServices = Object.values(services).filter(service => service.status === 'degraded');
        let overallStatus;
        if (downServices.length > 0) {
            overallStatus = 'unhealthy';
        }
        else if (degradedServices.length > 0) {
            overallStatus = 'degraded';
        }
        else {
            overallStatus = 'healthy';
        }
        const healthStatus = {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            version: '0.1.0',
            environment: environment_1.config.nodeEnv,
            services,
            system: getSystemMetrics(),
        };
        const totalTime = Date.now() - startTime;
        logger_1.logger.info('Health check completed', {
            status: overallStatus,
            duration: totalTime,
            servicesDown: downServices.length,
            servicesDegraded: degradedServices.length,
        });
        return healthStatus;
    }
    catch (error) {
        logger_1.logger.error('Health check failed', { error });
        return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            version: '0.1.0',
            environment: environment_1.config.nodeEnv,
            services: {},
            system: getSystemMetrics(),
        };
    }
}
// Express middleware for health check endpoint
async function healthCheck(req, res) {
    try {
        const healthStatus = await performHealthCheck();
        // Set appropriate HTTP status code
        const statusCode = healthStatus.status === 'healthy' ? 200 : healthStatus.status === 'degraded' ? 200 : 503;
        res.status(statusCode).json(healthStatus);
    }
    catch (error) {
        logger_1.logger.error('Health check endpoint error', { error });
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
        });
    }
}
// Simplified health check for Docker containers
async function simpleHealthCheck() {
    try {
        const healthStatus = await performHealthCheck();
        return healthStatus.status !== 'unhealthy';
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=health-check.js.map