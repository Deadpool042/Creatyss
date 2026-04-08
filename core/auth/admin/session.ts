import { createHash, randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { serverEnv } from "@/core/config/env/server";

const ADMIN_SESSION_COOKIE_NAME = "creatyss_admin_session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export const ADMIN_SESSION_DURATION_SECONDS = ADMIN_SESSION_MAX_AGE_SECONDS;

export const adminSessionCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: serverEnv.nodeEnv === "production",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
};

export function createAdminSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashAdminSessionToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("base64url");
}

export async function readAdminSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionToken || sessionToken.trim().length === 0) {
    return null;
  }

  return sessionToken;
}

export async function setAdminSessionToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, adminSessionCookieOptions);
}

export async function clearAdminSessionToken(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...adminSessionCookieOptions,
    maxAge: 0,
  });
}
