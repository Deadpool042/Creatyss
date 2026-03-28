import { SessionStatus } from "@prisma-generated/client";
import { redirect } from "next/navigation";

import { verifyAdminPassword } from "./password";
import {
  createAdminSession,
  findActivePasswordCredentialByUserId,
  findAdminSessionByTokenHash,
  findAdminUserByEmail,
  findAdminUserById,
  markAdminSessionExpired,
  revokeAdminSessionByTokenHash,
  touchAdminSessionLastSeen,
  updateAdminLastLogin,
} from "./repository";
import {
  ADMIN_SESSION_DURATION_SECONDS,
  clearAdminSessionToken,
  createAdminSessionToken,
  hashAdminSessionToken,
  readAdminSessionToken,
  setAdminSessionToken,
} from "./session";
import type { AuthenticatedAdmin, CurrentAdminResult } from "./types";
import { normalizeAdminLoginCredentials } from "./validation";

export async function loginAdmin(input: {
  email: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<AuthenticatedAdmin | null> {
  const normalized = normalizeAdminLoginCredentials({
    email: input.email,
    password: input.password,
  });

  if (!normalized) {
    return null;
  }

  const admin = await findAdminUserByEmail(normalized.email);

  if (!admin || !admin.isActive) {
    return null;
  }

  const credential = await findActivePasswordCredentialByUserId(admin.id);

  if (!credential?.secretHash) {
    return null;
  }

  const isPasswordValid = await verifyAdminPassword(normalized.password, credential.secretHash);

  if (!isPasswordValid) {
    return null;
  }

  const sessionToken = createAdminSessionToken();
  const tokenHash = hashAdminSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000);

  await createAdminSession({
    userId: admin.id,
    tokenHash,
    expiresAt,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  });

  await updateAdminLastLogin(admin.id);
  await setAdminSessionToken(sessionToken);

  return admin;
}

export async function logoutAdmin(): Promise<void> {
  const sessionToken = await readAdminSessionToken();

  if (sessionToken) {
    const tokenHash = hashAdminSessionToken(sessionToken);
    await revokeAdminSessionByTokenHash(tokenHash);
  }

  await clearAdminSessionToken();
}

export async function getCurrentAdmin(): Promise<CurrentAdminResult> {
  const sessionToken = await readAdminSessionToken();

  if (!sessionToken) {
    return { status: "missing" };
  }

  const tokenHash = hashAdminSessionToken(sessionToken);
  const session = await findAdminSessionByTokenHash(tokenHash);

  if (!session) {
    await clearAdminSessionToken();
    return { status: "invalid" };
  }

  if (session.status !== SessionStatus.ACTIVE) {
    await clearAdminSessionToken();

    return {
      status: session.status === SessionStatus.EXPIRED ? "expired" : "invalid",
    };
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await markAdminSessionExpired(session.id);
    await clearAdminSessionToken();

    return { status: "expired" };
  }

  const admin = await findAdminUserById(session.userId);

  if (!admin) {
    await clearAdminSessionToken();
    return { status: "invalid" };
  }

  if (!admin.isActive) {
    await clearAdminSessionToken();
    return { status: "inactive" };
  }

  await touchAdminSessionLastSeen(session.id);

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

  if (currentAdmin.status === "missing") {
    redirect("/admin/login");
  }

  redirect("/admin/session-invalid");
}
