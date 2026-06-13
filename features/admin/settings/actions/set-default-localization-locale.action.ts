"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";

type ActionResult = { status: "success" | "error"; message: string };

/**
 * Lot 2 — `localization` L1 managed (cf.
 * docs/lots/2026-06-12-localization-l1-cadrage.md, lot 2).
 *
 * Définit la locale par défaut du store : bascule `LocalizationLocale.isDefault`
 * sur la locale ciblée (et le retire des autres), et garde
 * `Store.defaultLocaleCode` cohérent avec cette locale.
 */
export async function setDefaultLocalizationLocaleAction(formData: FormData): Promise<ActionResult> {
  const allowed = await meetsLocalizationLevel("managed");

  if (!allowed) {
    return { status: "error", message: "Fonctionnalité de localisation non activée." };
  }

  const localeId = formData.get("localeId");

  if (typeof localeId !== "string" || localeId.trim() === "") {
    return { status: "error", message: "Locale manquante." };
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { status: "error", message: "Boutique introuvable." };
  }

  const locale = await db.localizationLocale.findFirst({
    where: { id: localeId, storeId, archivedAt: null },
    select: { id: true, code: true, isDefault: true, status: true },
  });

  if (!locale) {
    return { status: "error", message: "Locale introuvable." };
  }

  if (locale.status !== "ACTIVE") {
    return { status: "error", message: "Seule une locale active peut devenir la locale par défaut." };
  }

  if (locale.isDefault) {
    return { status: "success", message: "Cette locale est déjà la locale par défaut." };
  }

  try {
    await db.$transaction([
      db.localizationLocale.updateMany({
        where: { storeId, isDefault: true },
        data: { isDefault: false },
      }),
      db.localizationLocale.update({
        where: { id: locale.id },
        data: { isDefault: true },
      }),
      db.store.update({
        where: { id: storeId },
        data: { defaultLocaleCode: locale.code },
      }),
    ]);
  } catch (error) {
    console.error("[localization-locales]", error);
    return { status: "error", message: "Erreur lors de la mise à jour. Réessayez." };
  }

  revalidatePath("/admin/settings/localization");
  revalidatePath("/admin/settings/store");

  return { status: "success", message: "Locale par défaut mise à jour." };
}
