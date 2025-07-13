"use strict";
/**
 * Test setup configuration
 * Global setup for Jest tests
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load test environment variables
dotenv_1.default.config({ path: '.env.test' });
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
global.testConfig = {
    mockApiResponses: true,
    skipExternalCalls: true,
};
//# sourceMappingURL=setup.js.map