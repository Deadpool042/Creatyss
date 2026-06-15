import type { PrismaClient } from "@/prisma-generated/client";

export const WEBHOOKS_FEATURE_CODE = "platform.webhooks";

export async function seedWebhooksFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: WEBHOOKS_FEATURE_CODE,
      },
    },
    update: {
      name: "Webhooks",
      description: "Referentiel actuel des endpoints webhook et de leurs deliveries.",
    },
    create: {
      storeId: store.id,
      code: WEBHOOKS_FEATURE_CODE,
      name: "Webhooks",
      description: "Referentiel actuel des endpoints webhook et de leurs deliveries.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
    },
  });
}
