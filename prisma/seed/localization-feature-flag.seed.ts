import type { PrismaClient } from "@/prisma-generated/client";

/**
 * Premier flag gradué seedé du repo (cf.
 * docs/lots/2026-06-12-localization-l1-cadrage.md, lot 1).
 *
 * `platform.localization` est seedé en DRAFT (non actif) avec ses niveaux
 * autorisés et son niveau par défaut, pour valider le mécanisme de gradation
 * porté par le schéma (allowedLevels / defaultLevel / override.level) sans
 * activer la capacité. L'activation et le passage à ACTIVE relèvent d'une
 * décision produit ultérieure (lot 2 — L1 managed).
 *
 * Les niveaux doivent rester synchronisés avec
 * FEATURE_LEVELS.localization (features/admin/pilotage/catalog/feature-catalog.ts).
 */
export const LOCALIZATION_FEATURE_CODE = "platform.localization";

export const LOCALIZATION_ALLOWED_LEVELS = [
  "managed",
  "multilingual",
  "localized-routing",
] as const;

export const LOCALIZATION_DEFAULT_LEVEL: string = LOCALIZATION_ALLOWED_LEVELS[0];

export async function seedLocalizationFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: LOCALIZATION_FEATURE_CODE,
      },
    },
    update: {
      allowedLevels: [...LOCALIZATION_ALLOWED_LEVELS],
      defaultLevel: LOCALIZATION_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: LOCALIZATION_FEATURE_CODE,
      name: "Localisation",
      description:
        "Gestion des langues, devises et adaptations locales du contenu et des prix.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...LOCALIZATION_ALLOWED_LEVELS],
      defaultLevel: LOCALIZATION_DEFAULT_LEVEL,
    },
  });
}
