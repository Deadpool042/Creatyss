import type { PrismaClient } from "@/prisma-generated/client";

export const AUTOMATIONS_FEATURE_CODE = "engagement.automations";

export async function seedAutomationsFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: AUTOMATIONS_FEATURE_CODE,
      },
    },
    update: {
      name: "Automations marketing",
      description:
        "Activation gouvernee des flux marketing automatises declenches par les evenements boutique.",
    },
    create: {
      storeId: store.id,
      code: AUTOMATIONS_FEATURE_CODE,
      name: "Automations marketing",
      description:
        "Activation gouvernee des flux marketing automatises declenches par les evenements boutique.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
    },
  });
}
