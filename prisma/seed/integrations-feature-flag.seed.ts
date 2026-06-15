import type { PrismaClient } from "@/prisma-generated/client";

export const INTEGRATIONS_FEATURE_CODE = "platform.integrations";

export async function seedIntegrationsFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: INTEGRATIONS_FEATURE_CODE,
      },
    },
    update: {
      name: "Integrations externes",
      description: "Referentiel interne des integrations, credentials redacts et etats de synchronisation.",
    },
    create: {
      storeId: store.id,
      code: INTEGRATIONS_FEATURE_CODE,
      name: "Integrations externes",
      description: "Referentiel interne des integrations, credentials redacts et etats de synchronisation.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
    },
  });
}
