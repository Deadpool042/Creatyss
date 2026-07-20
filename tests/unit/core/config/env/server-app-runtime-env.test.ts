import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Isole la validation de APP_RUNTIME_ENV dans serverEnvSchema
 * (core/config/env/server.ts). Le module a des effets de bord au chargement
 * (throw si l'environnement est invalide) : chaque cas ré-importe le module
 * via vi.resetModules() + import() dynamique, avec un environnement de base
 * valide constant, pour ne faire varier que APP_RUNTIME_ENV.
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

async function importServerEnv() {
  vi.resetModules();
  return import("@/core/config/env/server");
}

describe("serverEnvSchema — APP_RUNTIME_ENV", () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ...REQUIRED_BASE_ENV };
    delete process.env.SKIP_ENV_VALIDATION;
    delete process.env.APP_RUNTIME_ENV;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("échoue si APP_RUNTIME_ENV est absente", async () => {
    await expect(importServerEnv()).rejects.toThrow(/APP_RUNTIME_ENV/);
  });

  it("échoue si APP_RUNTIME_ENV a une valeur invalide", async () => {
    process.env.APP_RUNTIME_ENV = "prod";

    await expect(importServerEnv()).rejects.toThrow(/APP_RUNTIME_ENV/);
  });

  it.each(["local", "staging", "production"] as const)(
    "accepte APP_RUNTIME_ENV=%s et l'expose via serverEnv.appRuntimeEnv",
    async (value) => {
      process.env.APP_RUNTIME_ENV = value;

      const { serverEnv } = await importServerEnv();

      expect(serverEnv.appRuntimeEnv).toBe(value);
    }
  );

  it("n'accepte jamais une résolution implicite : aucune valeur par défaut n'existe", async () => {
    // Absence explicite déjà couverte ci-dessus ; ce test documente
    // l'invariant du cadrage : pas de .default(...) sur le schéma.
    await expect(importServerEnv()).rejects.toThrow(/Invalid server environment variables/);
  });
});
