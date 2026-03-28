import { CredentialType, SessionStatus, UserStatus, type Prisma } from "@prisma-generated/client";

import { db } from "@core/db";

import type { AuthenticatedAdmin } from "./types";

const ADMIN_ROLE_CODE = "admin";

type AdminUserRecord = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      where: {
        revokedAt: null;
      };
      include: {
        role: true;
      };
    };
  };
}>;

type PasswordCredentialRecord = Prisma.UserCredentialGetPayload<{
  select: {
    id: true;
    userId: true;
    secretHash: true;
    isActive: true;
    expiresAt: true;
    revokedAt: true;
  };
}>;

type AdminSessionRecord = Prisma.UserSessionGetPayload<{
  select: {
    id: true;
    userId: true;
    tokenHash: true;
    status: true;
    expiresAt: true;
    issuedAt: true;
    lastSeenAt: true;
    revokedAt: true;
    ipAddress: true;
    userAgent: true;
  };
}>;

function hasActiveAdminRole(user: AdminUserRecord): boolean {
  return user.userRoles.some((userRole) => {
    return (
      userRole.revokedAt === null &&
      userRole.role.isActive &&
      userRole.role.code === ADMIN_ROLE_CODE
    );
  });
}

function mapUserToAuthenticatedAdmin(user: AdminUserRecord): AuthenticatedAdmin {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    isActive: user.status === UserStatus.ACTIVE,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

async function findAdminUserRecordByEmail(email: string): Promise<AdminUserRecord | null> {
  return db.user.findUnique({
    where: {
      email,
    },
    include: {
      userRoles: {
        where: {
          revokedAt: null,
        },
        include: {
          role: true,
        },
      },
    },
  });
}

async function findAdminUserRecordById(userId: string): Promise<AdminUserRecord | null> {
  return db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      userRoles: {
        where: {
          revokedAt: null,
        },
        include: {
          role: true,
        },
      },
    },
  });
}

export async function findAdminUserByEmail(email: string): Promise<AuthenticatedAdmin | null> {
  const user = await findAdminUserRecordByEmail(email);

  if (!user) {
    return null;
  }

  if (!hasActiveAdminRole(user)) {
    return null;
  }

  return mapUserToAuthenticatedAdmin(user);
}

export async function findAdminUserById(userId: string): Promise<AuthenticatedAdmin | null> {
  const user = await findAdminUserRecordById(userId);

  if (!user) {
    return null;
  }

  if (!hasActiveAdminRole(user)) {
    return null;
  }

  return mapUserToAuthenticatedAdmin(user);
}

export async function findActivePasswordCredentialByUserId(
  userId: string
): Promise<PasswordCredentialRecord | null> {
  const now = new Date();

  const credential = await db.userCredential.findFirst({
    where: {
      userId,
      type: CredentialType.PASSWORD,
      isActive: true,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    select: {
      id: true,
      userId: true,
      secretHash: true,
      isActive: true,
      expiresAt: true,
      revokedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!credential?.secretHash) {
    return null;
  }

  return credential;
}

export async function findAdminSessionByTokenHash(
  tokenHash: string
): Promise<AdminSessionRecord | null> {
  return db.userSession.findUnique({
    where: {
      tokenHash,
    },
    select: {
      id: true,
      userId: true,
      tokenHash: true,
      status: true,
      expiresAt: true,
      issuedAt: true,
      lastSeenAt: true,
      revokedAt: true,
      ipAddress: true,
      userAgent: true,
    },
  });
}

export async function createAdminSession(input: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<AdminSessionRecord> {
  return db.userSession.create({
    data: {
      userId: input.userId,
      tokenHash: input.tokenHash,
      status: SessionStatus.ACTIVE,
      expiresAt: input.expiresAt,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
    select: {
      id: true,
      userId: true,
      tokenHash: true,
      status: true,
      expiresAt: true,
      issuedAt: true,
      lastSeenAt: true,
      revokedAt: true,
      ipAddress: true,
      userAgent: true,
    },
  });
}

export async function revokeAdminSessionByTokenHash(tokenHash: string): Promise<void> {
  await db.userSession.updateMany({
    where: {
      tokenHash,
      status: SessionStatus.ACTIVE,
    },
    data: {
      status: SessionStatus.REVOKED,
      revokedAt: new Date(),
    },
  });
}

export async function touchAdminSessionLastSeen(sessionId: string): Promise<void> {
  await db.userSession.update({
    where: {
      id: sessionId,
    },
    data: {
      lastSeenAt: new Date(),
    },
  });
}

export async function updateAdminLastLogin(userId: string): Promise<void> {
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });
}

export async function markAdminSessionExpired(sessionId: string): Promise<void> {
  await db.userSession.update({
    where: {
      id: sessionId,
    },
    data: {
      status: SessionStatus.EXPIRED,
    },
  });
}
