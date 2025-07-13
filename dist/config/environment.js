"use strict";
/**
 * Environment configuration management
 * Centralizes all environment variables and provides type-safe access
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
// Load environment variables
dotenv_1.default.config();
// Environment validation schema
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string().valid('development', 'test', 'production').default('development'),
    PORT: joi_1.default.number().default(3000),
    // Database Configuration
    DATABASE_URL: joi_1.default.string().required(),
    POSTGRES_USER: joi_1.default.string().default('n8n'),
    POSTGRES_PASSWORD: joi_1.default.string().required(),
    POSTGRES_DB: joi_1.default.string().default('n8n'),
    // Redis Configuration
    REDIS_URL: joi_1.default.string().required(),
    REDIS_PASSWORD: joi_1.default.string().required(),
    // n8n Configuration
    N8N_ENCRYPTION_KEY: joi_1.default.string().min(32).required(),
    N8N_USER_MANAGEMENT_JWT_SECRET: joi_1.default.string().min(32).required(),
    N8N_LOG_LEVEL: joi_1.default.string().valid('error', 'warn', 'info', 'debug').default('info'),
    // API Keys
    ELEVENLABS_API_KEY: joi_1.default.string().when('NODE_ENV', {
        is: 'production',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    LEONARDO_API_KEY: joi_1.default.string().when('NODE_ENV', {
        is: 'production',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    SOUNDSTRIPE_API_KEY: joi_1.default.string().when('NODE_ENV', {
        is: 'production',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    RUNWAY_API_KEY: joi_1.default.string().when('NODE_ENV', {
        is: 'production',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    // Third-Party API Configuration
    SUNO_API_URL: joi_1.default.string().uri().default('https://api.sunoapi.org'),
    SUNO_API_KEY: joi_1.default.string().optional(),
    KLING_API_URL: joi_1.default.string().uri().default('https://api.piapi.ai/kling'),
    KLING_API_KEY: joi_1.default.string().optional(),
    // File Storage Configuration
    ASSETS_STORAGE_PATH: joi_1.default.string().default('./assets'),
    FINAL_DRAFT_IMPORT_PATH: joi_1.default.string().default('./assets/scripts'),
    MEDIA_EXPORT_PATH: joi_1.default.string().default('./assets/media'),
    PREMIERE_PROJECTS_PATH: joi_1.default.string().default('./assets/premiere-projects'),
    // MCP Server Configuration
    MCP_FINAL_DRAFT_PORT: joi_1.default.number().default(8001),
    MCP_PREMIERE_PRO_PORT: joi_1.default.number().default(8002),
    MCP_ORCHESTRATION_PORT: joi_1.default.number().default(8003),
    // Monitoring and Logging
    LOG_LEVEL: joi_1.default.string().valid('error', 'warn', 'info', 'debug').default('info'),
    LOG_FILE_PATH: joi_1.default.string().default('./logs/app.log'),
    ENABLE_METRICS: joi_1.default.boolean().default(true),
    SENTRY_DSN: joi_1.default.string().optional(),
    // Cost Monitoring
    DAILY_BUDGET_LIMIT: joi_1.default.number().default(100.0),
    WEEKLY_BUDGET_LIMIT: joi_1.default.number().default(500.0),
    MONTHLY_BUDGET_LIMIT: joi_1.default.number().default(2000.0),
    COST_ALERT_EMAIL: joi_1.default.string().email().optional(),
    // Security Configuration
    JWT_SECRET: joi_1.default.string().min(32).required(),
    CORS_ORIGIN: joi_1.default.string().default('http://localhost:3000,http://localhost:5678'),
    RATE_LIMIT_WINDOW_MS: joi_1.default.number().default(900000), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: joi_1.default.number().default(100),
    // Development Configuration
    ENABLE_DEBUG_LOGGING: joi_1.default.boolean().default(false),
    MOCK_API_RESPONSES: joi_1.default.boolean().default(false),
    SKIP_API_RATE_LIMITS: joi_1.default.boolean().default(false),
    // GitHub Configuration
    GITHUB_TOKEN: joi_1.default.string().optional(),
    GITHUB_REPO: joi_1.default.string().default('altsang/video-n8n'),
    // Notification Configuration
    SLACK_WEBHOOK_URL: joi_1.default.string().uri().optional(),
    EMAIL_SERVICE_API_KEY: joi_1.default.string().optional(),
}).unknown();
// Validate environment variables
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
// Export typed configuration object
exports.config = {
    // Environment
    nodeEnv: envVars.NODE_ENV,
    port: envVars.PORT,
    isDevelopment: envVars.NODE_ENV === 'development',
    isProduction: envVars.NODE_ENV === 'production',
    isTest: envVars.NODE_ENV === 'test',
    // Database
    database: {
        url: envVars.DATABASE_URL,
        user: envVars.POSTGRES_USER,
        password: envVars.POSTGRES_PASSWORD,
        database: envVars.POSTGRES_DB,
    },
    // Redis
    redis: {
        url: envVars.REDIS_URL,
        password: envVars.REDIS_PASSWORD,
    },
    // n8n
    n8n: {
        encryptionKey: envVars.N8N_ENCRYPTION_KEY,
        jwtSecret: envVars.N8N_USER_MANAGEMENT_JWT_SECRET,
        logLevel: envVars.N8N_LOG_LEVEL,
    },
    // API Keys
    apiKeys: {
        elevenlabs: envVars.ELEVENLABS_API_KEY,
        leonardo: envVars.LEONARDO_API_KEY,
        soundstripe: envVars.SOUNDSTRIPE_API_KEY,
        runway: envVars.RUNWAY_API_KEY,
        suno: envVars.SUNO_API_KEY,
        kling: envVars.KLING_API_KEY,
    },
    // Third-Party APIs
    thirdPartyApis: {
        suno: {
            url: envVars.SUNO_API_URL,
            key: envVars.SUNO_API_KEY,
        },
        kling: {
            url: envVars.KLING_API_URL,
            key: envVars.KLING_API_KEY,
        },
    },
    // File Storage
    storage: {
        assetsPath: envVars.ASSETS_STORAGE_PATH,
        finalDraftPath: envVars.FINAL_DRAFT_IMPORT_PATH,
        mediaPath: envVars.MEDIA_EXPORT_PATH,
        premierePath: envVars.PREMIERE_PROJECTS_PATH,
    },
    // MCP Servers
    mcp: {
        finalDraftPort: envVars.MCP_FINAL_DRAFT_PORT,
        premiereProPort: envVars.MCP_PREMIERE_PRO_PORT,
        orchestrationPort: envVars.MCP_ORCHESTRATION_PORT,
    },
    // Logging
    logging: {
        level: envVars.LOG_LEVEL,
        filePath: envVars.LOG_FILE_PATH,
        enableMetrics: envVars.ENABLE_METRICS,
        sentryDsn: envVars.SENTRY_DSN,
    },
    // Cost Monitoring
    budget: {
        daily: envVars.DAILY_BUDGET_LIMIT,
        weekly: envVars.WEEKLY_BUDGET_LIMIT,
        monthly: envVars.MONTHLY_BUDGET_LIMIT,
        alertEmail: envVars.COST_ALERT_EMAIL,
    },
    // Security
    security: {
        jwtSecret: envVars.JWT_SECRET,
        corsOrigin: envVars.CORS_ORIGIN.split(','),
        rateLimit: {
            windowMs: envVars.RATE_LIMIT_WINDOW_MS,
            maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
        },
    },
    // Development
    development: {
        enableDebugLogging: envVars.ENABLE_DEBUG_LOGGING,
        mockApiResponses: envVars.MOCK_API_RESPONSES,
        skipApiRateLimits: envVars.SKIP_API_RATE_LIMITS,
    },
    // External Services
    github: {
        token: envVars.GITHUB_TOKEN,
        repo: envVars.GITHUB_REPO,
    },
    // Notifications
    notifications: {
        slackWebhookUrl: envVars.SLACK_WEBHOOK_URL,
        emailServiceApiKey: envVars.EMAIL_SERVICE_API_KEY,
    },
};
//# sourceMappingURL=environment.js.map