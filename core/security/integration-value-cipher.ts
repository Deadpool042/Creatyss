import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

import { serverEnv } from "@/core/config/env/server";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export const CURRENT_ENCRYPTION_VERSION = 1;

function resolveEncryptionKey(): Buffer {
  const rawKey = serverEnv.integrationCredentialEncryptionKey;

  if (!rawKey) {
    throw new Error(
      "[integration-value-cipher] INTEGRATION_CREDENTIAL_ENCRYPTION_KEY n'est pas configurée."
    );
  }

  const key = Buffer.from(rawKey, "hex");

  if (key.length !== KEY_LENGTH) {
    throw new Error(
      `[integration-value-cipher] INTEGRATION_CREDENTIAL_ENCRYPTION_KEY doit encoder ${KEY_LENGTH} octets en hexadécimal (64 caractères).`
    );
  }

  return key;
}

export function encryptCredentialValue(plaintext: string): {
  encryptedValue: string;
  encryptionVersion: number;
} {
  const key = resolveEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const payload = Buffer.concat([iv, authTag, ciphertext]).toString("base64url");

  return {
    encryptedValue: `v${CURRENT_ENCRYPTION_VERSION}.${payload}`,
    encryptionVersion: CURRENT_ENCRYPTION_VERSION,
  };
}

export class CredentialDecryptionError extends Error {
  constructor(
    message: string,
    readonly reason: "unsupported_version" | "authentication_failed"
  ) {
    super(message);
    this.name = "CredentialDecryptionError";
  }
}

export function decryptCredentialValue(encryptedValue: string, encryptionVersion: number): string {
  if (encryptionVersion !== CURRENT_ENCRYPTION_VERSION) {
    throw new CredentialDecryptionError(
      `[integration-value-cipher] encryptionVersion ${encryptionVersion} n'est pas supportée.`,
      "unsupported_version"
    );
  }

  const separatorIndex = encryptedValue.indexOf(".");
  const versionPrefix = separatorIndex === -1 ? "" : encryptedValue.slice(0, separatorIndex);

  if (versionPrefix !== `v${CURRENT_ENCRYPTION_VERSION}`) {
    throw new CredentialDecryptionError(
      "[integration-value-cipher] Préfixe de version du payload incohérent avec encryptionVersion.",
      "unsupported_version"
    );
  }

  const body = Buffer.from(encryptedValue.slice(separatorIndex + 1), "base64url");
  const iv = body.subarray(0, IV_LENGTH);
  const authTag = body.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = body.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const key = resolveEncryptionKey();
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  try {
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    throw new CredentialDecryptionError(
      "[integration-value-cipher] Échec d'authentification GCM : donnée corrompue ou clé invalide.",
      "authentication_failed"
    );
  }
}
