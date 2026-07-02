import type { PrismaClient } from "@/prisma-generated/client";

export const RETURNS_FEATURE_CODE = "commerce.returns";

export const RETURNS_ALLOWED_LEVELS = ["manual", "partial"] as const;

export const RETURNS_DEFAULT_LEVEL: string = RETURNS_ALLOWED_LEVELS[0];

export async function seedReturnsFeatureFlag(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  await db.featureFlag.upsert({
    where: { storeId_code: { storeId: store.id, code: RETURNS_FEATURE_CODE } },
    update: {
      name: "Retours",
      description: "Gestion des demandes de retour et de leurs décisions.",
      allowedLevels: [...RETURNS_ALLOWED_LEVELS],
      defaultLevel: RETURNS_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: RETURNS_FEATURE_CODE,
      name: "Retours",
      description: "Gestion des demandes de retour et de leurs décisions.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...RETURNS_ALLOWED_LEVELS],
      defaultLevel: RETURNS_DEFAULT_LEVEL,
    },
  });
}
