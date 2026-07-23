import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  CATEGORY_COPY_FIELDS,
  CATEGORY_COPY_SUBJECT_TYPE,
} from "@/entities/localization/category-copy-fields";
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

async function getCategoryLocalizationContext(
  storeId: string
): Promise<LocalizationContext | null> {
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

export type LocalizedCategoryCopySource = {
  id: string;
  storeId: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
};

/**
 * Résout en lot les traductions `LocalizedValue` (`CATEGORY_COPY_FIELDS`)
 * pour un ensemble de catégories, en évitant les requêtes N+1 (regroupement
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
export async function resolveLocalizedCategoryCopy<T extends LocalizedCategoryCopySource>(
  categories: readonly T[]
): Promise<T[]> {
  if (categories.length === 0) {
    return [];
  }

  const categoriesByStoreId = new Map<string, T[]>();

  for (const category of categories) {
    const group = categoriesByStoreId.get(category.storeId);

    if (group === undefined) {
      categoriesByStoreId.set(category.storeId, [category]);
    } else {
      group.push(category);
    }
  }

  const resultById = new Map<string, T>();

  for (const category of categories) {
    resultById.set(category.id, category);
  }

  for (const [storeId, storeCategories] of categoriesByStoreId) {
    const context = await getCategoryLocalizationContext(storeId);

    if (context === null) {
      continue;
    }

    const values = await db.localizedValue.findMany({
      where: {
        storeId,
        subjectType: CATEGORY_COPY_SUBJECT_TYPE,
        subjectId: { in: storeCategories.map((category) => category.id) },
        fieldName: { in: CATEGORY_COPY_FIELDS.map((field) => field.fieldName) },
        status: "ACTIVE",
        archivedAt: null,
        localeId: { in: [context.visitorLocaleId, context.defaultLocaleId] },
      },
      select: { subjectId: true, fieldName: true, localeId: true, valueText: true, status: true },
    });

    const candidatesByCategoryField = new Map<string, LocalizedValueCandidate[]>();

    for (const value of values) {
      const key = `${value.subjectId}:${value.fieldName}`;
      const candidates = candidatesByCategoryField.get(key);

      if (candidates === undefined) {
        candidatesByCategoryField.set(key, [value]);
      } else {
        candidates.push(value);
      }
    }

    for (const category of storeCategories) {
      let name = category.name;
      let shortDescription = category.shortDescription;
      let description = category.description;

      for (const field of CATEGORY_COPY_FIELDS) {
        const resolved = resolveLocalizedValue({
          candidates: candidatesByCategoryField.get(`${category.id}:${field.fieldName}`) ?? [],
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

      resultById.set(category.id, { ...category, name, shortDescription, description });
    }
  }

  return categories.map((category) => resultById.get(category.id) ?? category);
}
