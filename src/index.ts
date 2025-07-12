/**
 * Main entry point for the Video-n8n application
 * Handles server initialization and coordination between components
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { healthCheck } from '@/utils/health-check';
import { errorHandler } from '@/utils/error-handler';

// API Routes (will be implemented in Epic 2)
// import { apiRoutes } from '@/api/routes';

const app = express();
const PORT = config.port || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', healthCheck);

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
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
async function startServer(): Promise<void> {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Video-n8n server started on port ${PORT}`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
      logger.info(`🔗 API status at http://localhost:${PORT}/api/status`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
if (require.main === module) {
  void startServer();
}

export { app };