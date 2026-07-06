"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { findFeatureCatalogEntry } from "@/features/admin/feature-governance/catalog";

export type SetFeatureFlagLevelResult =
  | { ok: true; level: string; message: string }
  | { ok: false; error: string };

/**
 * Définit le niveau actif d'une feature graduée (`mutability: "level_selectable"`,
 * cf. docs/domains/cross-cutting/feature-governance.md, « Niveaux fonctionnels
 * gradués »).
 *
 * Écrit dans `FeatureFlagOverride.level` (scope STORE) sans modifier l'état
 * actif/inactif de la feature : à la création de l'override, `isEnabled`
 * reprend l'état effectif courant (status ACTIVE + isEnabledByDefault) pour
 * que le changement de niveau n'active ni ne désactive la feature.
 */
export async function setFeatureFlagLevelAction(
  flagId: string,
  level: string
): Promise<SetFeatureFlagLevelResult> {
  await requireAuthenticatedAdmin();

  const flag = await db.featureFlag.findUnique({
    where: { id: flagId },
    select: {
      id: true,
      code: true,
      storeId: true,
      status: true,
      isEnabledByDefault: true,
      allowedLevels: true,
      archivedAt: true,
    },
  });

  if (!flag || flag.archivedAt) {
    return { ok: false, error: "Feature flag introuvable." };
  }

  const catalogEntry = findFeatureCatalogEntry(flag.code);

  if (!catalogEntry || catalogEntry.mutability !== "level_selectable") {
    return { ok: false, error: "Cette fonctionnalité ne supporte pas de niveaux." };
  }

  if (!flag.allowedLevels.includes(level)) {
    return { ok: false, error: "Niveau invalide pour cette fonctionnalité." };
  }

  if (flag.storeId === null) {
    return { ok: false, error: "Aucune boutique associée à cette fonctionnalité." };
  }

  const isEnabled = flag.status === "ACTIVE" && flag.isEnabledByDefault;

  await db.featureFlagOverride.upsert({
    where: {
      featureFlagId_scopeType_scopeId: {
        featureFlagId: flag.id,
        scopeType: "STORE",
        scopeId: flag.storeId,
      },
    },
    update: {
      level,
      archivedAt: null,
    },
    create: {
      featureFlagId: flag.id,
      scopeType: "STORE",
      scopeId: flag.storeId,
      isEnabled,
      level,
      reasonCode: "advanced-level-selection",
      notes: "Niveau défini depuis /admin/settings/advanced.",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/settings/advanced");
  revalidatePath("/", "layout");

  return { ok: true, level, message: `Niveau « ${level} » appliqué.` };
}
