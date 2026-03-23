import { AuthIdentityStatus, UserStatus, type PrismaClient } from "@prisma/client";
import { hashAdminPassword, normalizeAdminBootstrapInput } from "../../lib/admin-auth.ts";

export type SeedAdminDefinition = {
  email: string;
  displayName: string;
  password: string;
  status: "active" | "disabled";
};

export const DEV_ADMINS: readonly SeedAdminDefinition[] = [
  {
    email: "admin@creatyss.local",
    displayName: "Admin Creatyss",
    password: "AdminDev123!",
    status: "active",
  },
  {
    email: "inactive-admin@creatyss.local",
    displayName: "Admin Creatyss Inactive",
    password: "AdminDev123!",
    status: "disabled",
  },
];

function mapSeedStatusToUserStatus(status: SeedAdminDefinition["status"]): UserStatus {
  return status === "active" ? UserStatus.ACTIVE : UserStatus.DISABLED;
}

function mapSeedStatusToAuthStatus(status: SeedAdminDefinition["status"]): AuthIdentityStatus {
  return status === "active" ? AuthIdentityStatus.ACTIVE : AuthIdentityStatus.DISABLED;
}

export async function upsertAdminUser(
  prisma: PrismaClient,
  input: SeedAdminDefinition,
  storeId: string,
  roleId: string
) {
  const normalizedInput = normalizeAdminBootstrapInput({
    email: input.email,
    displayName: input.displayName,
    password: input.password,
  });

  if (normalizedInput === null) {
    throw new Error(`Invalid admin bootstrap input for email: ${input.email}`);
  }

  const now = new Date();
  const passwordHash = await hashAdminPassword(normalizedInput.password);

  const user = await prisma.user.upsert({
    where: {
      email: normalizedInput.email,
    },
    update: {
      storeId,
      displayName: normalizedInput.displayName,
      status: mapSeedStatusToUserStatus(input.status),
      activatedAt: input.status === "active" ? now : null,
      disabledAt: input.status === "disabled" ? now : null,
    },
    create: {
      storeId,
      email: normalizedInput.email,
      displayName: normalizedInput.displayName,
      status: mapSeedStatusToUserStatus(input.status),
      activatedAt: input.status === "active" ? now : null,
      disabledAt: input.status === "disabled" ? now : null,
    },
  });

  const identity = await prisma.authIdentity.upsert({
    where: {
      userId: user.id,
    },
    update: {
      status: mapSeedStatusToAuthStatus(input.status),
      mustChangePassword: false,
      mfaEnabled: false,
      passwordChangedAt: now,
      resetRequiredAt: null,
      lockedAt: null,
      failedLoginCount: 0,
    },
    create: {
      userId: user.id,
      status: mapSeedStatusToAuthStatus(input.status),
      mustChangePassword: false,
      mfaEnabled: false,
      passwordChangedAt: now,
    },
  });

  await prisma.authPasswordCredential.upsert({
    where: {
      identityId: identity.id,
    },
    update: {
      passwordHash,
      passwordVersion: 1,
    },
    create: {
      identityId: identity.id,
      passwordHash,
      passwordVersion: 1,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId,
    },
  });

  return user;
}

export async function seedDevAdminUsers(prisma: PrismaClient, storeId: string, roleId: string) {
  for (const admin of DEV_ADMINS) {
    const user = await upsertAdminUser(prisma, admin, storeId, roleId);
    process.stdout.write(`Admin user ready for ${user.email}.\n`);
  }
}
