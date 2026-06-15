import type { PrismaClient } from "@/prisma-generated/client";

export const DISCOUNTS_FEATURE_CODE = "commerce.discounts";

export const DISCOUNTS_ALLOWED_LEVELS = ["simple", "rules", "automation"] as const;

export const DISCOUNTS_DEFAULT_LEVEL: string = DISCOUNTS_ALLOWED_LEVELS[0];

export async function seedDiscountsFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: DISCOUNTS_FEATURE_CODE,
      },
    },
    update: {
      allowedLevels: [...DISCOUNTS_ALLOWED_LEVELS],
      defaultLevel: DISCOUNTS_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: DISCOUNTS_FEATURE_CODE,
      name: "Remises",
      description: "Gestion des codes promo, règles de remise et promotions.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...DISCOUNTS_ALLOWED_LEVELS],
      defaultLevel: DISCOUNTS_DEFAULT_LEVEL,
    },
  });
}
