import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * server.ts non mocké — même pattern que
 * tests/unit/core/runtime/resolve-store-execution-policy.test.ts.
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
  INTEGRATION_CREDENTIAL_ENCRYPTION_KEY:
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".slice(0, 64),
};

const originalEnv = { ...process.env };

async function importCipher() {
  vi.resetModules();
  return import("@/core/security/integration-value-cipher");
}

describe("integration-value-cipher", () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ...REQUIRED_BASE_ENV };
    delete process.env.SKIP_ENV_VALIDATION;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("fait un aller-retour encrypt puis decrypt", async () => {
    const { encryptCredentialValue, decryptCredentialValue } = await importCipher();

    const { encryptedValue, encryptionVersion } = encryptCredentialValue("sk_live_abc123");

    expect(decryptCredentialValue(encryptedValue, encryptionVersion)).toBe("sk_live_abc123");
  });

  it("produit un payload préfixé par la version courante", async () => {
    const { encryptCredentialValue, CURRENT_ENCRYPTION_VERSION } = await importCipher();

    const { encryptedValue, encryptionVersion } = encryptCredentialValue("secret");

    expect(encryptionVersion).toBe(CURRENT_ENCRYPTION_VERSION);
    expect(encryptedValue.startsWith(`v${CURRENT_ENCRYPTION_VERSION}.`)).toBe(true);
  });

  it("génère un iv différent à chaque appel (payloads non déterministes)", async () => {
    const { encryptCredentialValue } = await importCipher();

    const first = encryptCredentialValue("same-plaintext");
    const second = encryptCredentialValue("same-plaintext");

    expect(first.encryptedValue).not.toBe(second.encryptedValue);
  });

  it("rejette une encryptionVersion inconnue", async () => {
    const { encryptCredentialValue, decryptCredentialValue, CredentialDecryptionError } =
      await importCipher();

    const { encryptedValue } = encryptCredentialValue("secret");

    expect(() => decryptCredentialValue(encryptedValue, 99)).toThrow(CredentialDecryptionError);
  });

  it("rejette un payload dont le préfixe de version est incohérent", async () => {
    const { encryptCredentialValue, decryptCredentialValue, CredentialDecryptionError } =
      await importCipher();

    const { encryptedValue, encryptionVersion } = encryptCredentialValue("secret");
    const tampered = encryptedValue.replace(/^v1\./, "v2.");

    expect(() => decryptCredentialValue(tampered, encryptionVersion)).toThrow(
      CredentialDecryptionError
    );
  });

  it("rejette un ciphertext corrompu (échec d'authentification GCM)", async () => {
    const { encryptCredentialValue, decryptCredentialValue, CredentialDecryptionError } =
      await importCipher();

    const { encryptedValue, encryptionVersion } = encryptCredentialValue("secret");
    const corrupted = `${encryptedValue}AA`;

    expect(() => decryptCredentialValue(corrupted, encryptionVersion)).toThrow(
      CredentialDecryptionError
    );
  });

  it("échoue explicitement si la clé de chiffrement n'est pas configurée", async () => {
    delete process.env.INTEGRATION_CREDENTIAL_ENCRYPTION_KEY;
    const { encryptCredentialValue } = await importCipher();

    expect(() => encryptCredentialValue("secret")).toThrow(
      "INTEGRATION_CREDENTIAL_ENCRYPTION_KEY n'est pas configurée"
    );
  });
});
