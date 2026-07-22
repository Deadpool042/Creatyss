import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  PRODUCT_COPY_FIELDS,
  PRODUCT_COPY_SUBJECT_TYPE,
} from "@/entities/localization/product-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

type LocalizationContext = {
  defaultLocaleId: string;
  visitorLocaleId: string;
};

async function getProductLocalizationContext(storeId: string): Promise<LocalizationContext | null> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return null;
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
    return null;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return null;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();
  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return null;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return null;
  }

  return {
    defaultLocaleId: defaultLocale.id,
    visitorLocaleId: visitorLocale.id,
  };
}

export type LocalizedProductCopySource = {
  id: string;
  storeId: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
};

/**
 * Résout en lot les traductions `LocalizedValue` (`PRODUCT_COPY_FIELDS`)
 * pour un ensemble de produits, en évitant les requêtes N+1 (regroupement
 * par store, une requête `findMany` par store). Retourne les mêmes
 * enregistrements avec `name` / `shortDescription` / `description`
 * remplacés par la traduction ACTIVE de la locale visiteur si elle existe,
 * sinon inchangés (fallback locale par défaut déjà porté par les colonnes
 * canoniques).
 *
 * Ne modifie rien si la fonctionnalité multilingue n'est pas active ou si
 * la locale visiteur est la locale par défaut du store — cf.
 * `entities/localization/resolve-localized-value.ts`.
 */
export async function resolveLocalizedProductCopy<T extends LocalizedProductCopySource>(
  products: readonly T[]
): Promise<T[]> {
  if (products.length === 0) {
    return [];
  }

  const productsByStoreId = new Map<string, T[]>();

  for (const product of products) {
    const group = productsByStoreId.get(product.storeId);

    if (group === undefined) {
      productsByStoreId.set(product.storeId, [product]);
    } else {
      group.push(product);
    }
  }

  const resultById = new Map<string, T>();

  for (const product of products) {
    resultById.set(product.id, product);
  }

  for (const [storeId, storeProducts] of productsByStoreId) {
    const context = await getProductLocalizationContext(storeId);

    if (context === null) {
      continue;
    }

    const values = await db.localizedValue.findMany({
      where: {
        storeId,
        subjectType: PRODUCT_COPY_SUBJECT_TYPE,
        subjectId: { in: storeProducts.map((product) => product.id) },
        fieldName: { in: PRODUCT_COPY_FIELDS.map((field) => field.fieldName) },
        status: "ACTIVE",
        archivedAt: null,
        localeId: { in: [context.visitorLocaleId, context.defaultLocaleId] },
      },
      select: { subjectId: true, fieldName: true, localeId: true, valueText: true, status: true },
    });

    const candidatesByProductField = new Map<string, LocalizedValueCandidate[]>();

    for (const value of values) {
      const key = `${value.subjectId}:${value.fieldName}`;
      const candidates = candidatesByProductField.get(key);

      if (candidates === undefined) {
        candidatesByProductField.set(key, [value]);
      } else {
        candidates.push(value);
      }
    }

    for (const product of storeProducts) {
      let name = product.name;
      let shortDescription = product.shortDescription;
      let description = product.description;

      for (const field of PRODUCT_COPY_FIELDS) {
        const resolved = resolveLocalizedValue({
          candidates: candidatesByProductField.get(`${product.id}:${field.fieldName}`) ?? [],
          requestedLocaleId: context.visitorLocaleId,
          defaultLocaleId: context.defaultLocaleId,
        });

        if (resolved === null || resolved.isFallback) {
          continue;
        }

        if (field.fieldName === "name") {
          name = resolved.valueText;
        } else if (field.fieldName === "shortDescription") {
          shortDescription = resolved.valueText;
        } else if (field.fieldName === "description") {
          description = resolved.valueText;
        }
      }

      resultById.set(product.id, { ...product, name, shortDescription, description });
    }
  }

  return products.map((product) => resultById.get(product.id) ?? product);
}
