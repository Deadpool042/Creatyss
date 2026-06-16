"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { writeLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import { DEFAULT_LOCALE_CODE } from "@/core/localization/supported-locales";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";
import { listActiveLocalizationLocales } from "@/features/localization/queries/list-active-localization-locales.query";

/**
 * Lot 4 sous-lot 3 — `localization` L2 multilingual, sélecteur de langue
 * storefront (cf. docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Enregistre la préférence de locale du visiteur (cookie non signé), puis :
 * - si L3 `localized-routing` est actif : redirige vers l'URL localisée
 *   (`/[locale]/[path]` pour une locale secondaire, `[path]` pour la locale
 *   par défaut). Requiert le champ hidden `pathWithoutLocale` dans le form.
 * - sinon : `revalidatePath` (comportement lot 4 — pas de changement d'URL).
 *
 * Référence L3 : docs/lots/2026-06-13-localization-l3-cadrage.md, sous-lot 3.
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

  const isL3Active = await meetsLocalizationLevel("localized-routing");

  if (isL3Active) {
    const rawPath = formData.get("pathWithoutLocale");
    const pathWithoutLocale =
      typeof rawPath === "string" && rawPath.startsWith("/") ? rawPath : "/";

    if (locale.code === DEFAULT_LOCALE_CODE) {
      // Locale par défaut → URL non préfixée.
      redirect(pathWithoutLocale);
    } else {
      // Locale secondaire → URL préfixée.
      redirect(`/${locale.code}${pathWithoutLocale}`);
    }
  }

  revalidatePath("/", "layout");
}
