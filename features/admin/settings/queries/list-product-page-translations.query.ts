import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  PRODUCT_PAGE_COPY_FIELDS,
  PRODUCT_PAGE_COPY_SUBJECT_ID,
  PRODUCT_PAGE_COPY_SUBJECT_TYPE,
  getProductPageCopyFrValue,
} from "@/entities/localization/product-page-copy-fields";

/**
 * Généralisation `LocalizedValue`, pilote n°2 (fiche produit), cf.
 * docs/lots/2026-06-13-localization-product-page-cadrage.md.
 *
 * Construit l'état de l'admin de traduction pour le dictionnaire fiche
 * produit (`PRODUCT_PAGE_COPY_FIELDS`) : pour chaque champ, la valeur de
 * référence (fr, locale par défaut) et la `LocalizedValue` existante pour la
 * locale secondaire ACTIVE du store, si elle existe.
 *
 * Si le store n'a pas de seconde locale `ACTIVE` (gérée), retourne
 * `{ hasTargetLocale: false }` — l'appelant affiche un état vide invitant à
 * activer une seconde locale.
 */

export type ProductPageTranslationFieldState = {
  fieldName: string;
  label: string;
  group: string;
  multiline: boolean;
  /** Valeur de référence (fr, locale par défaut) — lecture seule dans l'admin. */
  sourceValue: string;
  /** Valeur traduite existante pour la locale cible, ou `null` si absente. */
  translatedValue: string | null;
};

export type ProductPageTranslationsTargetLocale = {
  id: string;
  code: string;
  name: string;
};

export type ProductPageTranslationsState =
  | { hasTargetLocale: false }
  | {
      hasTargetLocale: true;
      targetLocale: ProductPageTranslationsTargetLocale;
      fields: ProductPageTranslationFieldState[];
    };

const NO_TARGET_LOCALE_STATE: ProductPageTranslationsState = { hasTargetLocale: false };

export async function listProductPageTranslations(): Promise<ProductPageTranslationsState> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const targetLocale = await db.localizationLocale.findFirst({
    where: { storeId, archivedAt: null, status: "ACTIVE", isDefault: false },
    orderBy: { code: "asc" },
    select: { id: true, code: true, name: true },
  });

  if (targetLocale === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const existingValues = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: PRODUCT_PAGE_COPY_SUBJECT_TYPE,
      subjectId: PRODUCT_PAGE_COPY_SUBJECT_ID,
      localeId: targetLocale.id,
      archivedAt: null,
    },
    select: { fieldName: true, valueText: true },
  });

  const valuesByField = new Map(existingValues.map((value) => [value.fieldName, value.valueText]));

  const fields: ProductPageTranslationFieldState[] = PRODUCT_PAGE_COPY_FIELDS.map((field) => ({
    fieldName: field.fieldName,
    label: field.label,
    group: field.group,
    multiline: field.multiline ?? false,
    sourceValue: getProductPageCopyFrValue(field.fieldName) ?? "",
    translatedValue: valuesByField.get(field.fieldName) ?? null,
  }));

  return {
    hasTargetLocale: true,
    targetLocale: { id: targetLocale.id, code: targetLocale.code, name: targetLocale.name },
    fields,
  };
}
