module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/config/environment.ts', // Configuration file - no business logic to test
    '!src/health-check.ts', // Standalone script - tested separately
    '!src/utils/logger.ts', // Infrastructure utility - configuration-based
    '!src/utils/error-handler.ts', // Infrastructure utility - will test in Epic 2
    '!src/index.ts', // Main entry point - will test when adding API routes in Epic 2
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/api/(.*)$': '<rootDir>/src/api/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/workflows/(.*)$': '<rootDir>/src/workflows/$1',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/docker/',
  ],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: '50%',
};