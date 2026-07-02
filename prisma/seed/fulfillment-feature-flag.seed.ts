import type { PrismaClient } from "@/prisma-generated/client";

export const FULFILLMENT_FEATURE_CODE = "commerce.fulfillment";

export const FULFILLMENT_ALLOWED_LEVELS = ["manual", "partial"] as const;

export const FULFILLMENT_DEFAULT_LEVEL: string = FULFILLMENT_ALLOWED_LEVELS[0];

export async function seedFulfillmentFeatureFlag(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  await db.featureFlag.upsert({
    where: { storeId_code: { storeId: store.id, code: FULFILLMENT_FEATURE_CODE } },
    update: {
      name: "Préparation logistique",
      description: "Suivi de la préparation des commandes (pick/pack).",
      allowedLevels: [...FULFILLMENT_ALLOWED_LEVELS],
      defaultLevel: FULFILLMENT_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: FULFILLMENT_FEATURE_CODE,
      name: "Préparation logistique",
      description: "Suivi de la préparation des commandes (pick/pack).",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...FULFILLMENT_ALLOWED_LEVELS],
      defaultLevel: FULFILLMENT_DEFAULT_LEVEL,
    },
  });
}
