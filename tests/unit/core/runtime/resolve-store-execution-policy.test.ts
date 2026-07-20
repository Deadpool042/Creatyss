import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Teste le point de composition serverEnv.appRuntimeEnv + Store.isProduction
 * en conditions réelles (server.ts non mocké) — même pattern que
 * tests/unit/core/config/env/server-app-runtime-env.test.ts.
 */

const REQUIRED_BASE_ENV: Record<string, string> = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
  ADMIN_SESSION_SECRET: "admin-session-secret-test",
  CART_SESSION_SECRET: "cart-session-secret-test",
  FAVORITES_SESSION_SECRET: "favorites-session-secret-test",
  EMAIL_FROM_ADDRESS: "no-reply@test.local",
  EMAIL_FROM_NAME: "Test",
  BREVO_API_KEY: "xkeysib-test",
  BREVO_FROM_ADDRESS: "no-reply@test.local",
  BREVO_FROM_NAME: "Test",
};

const originalEnv = { ...process.env };

async function importResolveStoreExecutionPolicy(appRuntimeEnv: string) {
  vi.resetModules();
  process.env.APP_RUNTIME_ENV = appRuntimeEnv;
  return import("@/core/runtime/resolve-store-execution-policy");
}

describe("resolveStoreExecutionPolicy", () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ...REQUIRED_BASE_ENV };
    delete process.env.SKIP_ENV_VALIDATION;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("résout LIVE uniquement pour environment=production et isProduction=true", async () => {
    const { resolveStoreExecutionPolicy } = await importResolveStoreExecutionPolicy("production");

    expect(resolveStoreExecutionPolicy({ isProduction: true })).toEqual({
      mode: "LIVE",
      environment: "production",
      storeMode: "production",
      reason: "environment=production, storeMode=production",
    });
  });

  it.each(
    (["local", "staging", "production"] as const)
      .flatMap((environment) =>
        [false, true].map((isProduction) => ({ environment, isProduction }))
      )
      .filter(({ environment, isProduction }) => !(environment === "production" && isProduction))
  )(
    "résout TEST pour environment=$environment, isProduction=$isProduction",
    async ({ environment, isProduction }) => {
      const { resolveStoreExecutionPolicy } = await importResolveStoreExecutionPolicy(environment);
      const policy = resolveStoreExecutionPolicy({ isProduction });

      expect(policy.mode).toBe("TEST");
      expect(policy.environment).toBe(environment);
      expect(policy.storeMode).toBe(isProduction ? "production" : "development");
    }
  );
});
