#!/usr/bin/env node
"use strict";
/**
 * Standalone health check script for Docker containers
 * This script is used by Docker's HEALTHCHECK instruction
 */
Object.defineProperty(exports, "__esModule", { value: true });
const health_check_1 = require("./utils/health-check");
async function main() {
    try {
        const isHealthy = await (0, health_check_1.simpleHealthCheck)();
        if (isHealthy) {
            console.log('✅ Application is healthy');
            process.exit(0);
        }
        else {
            console.log('❌ Application is unhealthy');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('❌ Health check failed:', error);
        process.exit(1);
    }
}
// Only run if this file is executed directly
if (require.main === module) {
    void main();
}
//# sourceMappingURL=health-check.js.map