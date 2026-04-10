import type { PrismaClient } from "@/prisma-generated/client";

import type { AdminNavigationContext } from "../types";

type AuthenticatedAdminLike = {
  id: string;
  email: string;
};

type GetAdminNavigationContextParams = {
  db: PrismaClient;
  admin: AuthenticatedAdminLike;
};

function isFeatureFlagEnabled(params: { status: string; isEnabledByDefault: boolean }): boolean {
  return params.status === "ACTIVE" && params.isEnabledByDefault;
}

export async function getAdminNavigationContext({
  db,
  admin,
}: GetAdminNavigationContextParams): Promise<AdminNavigationContext> {
  const [userWithRoles, featureFlagRows] = await Promise.all([
    db.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        email: true,
        userRoles: {
          where: {
            revokedAt: null,
            role: {
              isActive: true,
              archivedAt: null,
            },
          },
          select: {
            role: {
              select: {
                code: true,
                rolePermissions: {
                  where: {
                    revokedAt: null,
                  },
                  select: {
                    permission: {
                      select: {
                        code: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    db.featureFlag.findMany({
      where: {
        status: "ACTIVE",
        archivedAt: null,
      },
      select: {
        code: true,
        status: true,
        isEnabledByDefault: true,
      },
    }),
  ]);

  const capabilities = new Set<string>();

  for (const userRole of userWithRoles?.userRoles ?? []) {
    for (const rolePermission of userRole.role.rolePermissions) {
      capabilities.add(rolePermission.permission.code);
    }
  }

  const featureFlags = new Set<string>();

  for (const featureFlag of featureFlagRows) {
    if (
      isFeatureFlagEnabled({
        status: featureFlag.status,
        isEnabledByDefault: featureFlag.isEnabledByDefault,
      })
    ) {
      featureFlags.add(featureFlag.code);
    }
  }

  const isInternalUser =
    admin.email === "admin@creatyss.local" ||
    (userWithRoles?.userRoles ?? []).some(
      (userRole) => userRole.role.code === "internal_super_admin"
    );

  return {
    capabilities,
    featureFlags,
    isInternalUser,
  };
}
