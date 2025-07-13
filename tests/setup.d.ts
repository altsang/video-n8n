/**
 * Test setup configuration
 * Global setup for Jest tests
 */
declare global {
    namespace NodeJS {
        interface Global {
            testConfig: {
                mockApiResponses: boolean;
                skipExternalCalls: boolean;
            };
        }
    }
}
export {};
//# sourceMappingURL=setup.d.ts.map