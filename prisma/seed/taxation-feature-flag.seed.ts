import type { PrismaClient } from "@/prisma-generated/client";

export const TAXATION_FEATURE_CODE = "commerce.taxation";

export async function seedTaxationFeatureFlag(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  await db.featureFlag.upsert({
    where: { storeId_code: { storeId: store.id, code: TAXATION_FEATURE_CODE } },
    update: {
      name: "Fiscalité (TVA)",
      description: "Calcul de la TVA par territoire (métropole, DOM).",
    },
    create: {
      storeId: store.id,
      code: TAXATION_FEATURE_CODE,
      name: "Fiscalité (TVA)",
      description: "Calcul de la TVA par territoire (métropole, DOM).",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
    },
  });
}
