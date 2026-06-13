"use server";

import { revalidatePath } from "next/cache";

import { writeLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";
import { listActiveLocalizationLocales } from "@/features/localization/queries/list-active-localization-locales.query";

/**
 * Lot 4 sous-lot 3 — `localization` L2 multilingual, sélecteur de langue
 * storefront (cf. docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Enregistre la préférence de locale du visiteur (cookie non signé) après
 * validation contre les locales `ACTIVE` du store courant. N'effectue
 * aucun routing — la locale active reste résolue par
 * `getLocaleSelectorState` / `resolvePreferredLocaleCode` à chaque rendu.
 */
export async function setLocalePreferenceAction(formData: FormData): Promise<void> {
  const allowed = await meetsLocalizationLevel("multilingual");

  if (!allowed) {
    return;
  }

  const localeCode = formData.get("localeCode");

  if (typeof localeCode !== "string" || localeCode.trim() === "") {
    return;
  }

  const locales = await listActiveLocalizationLocales();
  const locale = locales.find((candidate) => candidate.code === localeCode);

  if (!locale) {
    return;
  }

  await writeLocalePreferenceCookie(locale.code);

  revalidatePath("/", "layout");
}
