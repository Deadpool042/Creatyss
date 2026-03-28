import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const ADMIN_PASSWORD_MIN_LENGTH = 12;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_SALT_BYTES = 16;
const SCRYPT_PREFIX = "scrypt";
const SCRYPT_VERSION = "1";

function parseStoredPasswordHash(value: string) {
  const parts = value.split(":");

  if (parts.length !== 4) {
    return null;
  }

  const [algorithm, version, saltEncoded, hashEncoded] = parts;

  if (algorithm !== SCRYPT_PREFIX || version !== SCRYPT_VERSION || !saltEncoded || !hashEncoded) {
    return null;
  }

  return {
    saltEncoded,
    hashEncoded,
  };
}

function deriveScryptKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(Buffer.from(derivedKey));
    });
  });
}

export function isValidAdminPassword(password: string): boolean {
  return password.length >= ADMIN_PASSWORD_MIN_LENGTH;
}

export async function hashAdminPassword(password: string): Promise<string> {
  if (!isValidAdminPassword(password)) {
    throw new Error(`Password must be at least ${ADMIN_PASSWORD_MIN_LENGTH} characters long.`);
  }

  const saltEncoded = randomBytes(SCRYPT_SALT_BYTES).toString("base64url");
  const derivedKey = await deriveScryptKey(password, saltEncoded);
  const hashEncoded = derivedKey.toString("base64url");

  return `${SCRYPT_PREFIX}:${SCRYPT_VERSION}:${saltEncoded}:${hashEncoded}`;
}

export async function verifyAdminPassword(
  password: string,
  storedPasswordHash: string
): Promise<boolean> {
  if (password.length === 0) {
    return false;
  }

  const parsedHash = parseStoredPasswordHash(storedPasswordHash);

  if (parsedHash === null) {
    return false;
  }

  const actualHash = Buffer.from(parsedHash.hashEncoded, "utf8");
  const expectedHash = Buffer.from(
    (await deriveScryptKey(password, parsedHash.saltEncoded)).toString("base64url"),
    "utf8"
  );

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedHash);
}
