import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  PRODUCT_PAGE_COPY_FIELDS,
  PRODUCT_PAGE_COPY_SUBJECT_ID,
  PRODUCT_PAGE_COPY_SUBJECT_TYPE,
  withProductPageCopyOverrides,
} from "@/entities/localization/product-page-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  productPageCopyConfig,
  type ProductPageCopy,
} from "@/features/storefront/catalog/product-page/config/product-page-copy.config";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";

/**
 * Généralisation `LocalizedValue`, pilote n°2 (fiche produit), cf.
 * docs/lots/2026-06-13-localization-product-page-cadrage.md.
 *
 * Résout `productPageCopyConfig` (référence fr) en y appliquant les
 * `LocalizedValue` ACTIVE de la locale visiteur pour les champs du
 * catalogue `PRODUCT_PAGE_COPY_FIELDS` (admin de traduction).
 *
 * Retourne `productPageCopyConfig` inchangé si :
 * - le niveau `multilingual` de `platform.localization` n'est pas atteint ;
 * - le store n'a pas de locale par défaut ou moins de deux locales
 *   `ACTIVE` ;
 * - la locale visiteur résolue (cookie + fallback) est la locale par
 *   défaut.
 *
 * Seules les valeurs résolues pour la locale visiteur elle-même (pas de
 * fallback vers la locale par défaut) sont appliquées en override — un
 * fallback reproduirait la valeur fr déjà présente dans
 * `productPageCopyConfig`.
 */
export async function getLocalizedProductPageCopy(): Promise<ProductPageCopy> {
  const allowed = await meetsLocalizationLevel("multilingual");

  if (!allowed) {
    return productPageCopyConfig;
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return productPageCopyConfig;
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
    return productPageCopyConfig;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return productPageCopyConfig;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();

  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return productPageCopyConfig;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return productPageCopyConfig;
  }

  const values = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: PRODUCT_PAGE_COPY_SUBJECT_TYPE,
      subjectId: PRODUCT_PAGE_COPY_SUBJECT_ID,
      fieldName: { in: PRODUCT_PAGE_COPY_FIELDS.map((field) => field.fieldName) },
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

  for (const field of PRODUCT_PAGE_COPY_FIELDS) {
    const resolved = resolveLocalizedValue({
      candidates: candidatesByField.get(field.fieldName) ?? [],
      requestedLocaleId: visitorLocale.id,
      defaultLocaleId: defaultLocale.id,
    });

    if (resolved !== null && !resolved.isFallback) {
      overrides[field.fieldName] = resolved.valueText;
    }
  }

  return withProductPageCopyOverrides(productPageCopyConfig, overrides);
}
