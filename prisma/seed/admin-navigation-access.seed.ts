import type { PrismaClient } from "@/prisma-generated/client";

import {
  adminNavigationCapabilities,
  adminNavigationFeatureFlags,
} from "@/features/admin/navigation";

const permissionCodes = [
  adminNavigationCapabilities.commerce.ordersRead,
  adminNavigationCapabilities.commerce.customersRead,
  adminNavigationCapabilities.commerce.paymentsRead,
  adminNavigationCapabilities.commerce.shippingRead,

  adminNavigationCapabilities.content.homepageRead,
  adminNavigationCapabilities.content.blogRead,
  adminNavigationCapabilities.content.seoRead,

  adminNavigationCapabilities.marketing.newsletterRead,
  adminNavigationCapabilities.marketing.discountsRead,
  adminNavigationCapabilities.marketing.automationsRead,

  adminNavigationCapabilities.insights.analyticsRead,

  adminNavigationCapabilities.settings.paymentsRead,
  adminNavigationCapabilities.settings.shippingRead,
  adminNavigationCapabilities.settings.advancedRead,

  adminNavigationCapabilities.system.logsRead,
  adminNavigationCapabilities.system.monitoringRead,
  adminNavigationCapabilities.system.observabilityRead,
] as const;

const featureFlagCodes = [
  adminNavigationFeatureFlags.commerce.payments,
  adminNavigationFeatureFlags.commerce.shipping,
  adminNavigationFeatureFlags.commerce.discounts,
  adminNavigationFeatureFlags.engagement.newsletter,
  adminNavigationFeatureFlags.engagement.analytics,
] as const;

function permissionNameFromCode(code: string): string {
  return code;
}

function featureFlagNameFromCode(code: string): string {
  return code;
}

export async function seedAdminNavigationAccess(db: PrismaClient): Promise<void> {
  for (const code of permissionCodes) {
    await db.permission.upsert({
      where: { code },
      update: {},
      create: {
        code,
        name: permissionNameFromCode(code),
        description: code,
        resource: "admin",
        action: "read",
        isSystem: true,
      },
    });
  }

  const internalSuperAdminRole = await db.role.upsert({
    where: { code: "internal_super_admin" },
    update: {
      name: "Internal Super Admin",
      description: "Full internal access for local and technical administration.",
      isSystem: true,
      isActive: true,
      archivedAt: null,
    },
    create: {
      code: "internal_super_admin",
      name: "Internal Super Admin",
      description: "Full internal access for local and technical administration.",
      isSystem: true,
      isActive: true,
    },
  });

  const permissions = await db.permission.findMany({
    where: {
      code: {
        in: [...permissionCodes],
      },
    },
    select: {
      id: true,
    },
  });

  for (const permission of permissions) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: internalSuperAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {
        revokedAt: null,
      },
      create: {
        roleId: internalSuperAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  const localAdmin = await db.user.findUnique({
    where: {
      email: "admin@creatyss.local",
    },
    select: {
      id: true,
    },
  });

  if (localAdmin) {
    await db.userRole.upsert({
      where: {
        userId_roleId: {
          userId: localAdmin.id,
          roleId: internalSuperAdminRole.id,
        },
      },
      update: {
        revokedAt: null,
      },
      create: {
        userId: localAdmin.id,
        roleId: internalSuperAdminRole.id,
      },
    });
  }

  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  for (const code of featureFlagCodes) {
    await db.featureFlag.upsert({
      where: {
        storeId_code: {
          storeId: store.id,
          code,
        },
      },
      update: {
        name: featureFlagNameFromCode(code),
        description: code,
        status: "ACTIVE",
        isEnabledByDefault: true,
        archivedAt: null,
      },
      create: {
        storeId: store.id,
        code,
        name: featureFlagNameFromCode(code),
        description: code,
        status: "ACTIVE",
        scopeType: "STORE",
        isEnabledByDefault: true,
      },
    });
  }
}
