"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

type SetLocalizationMultilingualStateResult =
  | { ok: true; enabled: boolean; message: string }
  | { ok: false; enabled: boolean; error: string };

const MANAGED_LEVEL = "managed";
const MULTILINGUAL_LEVEL = "multilingual";

export async function setLocalizationMultilingualStateAction(
  enabled: boolean
): Promise<SetLocalizationMultilingualStateResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { ok: false, enabled: false, error: "Boutique introuvable." };
  }

  const flag = await db.featureFlag.findUnique({
    where: {
      storeId_code: {
        storeId,
        code: LOCALIZATION_FEATURE_CODE,
      },
    },
    select: {
      id: true,
      allowedLevels: true,
    },
  });

  if (!flag) {
    return { ok: false, enabled: false, error: "Feature flag de localisation introuvable." };
  }

  if (
    !flag.allowedLevels.includes(MANAGED_LEVEL) ||
    !flag.allowedLevels.includes(MULTILINGUAL_LEVEL)
  ) {
    return { ok: false, enabled: false, error: "Niveaux de localisation invalides." };
  }

  const targetLevel = enabled ? MULTILINGUAL_LEVEL : MANAGED_LEVEL;

  try {
    await db.$transaction([
      db.featureFlag.update({
        where: { id: flag.id },
        data: { status: "ACTIVE" },
      }),
      db.featureFlagOverride.upsert({
        where: {
          featureFlagId_scopeType_scopeId: {
            featureFlagId: flag.id,
            scopeType: "STORE",
            scopeId: storeId,
          },
        },
        update: {
          isEnabled: true,
          level: targetLevel,
          archivedAt: null,
          reasonCode: enabled
            ? "settings-localization-multilingual"
            : "settings-localization-managed",
          notes: enabled
            ? "Activation du niveau multilingual depuis /admin/settings/localization."
            : "Retour au niveau managed depuis /admin/settings/localization.",
        },
        create: {
          featureFlagId: flag.id,
          scopeType: "STORE",
          scopeId: storeId,
          isEnabled: true,
          level: targetLevel,
          reasonCode: enabled
            ? "settings-localization-multilingual"
            : "settings-localization-managed",
          notes: enabled
            ? "Activation du niveau multilingual depuis /admin/settings/localization."
            : "Retour au niveau managed depuis /admin/settings/localization.",
        },
      }),
    ]);
  } catch (error) {
    console.error("[localization-multilingual-toggle]", error);
    return { ok: false, enabled: !enabled, error: "Erreur lors de la mise à jour. Réessayez." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings/localization");
  revalidatePath("/admin/settings/localization/translations");

  return {
    ok: true,
    enabled,
    message: enabled
      ? "Le sélecteur de langue storefront est activé."
      : "Le storefront revient au niveau managed.",
  };
}
