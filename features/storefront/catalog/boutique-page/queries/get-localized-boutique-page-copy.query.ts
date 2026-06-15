import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  BOUTIQUE_PAGE_COPY_FIELDS,
  BOUTIQUE_PAGE_COPY_SUBJECT_ID,
  BOUTIQUE_PAGE_COPY_SUBJECT_TYPE,
  withBoutiquePageCopyOverrides,
} from "@/entities/localization/boutique-page-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  boutiqueCopyConfig,
  type BoutiquePageCopy,
} from "@/features/storefront/catalog/boutique-page/config/boutique-copy.config";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";

/**
 * Généralisation `LocalizedValue`, pilote n°3 (page boutique), cf.
 * docs/lots/2026-06-13-localization-boutique-page-cadrage.md.
 *
 * Résout `boutiqueCopyConfig` (référence fr) en y appliquant les
 * `LocalizedValue` ACTIVE de la locale visiteur pour les champs du
 * catalogue `BOUTIQUE_PAGE_COPY_FIELDS` (admin de traduction).
 *
 * Retourne `boutiqueCopyConfig` inchangé si :
 * - le niveau `multilingual` de `platform.localization` n'est pas atteint ;
 * - le store n'a pas de locale par défaut ou moins de deux locales
 *   `ACTIVE` ;
 * - la locale visiteur résolue (cookie + fallback) est la locale par
 *   défaut.
 *
 * Seules les valeurs résolues pour la locale visiteur elle-même (pas de
 * fallback vers la locale par défaut) sont appliquées en override — un
 * fallback reproduirait la valeur fr déjà présente dans
 * `boutiqueCopyConfig`. `marketAside.events` (hors catalogue) n'est jamais
 * affecté.
 */
export async function getLocalizedBoutiquePageCopy(): Promise<BoutiquePageCopy> {
  const allowed = await meetsLocalizationLevel("multilingual");

  if (!allowed) {
    return boutiqueCopyConfig;
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return boutiqueCopyConfig;
  }

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { defaultLocaleCode: true },
  });

  const locales = await db.localizationLocale.findMany({
    where: { storeId, archivedAt: null, status: "ACTIVE" },
    select: { id: true, code: true, isDefault: true },
  });

  if (locales.length < 2) {
    return boutiqueCopyConfig;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return boutiqueCopyConfig;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();

  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return boutiqueCopyConfig;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return boutiqueCopyConfig;
  }

  const values = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: BOUTIQUE_PAGE_COPY_SUBJECT_TYPE,
      subjectId: BOUTIQUE_PAGE_COPY_SUBJECT_ID,
      fieldName: { in: BOUTIQUE_PAGE_COPY_FIELDS.map((field) => field.fieldName) },
      status: "ACTIVE",
      archivedAt: null,
      localeId: { in: [visitorLocale.id, defaultLocale.id] },
    },
    select: { fieldName: true, localeId: true, valueText: true, status: true },
  });

  const candidatesByField = new Map<string, LocalizedValueCandidate[]>();

  for (const value of values) {
    const candidates = candidatesByField.get(value.fieldName);

    if (candidates === undefined) {
      candidatesByField.set(value.fieldName, [value]);
    } else {
      candidates.push(value);
    }
  }

  const overrides: Record<string, string> = {};

  for (const field of BOUTIQUE_PAGE_COPY_FIELDS) {
    const resolved = resolveLocalizedValue({
      candidates: candidatesByField.get(field.fieldName) ?? [],
      requestedLocaleId: visitorLocale.id,
      defaultLocaleId: defaultLocale.id,
    });

    if (resolved !== null && !resolved.isFallback) {
      overrides[field.fieldName] = resolved.valueText;
    }
  }

  return withBoutiquePageCopyOverrides(boutiqueCopyConfig, overrides);
}
