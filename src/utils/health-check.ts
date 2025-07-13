/**
 * Health check utility for monitoring application and service status
 */

import { Request, Response } from 'express';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';

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

// Helper function to check service connectivity
async function checkService(
  name: string,
  checkFunction: () => Promise<boolean>
): Promise<{ status: 'up' | 'down' | 'degraded'; responseTime?: number; error?: string }> {
  const startTime = Date.now();

  try {
    const isHealthy = await Promise.race([
      checkFunction(),
      new Promise<boolean>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
    ]);

    const responseTime = Date.now() - startTime;

    return {
      status: isHealthy ? 'up' : 'down',
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return {
      status: 'down',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Database connectivity check
function checkDatabase(): Promise<boolean> {
  try {
    // Placeholder for database connection check
    // Will be implemented when database client is available
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}

// Redis connectivity check
function checkRedis(): Promise<boolean> {
  try {
    // Placeholder for Redis connection check
    // Will be implemented when Redis client is available
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}

// n8n service check
function checkN8n(): Promise<boolean> {
  try {
    // Placeholder for n8n health check
    // Will check n8n API endpoint when available
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}

// File system check
async function checkFileSystem(): Promise<boolean> {
  try {
    const fs = await import('fs/promises');

    // Check if required directories exist and are writable
    const requiredPaths = [
      config.storage.assetsPath,
      config.storage.finalDraftPath,
      config.storage.mediaPath,
      config.storage.premierePath,
    ];

    for (const path of requiredPaths) {
      try {
        await fs.access(path, fs.constants.W_OK);
      } catch {
        // Try to create the directory if it doesn't exist
        await fs.mkdir(path, { recursive: true });
      }
    }

    return true;
  } catch {
    return false;
  }
}

// Get system metrics
function getSystemMetrics(): {
  uptime: number;
  memory: { used: number; total: number; percentage: number };
  cpu: { usage: string };
} {
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
  } catch {
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
export async function performHealthCheck(): Promise<HealthStatus> {
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
    const degradedServices = Object.values(services).filter(
      service => service.status === 'degraded'
    );

    let overallStatus: 'healthy' | 'unhealthy' | 'degraded';
    if (downServices.length > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedServices.length > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: config.nodeEnv,
      services,
      system: getSystemMetrics(),
    };

    const totalTime = Date.now() - startTime;
    logger.info('Health check completed', {
      status: overallStatus,
      duration: totalTime,
      servicesDown: downServices.length,
      servicesDegraded: degradedServices.length,
    });

    return healthStatus;
  } catch (error) {
    logger.error('Health check failed', { error });

    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: config.nodeEnv,
      services: {},
      system: getSystemMetrics(),
    };
  }
}

// Express middleware for health check endpoint
export async function healthCheck(req: Request, res: Response): Promise<void> {
  try {
    const healthStatus = await performHealthCheck();

    // Set appropriate HTTP status code
    const statusCode =
      healthStatus.status === 'healthy' ? 200 : healthStatus.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error('Health check endpoint error', { error });
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
}

// Simplified health check for Docker containers
export async function simpleHealthCheck(): Promise<boolean> {
  try {
    const healthStatus = await performHealthCheck();
    return healthStatus.status !== 'unhealthy';
  } catch {
    return false;
  }
}
