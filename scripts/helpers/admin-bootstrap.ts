import {
  CredentialType,
  StoreStatus,
  UserStatus,
  UserType,
  type PrismaClient,
} from "@/prisma-generated/client";

import { hashAdminPassword } from "../../core/auth/admin/password";
import { normalizeAdminBootstrapInput } from "../../core/auth/admin/validation";

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
];

function mapSeedStatusToUserStatus(status: SeedAdminDefinition["status"]): UserStatus {
  return status === "active" ? UserStatus.ACTIVE : UserStatus.SUSPENDED;
}

export async function ensureDefaultStore(prisma: PrismaClient) {
  const existingStore = await prisma.store.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (existingStore) {
    return existingStore;
  }

  return prisma.store.create({
    data: {
      code: "creatyss",
      name: "Creatyss",
      slug: "creatyss",
      status: StoreStatus.ACTIVE,
      legalName: "Creatyss",
      supportEmail: "admin@creatyss.local",
      defaultLocaleCode: "fr",
      defaultCurrency: "EUR",
      timezone: "Europe/Paris",
      isProduction: true,
      activatedAt: new Date(),
    },
  });
}

export async function ensureAdminRole(prisma: PrismaClient) {
  return prisma.role.upsert({
    where: {
      code: "admin",
    },
    update: {
      name: "Admin",
      isActive: true,
      archivedAt: null,
    },
    create: {
      code: "admin",
      name: "Admin",
      description: "Administrator access to the Creatyss back office.",
      isSystem: true,
      isActive: true,
    },
  });
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
  const userStatus = mapSeedStatusToUserStatus(input.status);

  const user = await prisma.user.upsert({
    where: {
      email: normalizedInput.email,
    },
    update: {
      storeId,
      displayName: normalizedInput.displayName,
      type: UserType.STORE,
      status: userStatus,
      invitedAt: now,
      activatedAt: input.status === "active" ? now : null,
      suspendedAt: input.status === "disabled" ? now : null,
      archivedAt: null,
    },
    create: {
      storeId,
      email: normalizedInput.email,
      displayName: normalizedInput.displayName,
      type: UserType.STORE,
      status: userStatus,
      invitedAt: now,
      activatedAt: input.status === "active" ? now : null,
      suspendedAt: input.status === "disabled" ? now : null,
    },
  });

  const existingCredential = await prisma.userCredential.findFirst({
    where: {
      userId: user.id,
      type: CredentialType.PASSWORD,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingCredential) {
    await prisma.userCredential.update({
      where: {
        id: existingCredential.id,
      },
      data: {
        identifier: user.email,
        secretHash: passwordHash,
        isPrimary: true,
        isActive: true,
        revokedAt: null,
        expiresAt: null,
      },
    });
  } else {
    await prisma.userCredential.create({
      data: {
        userId: user.id,
        type: CredentialType.PASSWORD,
        identifier: user.email,
        secretHash: passwordHash,
        isPrimary: true,
        isActive: true,
      },
    });
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId,
      },
    },
    update: {
      revokedAt: null,
    },
    create: {
      userId: user.id,
      roleId,
    },
  });

  return user;
}
