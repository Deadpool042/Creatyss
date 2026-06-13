import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";
import { listActiveLocalizationLocales } from "@/features/localization/queries/list-active-localization-locales.query";

/**
 * Lot 4 sous-lot 3 — `localization` L2 multilingual, sélecteur de langue
 * storefront (cf. docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Combine :
 * - le guard gradué `meetsLocalizationLevel("multilingual")` (toujours
 *   `false` tant que le flag `platform.localization` est DRAFT — le
 *   sélecteur reste invisible par défaut) ;
 * - au moins deux locales `ACTIVE` (sinon un sélecteur n'a pas de sens) ;
 * - la résolution de la locale active via la préférence cookie
 *   (`resolvePreferredLocaleCode`).
 */

export type LocaleSelectorOption = {
  code: string;
  name: string;
};

export type LocaleSelectorState =
  | { isVisible: false }
  | { isVisible: true; activeLocaleCode: string; options: LocaleSelectorOption[] };

const HIDDEN_STATE: LocaleSelectorState = { isVisible: false };

export async function getLocaleSelectorState(): Promise<LocaleSelectorState> {
  const allowed = await meetsLocalizationLevel("multilingual");

  if (!allowed) {
    return HIDDEN_STATE;
  }

  const locales = await listActiveLocalizationLocales();

  if (locales.length < 2) {
    return HIDDEN_STATE;
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return HIDDEN_STATE;
  }

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { defaultLocaleCode: true },
  });

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    locales[0];

  if (!defaultLocale) {
    return HIDDEN_STATE;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();

  const activeLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  return {
    isVisible: true,
    activeLocaleCode,
    options: locales.map((locale) => ({ code: locale.code, name: locale.name })),
  };
}
