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
      process.stdout.write('✅ Application is healthy\n');
      process.exit(0);
    } else {
      process.stdout.write('❌ Application is unhealthy\n');
      process.exit(1);
    }
  } catch (error) {
    process.stderr.write(`❌ Health check failed: ${error}\n`);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  void main();
}