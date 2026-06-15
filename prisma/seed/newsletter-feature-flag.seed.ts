import type { PrismaClient } from "@/prisma-generated/client";

export const NEWSLETTER_FEATURE_CODE = "engagement.newsletter";

export const NEWSLETTER_ALLOWED_LEVELS = ["basic", "segmentation", "automation"] as const;

export const NEWSLETTER_DEFAULT_LEVEL: string = NEWSLETTER_ALLOWED_LEVELS[0];

export async function seedNewsletterFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: NEWSLETTER_FEATURE_CODE,
      },
    },
    update: {
      allowedLevels: [...NEWSLETTER_ALLOWED_LEVELS],
      defaultLevel: NEWSLETTER_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: NEWSLETTER_FEATURE_CODE,
      name: "Newsletter",
      description: "Gestion des campagnes email et des abonnements.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...NEWSLETTER_ALLOWED_LEVELS],
      defaultLevel: NEWSLETTER_DEFAULT_LEVEL,
    },
  });
}
