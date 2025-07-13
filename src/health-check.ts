#!/usr/bin/env node

/**
 * Standalone health check script for Docker containers
 * This script is used by Docker's HEALTHCHECK instruction
 */

import { simpleHealthCheck } from './utils/health-check';

async function main(): Promise<void> {
  try {
    const isHealthy = await simpleHealthCheck();
    
    if (isHealthy) {
      console.log('✅ Application is healthy');
      process.exit(0);
    } else {
      console.log('❌ Application is unhealthy');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  void main();
}