import type { PrismaClient } from "@/prisma-generated/client";

export const ANALYTICS_FEATURE_CODE = "engagement.analytics";

export const ANALYTICS_ALLOWED_LEVELS = ["read", "insights", "recommendations"] as const;

export const ANALYTICS_DEFAULT_LEVEL: string = ANALYTICS_ALLOWED_LEVELS[0];

export async function seedAnalyticsFeatureFlag(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  await db.featureFlag.upsert({
    where: {
      storeId_code: {
        storeId: store.id,
        code: ANALYTICS_FEATURE_CODE,
      },
    },
    update: {
      status: "ACTIVE",
      isEnabledByDefault: true,
      allowedLevels: [...ANALYTICS_ALLOWED_LEVELS],
      defaultLevel: ANALYTICS_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: ANALYTICS_FEATURE_CODE,
      name: "Analytics",
      description: "Suivi des performances, des conversions et des audiences.",
      status: "ACTIVE",
      scopeType: "STORE",
      isEnabledByDefault: true,
      allowedLevels: [...ANALYTICS_ALLOWED_LEVELS],
      defaultLevel: ANALYTICS_DEFAULT_LEVEL,
    },
  });
}
