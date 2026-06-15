import type { PrismaClient } from "@/prisma-generated/client";

export const NOTIFICATIONS_FEATURE_CODE = "platform.notifications";

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
    },
    create: {
      storeId: store.id,
      code: NOTIFICATIONS_FEATURE_CODE,
      name: "Notifications gouvernees",
      description: "Referentiel interne des notifications operationnelles et transactionnelles.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
    },
  });
}
