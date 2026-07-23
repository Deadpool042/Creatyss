import "server-only";

import { db } from "@/core/db";
import {
  CATEGORY_COPY_FIELDS,
  CATEGORY_COPY_SUBJECT_TYPE,
} from "@/entities/localization/category-copy-fields";

/**
 * Généralisation `LocalizedValue` — sujet dynamique catégorie (`subjectId` =
 * `Category.id`), cf. entities/localization/category-copy-fields.ts.
 *
 * Construit l'état de la section traductions de l'éditeur catégorie : pour
 * chaque champ traduisible, la valeur de référence (colonnes `Category`,
 * locale par défaut) et la `LocalizedValue` existante pour la locale
 * secondaire ACTIVE du store, si elle existe.
 *
 * Si le store n'a pas de seconde locale `ACTIVE`, retourne
 * `{ hasTargetLocale: false }` — l'appelant masque la section.
 */

export type CategoryTranslationFieldState = {
  fieldName: string;
  label: string;
  multiline: boolean;
  /** Valeur de référence (locale par défaut) — lecture seule dans l'admin. */
  sourceValue: string;
  /** Valeur traduite existante pour la locale cible, ou `null` si absente. */
  translatedValue: string | null;
};

export type CategoryTranslationsState =
  | { hasTargetLocale: false }
  | {
      hasTargetLocale: true;
      targetLocaleName: string;
      fields: CategoryTranslationFieldState[];
    };

const NO_TARGET_LOCALE_STATE: CategoryTranslationsState = { hasTargetLocale: false };

export async function listCategoryTranslations(input: {
  categoryId: string;
}): Promise<CategoryTranslationsState> {
  const category = await db.category.findFirst({
    where: { id: input.categoryId, archivedAt: null },
    select: { id: true, storeId: true, name: true, shortDescription: true, description: true },
  });

  if (category === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const targetLocale = await db.localizationLocale.findFirst({
    where: { storeId: category.storeId, archivedAt: null, status: "ACTIVE", isDefault: false },
    orderBy: { code: "asc" },
    select: { id: true, name: true },
  });

  if (targetLocale === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const existingValues = await db.localizedValue.findMany({
    where: {
      storeId: category.storeId,
      subjectType: CATEGORY_COPY_SUBJECT_TYPE,
      subjectId: category.id,
      localeId: targetLocale.id,
      archivedAt: null,
    },
    select: { fieldName: true, valueText: true },
  });

  const valuesByField = new Map(existingValues.map((value) => [value.fieldName, value.valueText]));

  const sourceByField: Record<string, string> = {
    name: category.name,
    shortDescription: category.shortDescription ?? "",
    description: category.description ?? "",
  };

  const fields: CategoryTranslationFieldState[] = CATEGORY_COPY_FIELDS.map((field) => ({
    fieldName: field.fieldName,
    label: field.label,
    multiline: field.multiline ?? false,
    sourceValue: sourceByField[field.fieldName] ?? "",
    translatedValue: valuesByField.get(field.fieldName) ?? null,
  }));

  return {
    hasTargetLocale: true,
    targetLocaleName: targetLocale.name,
    fields,
  };
}
