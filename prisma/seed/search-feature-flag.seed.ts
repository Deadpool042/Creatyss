import type { PrismaClient } from "@/prisma-generated/client";

export const SEARCH_FEATURE_CODE = "satellite.search";

export async function seedSearchFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: SEARCH_FEATURE_CODE,
      },
    },
    update: {
      name: "Recherche indexee",
      description: "Referentiel interne des documents indexes pour la recherche.",
    },
    create: {
      storeId: store.id,
      code: SEARCH_FEATURE_CODE,
      name: "Recherche indexee",
      description: "Referentiel interne des documents indexes pour la recherche.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
    },
  });
}
