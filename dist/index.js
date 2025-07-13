"use strict";
/**
 * Main entry point for the Video-n8n application
 * Handles server initialization and coordination between components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const environment_1 = require("./config/environment");
const logger_1 = require("./utils/logger");
const health_check_1 = require("./utils/health-check");
const error_handler_1 = require("./utils/error-handler");
// API Routes (will be implemented in Epic 2)
// import { apiRoutes } from './api/routes';
const app = (0, express_1.default)();
exports.app = app;
const PORT = environment_1.config.port || 3000;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: environment_1.config.security.corsOrigin,
    credentials: true,
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', health_check_1.healthCheck);
// API routes (placeholder for Epic 2)
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        service: 'video-n8n',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
    });
});
// Future API routes will be added here
// app.use('/api', apiRoutes);
// Error handling middleware
app.use(error_handler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
    });
});
// Start server
async function startServer() {
    try {
        app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Video-n8n server started on port ${PORT}`);
            logger_1.logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
            logger_1.logger.info(`🔗 API status at http://localhost:${PORT}/api/status`);
            logger_1.logger.info(`🌍 Environment: ${environment_1.config.nodeEnv}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Start the application
if (require.main === module) {
    void startServer();
}
//# sourceMappingURL=index.js.map