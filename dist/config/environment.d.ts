/**
 * Environment configuration management
 * Centralizes all environment variables and provides type-safe access
 */
export declare const config: {
    readonly nodeEnv: "development" | "test" | "production";
    readonly port: number;
    readonly isDevelopment: boolean;
    readonly isProduction: boolean;
    readonly isTest: boolean;
    readonly database: {
        readonly url: string;
        readonly user: string;
        readonly password: string;
        readonly database: string;
    };
    readonly redis: {
        readonly url: string;
        readonly password: string;
    };
    readonly n8n: {
        readonly encryptionKey: string;
        readonly jwtSecret: string;
        readonly logLevel: string;
    };
    readonly apiKeys: {
        readonly elevenlabs: string;
        readonly leonardo: string;
        readonly soundstripe: string;
        readonly runway: string;
        readonly suno: string;
        readonly kling: string;
    };
    readonly thirdPartyApis: {
        readonly suno: {
            readonly url: string;
            readonly key: string;
        };
        readonly kling: {
            readonly url: string;
            readonly key: string;
        };
    };
    readonly storage: {
        readonly assetsPath: string;
        readonly finalDraftPath: string;
        readonly mediaPath: string;
        readonly premierePath: string;
    };
    readonly mcp: {
        readonly finalDraftPort: number;
        readonly premiereProPort: number;
        readonly orchestrationPort: number;
    };
    readonly logging: {
        readonly level: string;
        readonly filePath: string;
        readonly enableMetrics: boolean;
        readonly sentryDsn: string;
    };
    readonly budget: {
        readonly daily: number;
        readonly weekly: number;
        readonly monthly: number;
        readonly alertEmail: string;
    };
    readonly security: {
        readonly jwtSecret: string;
        readonly corsOrigin: string[];
        readonly rateLimit: {
            readonly windowMs: number;
            readonly maxRequests: number;
        };
    };
    readonly development: {
        readonly enableDebugLogging: boolean;
        readonly mockApiResponses: boolean;
        readonly skipApiRateLimits: boolean;
    };
    readonly github: {
        readonly token: string;
        readonly repo: string;
    };
    readonly notifications: {
        readonly slackWebhookUrl: string;
        readonly emailServiceApiKey: string;
    };
};
//# sourceMappingURL=environment.d.ts.map