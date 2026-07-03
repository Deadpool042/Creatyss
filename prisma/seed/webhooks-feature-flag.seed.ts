import type { PrismaClient } from "@/prisma-generated/client";

export const WEBHOOKS_FEATURE_CODE = "platform.webhooks";
const WEBHOOKS_ALLOWED_LEVELS = ["read", "manage", "retry"] as const;
const WEBHOOKS_DEFAULT_LEVEL = "retry";

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
      allowedLevels: [...WEBHOOKS_ALLOWED_LEVELS],
      defaultLevel: WEBHOOKS_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: WEBHOOKS_FEATURE_CODE,
      name: "Webhooks",
      description: "Referentiel actuel des endpoints webhook et de leurs deliveries.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...WEBHOOKS_ALLOWED_LEVELS],
      defaultLevel: WEBHOOKS_DEFAULT_LEVEL,
    },
  });
}
