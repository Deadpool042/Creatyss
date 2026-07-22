import type { PrismaClient } from "@/prisma-generated/client";

export const PUBLIC_EVENTS_FEATURE_CODE = "engagement.public-events";

/**
 * Feature flag non gradué (pas de `allowedLevels`/`defaultLevel`) : simple
 * bascule actif/inactif pour le module marchés (`PublicEvent`).
 */
export async function seedPublicEventsFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: PUBLIC_EVENTS_FEATURE_CODE,
      },
    },
    update: {
      name: "Marchés",
      description: "Gestion des marchés (dates, lieux) affichés sur la page publique dédiée.",
    },
    create: {
      storeId: store.id,
      code: PUBLIC_EVENTS_FEATURE_CODE,
      name: "Marchés",
      description: "Gestion des marchés (dates, lieux) affichés sur la page publique dédiée.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
    },
  });
}
