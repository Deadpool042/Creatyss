import "server-only";

import { db } from "@/core/db";
import {
  PRODUCT_COPY_FIELDS,
  PRODUCT_COPY_SUBJECT_TYPE,
} from "@/entities/localization/product-copy-fields";

/**
 * Généralisation `LocalizedValue` — sujet dynamique produit (`subjectId` =
 * `Product.id`), cf. entities/localization/product-copy-fields.ts.
 *
 * Construit l'état de la section traductions de l'éditeur produit : pour
 * chaque champ traduisible, la valeur de référence (colonnes `Product`,
 * locale par défaut) et la `LocalizedValue` existante pour la locale
 * secondaire ACTIVE du store, si elle existe.
 *
 * Si le store n'a pas de seconde locale `ACTIVE`, retourne
 * `{ hasTargetLocale: false }` — l'appelant masque la section.
 */

export type ProductTranslationFieldState = {
  fieldName: string;
  label: string;
  multiline: boolean;
  /** Valeur de référence (locale par défaut) — lecture seule dans l'admin. */
  sourceValue: string;
  /** Valeur traduite existante pour la locale cible, ou `null` si absente. */
  translatedValue: string | null;
};

export type ProductTranslationsState =
  | { hasTargetLocale: false }
  | {
      hasTargetLocale: true;
      targetLocaleName: string;
      fields: ProductTranslationFieldState[];
    };

const NO_TARGET_LOCALE_STATE: ProductTranslationsState = { hasTargetLocale: false };

export async function listProductTranslations(input: {
  productId: string;
}): Promise<ProductTranslationsState> {
  const product = await db.product.findFirst({
    where: { id: input.productId, archivedAt: null },
    select: { id: true, storeId: true, name: true, shortDescription: true, description: true },
  });

  if (product === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const targetLocale = await db.localizationLocale.findFirst({
    where: { storeId: product.storeId, archivedAt: null, status: "ACTIVE", isDefault: false },
    orderBy: { code: "asc" },
    select: { id: true, name: true },
  });

  if (targetLocale === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const existingValues = await db.localizedValue.findMany({
    where: {
      storeId: product.storeId,
      subjectType: PRODUCT_COPY_SUBJECT_TYPE,
      subjectId: product.id,
      localeId: targetLocale.id,
      archivedAt: null,
    },
    select: { fieldName: true, valueText: true },
  });

  const valuesByField = new Map(existingValues.map((value) => [value.fieldName, value.valueText]));

  const sourceByField: Record<string, string> = {
    name: product.name,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
  };

  const fields: ProductTranslationFieldState[] = PRODUCT_COPY_FIELDS.map((field) => ({
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
