import type { PrismaClient } from "@/prisma-generated/client";

export const SOCIAL_FEATURE_CODE = "engagement.social";

export const SOCIAL_ALLOWED_LEVELS = ["basic"] as const;

export const SOCIAL_DEFAULT_LEVEL: string = SOCIAL_ALLOWED_LEVELS[0];

export async function seedSocialFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: SOCIAL_FEATURE_CODE,
      },
    },
    update: {
      allowedLevels: [...SOCIAL_ALLOWED_LEVELS],
      defaultLevel: SOCIAL_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: SOCIAL_FEATURE_CODE,
      name: "Diffusion sociale",
      description: "Matérialisation de brouillons de publications sociales.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...SOCIAL_ALLOWED_LEVELS],
      defaultLevel: SOCIAL_DEFAULT_LEVEL,
    },
  });
}
