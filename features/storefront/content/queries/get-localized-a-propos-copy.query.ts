import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  A_PROPOS_PAGE_COPY_FIELDS,
  A_PROPOS_PAGE_COPY_SUBJECT_ID,
  A_PROPOS_PAGE_COPY_SUBJECT_TYPE,
  type AProposPageCopyDictionary,
  withAProposPageCopyOverrides,
} from "@/entities/localization/a-propos-page-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { contentPagesCopyConfig } from "@/features/storefront/content/config/content-pages-copy.config";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";

/**
 * Résout le dictionnaire page À propos en y appliquant les `LocalizedValue`
 * ACTIVE de la locale visiteur pour les champs de `A_PROPOS_PAGE_COPY_FIELDS`.
 *
 * Retourne `contentPagesCopyConfig.aPropos` inchangé si :
 * - le niveau `multilingual` de `platform.localization` n'est pas atteint ;
 * - le store n'a pas de locale par défaut ou moins de deux locales `ACTIVE` ;
 * - la locale visiteur résolue est la locale par défaut.
 *
 * Seules les valeurs résolues pour la locale visiteur elle-même (pas de
 * fallback vers la locale par défaut) sont appliquées en override.
 */
export async function getLocalizedAProposCopy(): Promise<AProposPageCopyDictionary> {
  const allowed = await meetsLocalizationLevel("multilingual");

  if (!allowed) {
    return contentPagesCopyConfig.aPropos;
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return contentPagesCopyConfig.aPropos;
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
    return contentPagesCopyConfig.aPropos;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return contentPagesCopyConfig.aPropos;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();

  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return contentPagesCopyConfig.aPropos;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return contentPagesCopyConfig.aPropos;
  }

  const values = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: A_PROPOS_PAGE_COPY_SUBJECT_TYPE,
      subjectId: A_PROPOS_PAGE_COPY_SUBJECT_ID,
      fieldName: { in: A_PROPOS_PAGE_COPY_FIELDS.map((field) => field.fieldName) },
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

  for (const field of A_PROPOS_PAGE_COPY_FIELDS) {
    const resolved = resolveLocalizedValue({
      candidates: candidatesByField.get(field.fieldName) ?? [],
      requestedLocaleId: visitorLocale.id,
      defaultLocaleId: defaultLocale.id,
    });

    if (resolved !== null && !resolved.isFallback) {
      overrides[field.fieldName] = resolved.valueText;
    }
  }

  return withAProposPageCopyOverrides(contentPagesCopyConfig.aPropos, overrides);
}
