import type { PrismaClient } from "@/prisma-generated/client";

export const CHANNELS_FEATURE_CODE = "satellite.channels";

export async function seedChannelsFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: CHANNELS_FEATURE_CODE,
      },
    },
    update: {
      name: "Canaux de diffusion",
      description: "Projection interne du catalogue vers des canaux de vente ou de diffusion.",
    },
    create: {
      storeId: store.id,
      code: CHANNELS_FEATURE_CODE,
      name: "Canaux de diffusion",
      description: "Projection interne du catalogue vers des canaux de vente ou de diffusion.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
    },
  });
}
