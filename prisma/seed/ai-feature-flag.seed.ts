import type { PrismaClient } from "@/prisma-generated/client";

/**
 * `ai.core` est `level_selectable` dans le catalogue
 * (features/admin/feature-governance/catalog/feature-catalog.ts, FEATURE_LEVELS.ai) mais
 * n'avait aucune ligne en base, contrairement aux autres features graduées
 * (discounts, newsletter, analytics, localization). Seedé en DRAFT pour
 * permettre le pilotage du niveau depuis /admin/settings/advanced sans
 * activer la capacité (décision produit ultérieure).
 *
 * Les niveaux doivent rester synchronisés avec FEATURE_LEVELS.ai.
 */
export const AI_FEATURE_CODE = "ai.core";

export const AI_ALLOWED_LEVELS = ["basic", "assistant", "advanced", "automation"] as const;

export const AI_DEFAULT_LEVEL: string = AI_ALLOWED_LEVELS[0];

export async function seedAiFeatureFlag(db: PrismaClient): Promise<void> {
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
        code: AI_FEATURE_CODE,
      },
    },
    update: {
      allowedLevels: [...AI_ALLOWED_LEVELS],
      defaultLevel: AI_DEFAULT_LEVEL,
    },
    create: {
      storeId: store.id,
      code: AI_FEATURE_CODE,
      name: "Intelligence artificielle",
      description:
        "Fonctionnalités IA transverses : génération de contenu, suggestions et automatisations.",
      status: "DRAFT",
      scopeType: "STORE",
      isEnabledByDefault: false,
      allowedLevels: [...AI_ALLOWED_LEVELS],
      defaultLevel: AI_DEFAULT_LEVEL,
    },
  });
}
