import type { PrismaClient } from "@/prisma-generated/client";

export const NOTIFICATIONS_FEATURE_CODE = "platform.notifications";

export const NOTIFICATIONS_ALLOWED_LEVELS = ["basic"] as const;

export const NOTIFICATIONS_DEFAULT_LEVEL: string = NOTIFICATIONS_ALLOWED_LEVELS[0];

export async function seedNotificationsFeatureFlag(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  await db.featureFlag.upsert({
    where: { storeId_code: { storeId: store.id, code: NOTIFICATIONS_FEATURE_CODE } },
    update: {
      name: "Notifications gouvernees",
      description: "Referentiel interne des notifications operationnelles et transactionnelles.",
      allowedLevels: [...NOTIFICATIONS_ALLOWED_LEVELS],
      defaultLevel: NOTIFICATIONS_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: NOTIFICATIONS_FEATURE_CODE,
      name: "Notifications gouvernees",
      description: "Referentiel interne des notifications operationnelles et transactionnelles.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...NOTIFICATIONS_ALLOWED_LEVELS],
      defaultLevel: NOTIFICATIONS_DEFAULT_LEVEL,
    },
  });
}
