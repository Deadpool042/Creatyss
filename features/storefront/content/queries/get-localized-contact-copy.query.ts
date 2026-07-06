import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  CONTACT_PAGE_COPY_FIELDS,
  CONTACT_PAGE_COPY_SUBJECT_ID,
  CONTACT_PAGE_COPY_SUBJECT_TYPE,
  type ContactPageCopyDictionary,
  withContactPageCopyOverrides,
} from "@/entities/localization/contact-page-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { contentPagesCopyConfig } from "@/features/storefront/content/config/content-pages-copy.config";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

/**
 * Résout le dictionnaire page Contact en y appliquant les `LocalizedValue`
 * ACTIVE de la locale visiteur pour les champs de `CONTACT_PAGE_COPY_FIELDS`
 * (`metadata.title`, `metadata.description`).
 *
 * Retourne `contentPagesCopyConfig.contact` inchangé si :
 * - le niveau `multilingual` de `platform.localization` n'est pas atteint ;
 * - le store n'a pas de locale par défaut ou moins de deux locales `ACTIVE` ;
 * - la locale visiteur résolue est la locale par défaut.
 *
 * Seules les valeurs résolues pour la locale visiteur elle-même (pas de
 * fallback vers la locale par défaut) sont appliquées en override.
 */
export async function getLocalizedContactCopy(): Promise<ContactPageCopyDictionary> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return contentPagesCopyConfig.contact;
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return contentPagesCopyConfig.contact;
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
    return contentPagesCopyConfig.contact;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return contentPagesCopyConfig.contact;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();

  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return contentPagesCopyConfig.contact;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return contentPagesCopyConfig.contact;
  }

  const values = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: CONTACT_PAGE_COPY_SUBJECT_TYPE,
      subjectId: CONTACT_PAGE_COPY_SUBJECT_ID,
      fieldName: { in: CONTACT_PAGE_COPY_FIELDS.map((field) => field.fieldName) },
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

  for (const field of CONTACT_PAGE_COPY_FIELDS) {
    const resolved = resolveLocalizedValue({
      candidates: candidatesByField.get(field.fieldName) ?? [],
      requestedLocaleId: visitorLocale.id,
      defaultLocaleId: defaultLocale.id,
    });

    if (resolved !== null && !resolved.isFallback) {
      overrides[field.fieldName] = resolved.valueText;
    }
  }

  return withContactPageCopyOverrides(contentPagesCopyConfig.contact, overrides);
}
