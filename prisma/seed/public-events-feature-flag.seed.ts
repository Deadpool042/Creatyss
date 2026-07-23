import type { PrismaClient } from "@/prisma-generated/client";

export const PUBLIC_EVENTS_FEATURE_CODE = "engagement.public-events";

export const PUBLIC_EVENTS_ALLOWED_LEVELS = ["basic"] as const;

export const PUBLIC_EVENTS_DEFAULT_LEVEL: string = PUBLIC_EVENTS_ALLOWED_LEVELS[0];

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
      allowedLevels: [...PUBLIC_EVENTS_ALLOWED_LEVELS],
      defaultLevel: PUBLIC_EVENTS_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: PUBLIC_EVENTS_FEATURE_CODE,
      name: "Marchés",
      description: "Gestion des marchés (dates, lieux) affichés sur la page publique dédiée.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...PUBLIC_EVENTS_ALLOWED_LEVELS],
      defaultLevel: PUBLIC_EVENTS_DEFAULT_LEVEL,
    },
  });
}
