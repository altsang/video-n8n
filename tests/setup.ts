/**
 * Test setup configuration
 * Global setup for Jest tests
 */

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };

// Restore console methods after each test
afterEach(() => {
  Object.assign(console, originalConsole);
});

// Global test timeout
jest.setTimeout(30000);

// Mock external services by default
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
  logApiCall: jest.fn(),
  logCostTracking: jest.fn(),
  logWorkflowExecution: jest.fn(),
  logSecurityEvent: jest.fn(),
  logError: jest.fn(),
  logPerformance: jest.fn(),
  debug: jest.fn(),
}));

// Setup global test variables
declare global {
  namespace NodeJS {
    interface Global {
      testConfig: {
        mockApiResponses: boolean;
        skipExternalCalls: boolean;
      };
    }
  }
}

global.testConfig = {
  mockApiResponses: true,
  skipExternalCalls: true,
};