/**
 * Environment configuration management
 * Centralizes all environment variables and provides type-safe access
 */

import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3000),

  // Database Configuration
  DATABASE_URL: Joi.string().required(),
  POSTGRES_USER: Joi.string().default('n8n'),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().default('n8n'),

  // Redis Configuration
  REDIS_URL: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),

  // n8n Configuration
  N8N_ENCRYPTION_KEY: Joi.string().min(32).required(),
  N8N_USER_MANAGEMENT_JWT_SECRET: Joi.string().min(32).required(),
  N8N_LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),

  // API Keys
  ELEVENLABS_API_KEY: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  LEONARDO_API_KEY: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  SOUNDSTRIPE_API_KEY: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  RUNWAY_API_KEY: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Third-Party API Configuration
  SUNO_API_URL: Joi.string().uri().default('https://api.sunoapi.org'),
  SUNO_API_KEY: Joi.string().optional(),
  KLING_API_URL: Joi.string().uri().default('https://api.piapi.ai/kling'),
  KLING_API_KEY: Joi.string().optional(),

  // File Storage Configuration
  ASSETS_STORAGE_PATH: Joi.string().default('./assets'),
  FINAL_DRAFT_IMPORT_PATH: Joi.string().default('./assets/scripts'),
  MEDIA_EXPORT_PATH: Joi.string().default('./assets/media'),
  PREMIERE_PROJECTS_PATH: Joi.string().default('./assets/premiere-projects'),

  // MCP Server Configuration
  MCP_FINAL_DRAFT_PORT: Joi.number().default(8001),
  MCP_PREMIERE_PRO_PORT: Joi.number().default(8002),
  MCP_ORCHESTRATION_PORT: Joi.number().default(8003),

  // Monitoring and Logging
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  LOG_FILE_PATH: Joi.string().default('./logs/app.log'),
  ENABLE_METRICS: Joi.boolean().default(true),
  SENTRY_DSN: Joi.string().optional(),

  // Cost Monitoring
  DAILY_BUDGET_LIMIT: Joi.number().default(100.0),
  WEEKLY_BUDGET_LIMIT: Joi.number().default(500.0),
  MONTHLY_BUDGET_LIMIT: Joi.number().default(2000.0),
  COST_ALERT_EMAIL: Joi.string().email().optional(),

  // Security Configuration
  JWT_SECRET: Joi.string().min(32).required(),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000,http://localhost:5678'),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),

  // Development Configuration
  ENABLE_DEBUG_LOGGING: Joi.boolean().default(false),
  MOCK_API_RESPONSES: Joi.boolean().default(false),
  SKIP_API_RATE_LIMITS: Joi.boolean().default(false),

  // GitHub Configuration
  GITHUB_TOKEN: Joi.string().optional(),
  GITHUB_REPO: Joi.string().default('altsang/video-n8n'),

  // Notification Configuration
  SLACK_WEBHOOK_URL: Joi.string().uri().optional(),
  EMAIL_SERVICE_API_KEY: Joi.string().optional(),
}).unknown();

// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export typed configuration object
export const config = {
  // Environment
  nodeEnv: envVars.NODE_ENV as 'development' | 'test' | 'production',
  port: envVars.PORT as number,
  isDevelopment: envVars.NODE_ENV === 'development',
  isProduction: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',

  // Database
  database: {
    url: envVars.DATABASE_URL as string,
    user: envVars.POSTGRES_USER as string,
    password: envVars.POSTGRES_PASSWORD as string,
    database: envVars.POSTGRES_DB as string,
  },

  // Redis
  redis: {
    url: envVars.REDIS_URL as string,
    password: envVars.REDIS_PASSWORD as string,
  },

  // n8n
  n8n: {
    encryptionKey: envVars.N8N_ENCRYPTION_KEY as string,
    jwtSecret: envVars.N8N_USER_MANAGEMENT_JWT_SECRET as string,
    logLevel: envVars.N8N_LOG_LEVEL as string,
  },

  // API Keys
  apiKeys: {
    elevenlabs: envVars.ELEVENLABS_API_KEY as string,
    leonardo: envVars.LEONARDO_API_KEY as string,
    soundstripe: envVars.SOUNDSTRIPE_API_KEY as string,
    runway: envVars.RUNWAY_API_KEY as string,
    suno: envVars.SUNO_API_KEY as string,
    kling: envVars.KLING_API_KEY as string,
  },

  // Third-Party APIs
  thirdPartyApis: {
    suno: {
      url: envVars.SUNO_API_URL as string,
      key: envVars.SUNO_API_KEY as string,
    },
    kling: {
      url: envVars.KLING_API_URL as string,
      key: envVars.KLING_API_KEY as string,
    },
  },

  // File Storage
  storage: {
    assetsPath: envVars.ASSETS_STORAGE_PATH as string,
    finalDraftPath: envVars.FINAL_DRAFT_IMPORT_PATH as string,
    mediaPath: envVars.MEDIA_EXPORT_PATH as string,
    premierePath: envVars.PREMIERE_PROJECTS_PATH as string,
  },

  // MCP Servers
  mcp: {
    finalDraftPort: envVars.MCP_FINAL_DRAFT_PORT as number,
    premiereProPort: envVars.MCP_PREMIERE_PRO_PORT as number,
    orchestrationPort: envVars.MCP_ORCHESTRATION_PORT as number,
  },

  // Logging
  logging: {
    level: envVars.LOG_LEVEL as string,
    filePath: envVars.LOG_FILE_PATH as string,
    enableMetrics: envVars.ENABLE_METRICS as boolean,
    sentryDsn: envVars.SENTRY_DSN as string,
  },

  // Cost Monitoring
  budget: {
    daily: envVars.DAILY_BUDGET_LIMIT as number,
    weekly: envVars.WEEKLY_BUDGET_LIMIT as number,
    monthly: envVars.MONTHLY_BUDGET_LIMIT as number,
    alertEmail: envVars.COST_ALERT_EMAIL as string,
  },

  // Security
  security: {
    jwtSecret: envVars.JWT_SECRET as string,
    corsOrigin: (envVars.CORS_ORIGIN as string).split(','),
    rateLimit: {
      windowMs: envVars.RATE_LIMIT_WINDOW_MS as number,
      maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS as number,
    },
  },

  // Development
  development: {
    enableDebugLogging: envVars.ENABLE_DEBUG_LOGGING as boolean,
    mockApiResponses: envVars.MOCK_API_RESPONSES as boolean,
    skipApiRateLimits: envVars.SKIP_API_RATE_LIMITS as boolean,
  },

  // External Services
  github: {
    token: envVars.GITHUB_TOKEN as string,
    repo: envVars.GITHUB_REPO as string,
  },

  // Notifications
  notifications: {
    slackWebhookUrl: envVars.SLACK_WEBHOOK_URL as string,
    emailServiceApiKey: envVars.EMAIL_SERVICE_API_KEY as string,
  },
} as const;
