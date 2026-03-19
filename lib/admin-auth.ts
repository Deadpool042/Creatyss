import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const ADMIN_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ADMIN_PASSWORD_MIN_LENGTH = 12;
const ADMIN_SESSION_VERSION = 1;
const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_SALT_BYTES = 16;
const SCRYPT_PREFIX = "scrypt";
const SCRYPT_VERSION = "1";

type SessionVerificationResult =
  | {
      status: "valid";
      payload: AdminSessionPayload;
    }
  | {
      status: "malformed" | "invalid" | "expired";
    };

export const ADMIN_SESSION_COOKIE_NAME = "creatyss_admin_session";
export const adminSessionCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
export const ADMIN_SESSION_DURATION_SECONDS = ADMIN_SESSION_MAX_AGE_SECONDS;

export type AdminSessionPayload = {
  adminId: string;
  exp: number;
  v: 1;
};

export type NormalizedAdminCredentials = {
  email: string;
  password: string;
};

export type NormalizedAdminBootstrapInput = {
  email: string;
  displayName: string;
  password: string;
};

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CurrentAdminResult =
  | {
      status: "authenticated";
      admin: AuthenticatedAdmin;
    }
  | {
      status: "missing" | "invalid" | "expired" | "inactive";
    };

function normalizeTextInput(value: string): string {
  return value.trim();
}

function isValidEmail(email: string): boolean {
  return ADMIN_EMAIL_PATTERN.test(email);
}

function isExactAdminSessionPayload(value: unknown): value is AdminSessionPayload {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value).sort();

  if (keys.length !== 3 || keys.join(",") !== "adminId,exp,v") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.adminId === "string" &&
    payload.adminId.trim().length > 0 &&
    typeof payload.exp === "number" &&
    Number.isFinite(payload.exp) &&
    payload.v === ADMIN_SESSION_VERSION
  );
}

function signAdminSessionPayload(payloadEncoded: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadEncoded, "utf8").digest("base64url");
}

function verifyAdminSessionValue(sessionValue: string, secret: string): SessionVerificationResult {
  const segments = sessionValue.split(".");

  if (segments.length !== 2) {
    return { status: "malformed" };
  }

  const [payloadEncoded, signatureEncoded] = segments;

  if (!payloadEncoded || !signatureEncoded) {
    return { status: "malformed" };
  }

  const expectedSignature = Buffer.from(signAdminSessionPayload(payloadEncoded, secret), "utf8");
  const actualSignature = Buffer.from(signatureEncoded, "utf8");

  if (actualSignature.length !== expectedSignature.length) {
    return { status: "invalid" };
  }

  if (!timingSafeEqual(actualSignature, expectedSignature)) {
    return { status: "invalid" };
  }

  let payloadJson: string;

  try {
    payloadJson = Buffer.from(payloadEncoded, "base64url").toString("utf8");
  } catch {
    return { status: "malformed" };
  }

  let payloadValue: unknown;

  try {
    payloadValue = JSON.parse(payloadJson);
  } catch {
    return { status: "invalid" };
  }

  if (!isExactAdminSessionPayload(payloadValue)) {
    return { status: "invalid" };
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  if (payloadValue.exp <= nowInSeconds) {
    return { status: "expired" };
  }

  return {
    status: "valid",
    payload: payloadValue,
  };
}

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
    hashEncoded,
    saltEncoded,
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

async function getAdminSessionSecret(): Promise<string> {
  const { env } = await import("./env");

  return env.adminSessionSecret;
}

export function normalizeAdminEmail(email: string): string {
  return normalizeTextInput(email).toLowerCase();
}

export function normalizeAdminLoginCredentials(input: {
  email: FormDataEntryValue | string | null | undefined;
  password: FormDataEntryValue | string | null | undefined;
}): NormalizedAdminCredentials | null {
  if (typeof input.email !== "string" || typeof input.password !== "string") {
    return null;
  }

  const email = normalizeAdminEmail(input.email);
  const password = input.password;

  if (!isValidEmail(email) || password.length === 0) {
    return null;
  }

  return {
    email,
    password,
  };
}

export function normalizeAdminBootstrapInput(input: {
  email: string;
  displayName: string;
  password: string;
}): NormalizedAdminBootstrapInput | null {
  const email = normalizeAdminEmail(input.email);
  const displayName = normalizeTextInput(input.displayName);
  const password = input.password;

  if (
    !isValidEmail(email) ||
    displayName.length === 0 ||
    password.length < ADMIN_PASSWORD_MIN_LENGTH
  ) {
    return null;
  }

  return {
    email,
    displayName,
    password,
  };
}

export async function hashAdminPassword(password: string): Promise<string> {
  if (password.length === 0) {
    throw new Error("Password must not be empty.");
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

export async function createAdminSessionValue(adminId: string): Promise<string> {
  const payload: AdminSessionPayload = {
    adminId,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS,
    v: ADMIN_SESSION_VERSION,
  };
  const payloadEncoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const secret = await getAdminSessionSecret();
  const signatureEncoded = signAdminSessionPayload(payloadEncoded, secret);

  return `${payloadEncoded}.${signatureEncoded}`;
}

export async function getCurrentAdmin(): Promise<CurrentAdminResult> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionValue) {
    return { status: "missing" };
  }

  const secret = await getAdminSessionSecret();
  const session = verifyAdminSessionValue(sessionValue, secret);

  if (session.status === "expired") {
    return { status: "expired" };
  }

  if (session.status !== "valid") {
    return { status: "invalid" };
  }

  const { findAdminUserById } = await import("../db/admin-users");
  const admin = await findAdminUserById(session.payload.adminId);

  if (admin === null) {
    return { status: "invalid" };
  }

  if (!admin.isActive) {
    return { status: "inactive" };
  }

  return {
    status: "authenticated",
    admin,
  };
}

export async function requireAuthenticatedAdmin(): Promise<AuthenticatedAdmin> {
  const currentAdmin = await getCurrentAdmin();

  if (currentAdmin.status === "authenticated") {
    return currentAdmin.admin;
  }

  const { redirect } = await import("next/navigation");

  if (currentAdmin.status === "missing") {
    redirect("/admin/login");
  }

  redirect("/admin/session-invalid");
  throw new Error("Unreachable admin redirect.");
}
