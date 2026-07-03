import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  HOMEPAGE_COPY_FIELDS,
  HOMEPAGE_COPY_SUBJECT_ID,
  HOMEPAGE_COPY_SUBJECT_TYPE,
  withHomepageCopyOverrides,
} from "@/entities/localization/homepage-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  homepageCopyConfig,
  type HomepageCopy,
} from "@/features/homepage/config/homepage-copy.config";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

/**
 * Lot 4 sous-lot 5 — câblage lecture multilingue du pilote homepage (cf.
 * docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Résout `homepageCopyConfig` (référence fr, lot 3) en y appliquant les
 * `LocalizedValue` ACTIVE de la locale visiteur pour les champs du
 * catalogue `HOMEPAGE_COPY_FIELDS` (admin de traduction, sous-lot 4).
 *
 * Retourne `homepageCopyConfig` inchangé si :
 * - le niveau `multilingual` de `platform.localization` n'est pas atteint ;
 * - le store n'a pas de locale par défaut ou moins de deux locales
 *   `ACTIVE` ;
 * - la locale visiteur résolue (cookie + fallback) est la locale par
 *   défaut.
 *
 * Seules les valeurs résolues pour la locale visiteur elle-même (pas de
 * fallback vers la locale par défaut) sont appliquées en override — un
 * fallback reproduirait la valeur fr déjà présente dans
 * `homepageCopyConfig`.
 */
export async function getLocalizedHomepageCopy(): Promise<HomepageCopy> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return homepageCopyConfig;
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return homepageCopyConfig;
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
    return homepageCopyConfig;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return homepageCopyConfig;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();

  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return homepageCopyConfig;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return homepageCopyConfig;
  }

  const values = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: HOMEPAGE_COPY_SUBJECT_TYPE,
      subjectId: HOMEPAGE_COPY_SUBJECT_ID,
      fieldName: { in: HOMEPAGE_COPY_FIELDS.map((field) => field.fieldName) },
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

  for (const field of HOMEPAGE_COPY_FIELDS) {
    const resolved = resolveLocalizedValue({
      candidates: candidatesByField.get(field.fieldName) ?? [],
      requestedLocaleId: visitorLocale.id,
      defaultLocaleId: defaultLocale.id,
    });

    if (resolved !== null && !resolved.isFallback) {
      overrides[field.fieldName] = resolved.valueText;
    }
  }

  return withHomepageCopyOverrides(homepageCopyConfig, overrides);
}
