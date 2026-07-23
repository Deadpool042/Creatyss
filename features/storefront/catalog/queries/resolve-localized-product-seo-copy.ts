import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  PRODUCT_SEO_COPY_FIELDS,
  PRODUCT_SEO_COPY_SUBJECT_TYPE,
} from "@/entities/localization/product-seo-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

export type LocalizedProductSeoCopySource = {
  metaTitle: string | null;
  metaDescription: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
};

/**
 * Résout les traductions `LocalizedValue` (`PRODUCT_SEO_COPY_FIELDS`) pour
 * les champs texte de `SeoMetadata` d'un produit, en miroir de
 * `resolve-localized-product-copy.ts`. `subjectId` = `Product.id`, même
 * convention que `SeoMetadata.subjectId` pour un produit (cf.
 * `get-published-product-by-slug/readers.ts`).
 *
 * Retourne `seoMetadata` inchangé si la fonctionnalité multilingue n'est
 * pas active, si la locale visiteur est la locale par défaut du store, ou
 * si `seoMetadata` est `null` (rien à localiser).
 */
export async function resolveLocalizedProductSeoCopy<T extends LocalizedProductSeoCopySource>(
  storeId: string,
  productId: string,
  seoMetadata: T | null
): Promise<T | null> {
  if (seoMetadata === null) {
    return null;
  }

  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return seoMetadata;
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
    return seoMetadata;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return seoMetadata;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();
  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return seoMetadata;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return seoMetadata;
  }

  const values = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: PRODUCT_SEO_COPY_SUBJECT_TYPE,
      subjectId: productId,
      fieldName: { in: PRODUCT_SEO_COPY_FIELDS.map((field) => field.fieldName) },
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

  const localized = { ...seoMetadata };

  for (const field of PRODUCT_SEO_COPY_FIELDS) {
    const resolved = resolveLocalizedValue({
      candidates: candidatesByField.get(field.fieldName) ?? [],
      requestedLocaleId: visitorLocale.id,
      defaultLocaleId: defaultLocale.id,
    });

    if (resolved === null || resolved.isFallback) {
      continue;
    }

    localized[field.fieldName] = resolved.valueText;
  }

  return localized;
}
