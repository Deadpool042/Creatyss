import type { PrismaClient } from "@/prisma-generated/client";

export const TRACKING_FEATURE_CODE = "engagement.tracking";

export const TRACKING_ALLOWED_LEVELS = ["active"] as const;

export const TRACKING_DEFAULT_LEVEL: string = TRACKING_ALLOWED_LEVELS[0];

/**
 * `engagement.tracking` remplace la capacité de collecte déjà active pour
 * toutes les boutiques sous `engagement.analytics` (cf.
 * `docs/roadmap/analyses-cockpit-analytique/lot-6-tracking-dashboarding-cadrage.md`) :
 * seedé actif d'emblée, pas une nouvelle feature à activer progressivement.
 */
export async function seedTrackingFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: TRACKING_FEATURE_CODE,
      },
    },
    update: {
      status: "ACTIVE",
      isEnabledByDefault: true,
      allowedLevels: [...TRACKING_ALLOWED_LEVELS],
      defaultLevel: TRACKING_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: TRACKING_FEATURE_CODE,
      name: "Tracking storefront",
      description: "Collecte anonyme des signaux de comportement storefront, sans cookie.",
      status: "ACTIVE",
      scopeType: "STORE",
      isEnabledByDefault: true,
      allowedLevels: [...TRACKING_ALLOWED_LEVELS],
      defaultLevel: TRACKING_DEFAULT_LEVEL,
    },
  });
}
