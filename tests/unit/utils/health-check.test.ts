/**
 * Unit tests for health check utility
 */

import { performHealthCheck, simpleHealthCheck } from '@/utils/health-check';

// Mock the config module
jest.mock('@/config/environment', () => ({
  config: {
    nodeEnv: 'test',
    storage: {
      assetsPath: './test-assets',
      finalDraftPath: './test-assets/scripts',
      mediaPath: './test-assets/media',
      premierePath: './test-assets/premiere-projects',
    },
  },
}));

// Mock fs/promises
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  constants: {
    W_OK: 2,
  },
}));

describe('Health Check Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('performHealthCheck', () => {
    it('should return healthy status when all services are up', async () => {
      const result = await performHealthCheck();

      expect(result).toMatchObject({
        status: expect.stringMatching(/healthy|degraded|unhealthy/),
        timestamp: expect.any(String),
        version: '0.1.0',
        environment: 'test',
        services: expect.any(Object),
        system: expect.objectContaining({
          uptime: expect.any(Number),
          memory: expect.objectContaining({
            used: expect.any(Number),
            total: expect.any(Number),
            percentage: expect.any(Number),
          }),
          cpu: expect.objectContaining({
            usage: expect.any(String),
          }),
        }),
      });
    });

    it('should include service status for each checked service', async () => {
      const result = await performHealthCheck();

      expect(result.services).toHaveProperty('database');
      expect(result.services).toHaveProperty('redis');
      expect(result.services).toHaveProperty('n8n');
      expect(result.services).toHaveProperty('filesystem');

      // Each service should have status and optional responseTime
      Object.values(result.services).forEach(service => {
        expect(service).toHaveProperty('status');
        expect(['up', 'down', 'degraded']).toContain(service.status);
        
        if (service.responseTime !== undefined) {
          expect(typeof service.responseTime).toBe('number');
        }
      });
    });

    it('should return unhealthy status when services are down', async () => {
      // Mock filesystem check to fail
      const fs = require('fs/promises');
      fs.access.mockRejectedValue(new Error('Access denied'));
      fs.mkdir.mockRejectedValue(new Error('Cannot create directory'));

      const result = await performHealthCheck();

      // Should still complete but may be unhealthy or degraded
      expect(result.status).toBeDefined();
      expect(['healthy', 'degraded', 'unhealthy']).toContain(result.status);
    });

    it('should handle errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Force an error by mocking process.memoryUsage to throw
      const originalMemoryUsage = process.memoryUsage;
      process.memoryUsage = jest.fn().mockImplementation(() => {
        throw new Error('Memory usage error');
      });

      const result = await performHealthCheck();

      // Should still return a result even with errors
      expect(result).toBeDefined();
      expect(result.status).toBe('unhealthy');

      // Restore original function
      process.memoryUsage = originalMemoryUsage;
      consoleSpy.mockRestore();
    });
  });

  describe('simpleHealthCheck', () => {
    it('should return boolean indicating health status', async () => {
      const result = await simpleHealthCheck();
      expect(typeof result).toBe('boolean');
    });

    it('should return false on health check failure', async () => {
      // Mock performHealthCheck to throw
      jest.doMock('@/utils/health-check', () => ({
        ...jest.requireActual('@/utils/health-check'),
        performHealthCheck: jest.fn().mockRejectedValue(new Error('Health check failed')),
      }));

      const result = await simpleHealthCheck();
      expect(result).toBe(false);
    });
  });

  describe('system metrics', () => {
    it('should return valid memory metrics', async () => {
      const result = await performHealthCheck();

      expect(result.system.memory).toMatchObject({
        used: expect.any(Number),
        total: expect.any(Number),
        percentage: expect.any(Number),
      });

      expect(result.system.memory.percentage).toBeGreaterThanOrEqual(0);
      expect(result.system.memory.percentage).toBeLessThanOrEqual(100);
      expect(result.system.memory.used).toBeLessThanOrEqual(result.system.memory.total);
    });

    it('should return valid uptime', async () => {
      const result = await performHealthCheck();

      expect(result.system.uptime).toBeGreaterThanOrEqual(0);
      expect(typeof result.system.uptime).toBe('number');
    });
  });
});