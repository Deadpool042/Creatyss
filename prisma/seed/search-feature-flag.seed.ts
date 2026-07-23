import type { PrismaClient } from "@/prisma-generated/client";

export const SEARCH_FEATURE_CODE = "satellite.search";

export const SEARCH_ALLOWED_LEVELS = ["basic"] as const;

export const SEARCH_DEFAULT_LEVEL: string = SEARCH_ALLOWED_LEVELS[0];

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
      allowedLevels: [...SEARCH_ALLOWED_LEVELS],
      defaultLevel: SEARCH_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: SEARCH_FEATURE_CODE,
      name: "Recherche indexee",
      description: "Referentiel interne des documents indexes pour la recherche.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...SEARCH_ALLOWED_LEVELS],
      defaultLevel: SEARCH_DEFAULT_LEVEL,
    },
  });
}
