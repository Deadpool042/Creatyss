import "server-only";

import { db } from "@/core/db";
import {
  PRODUCT_SEO_COPY_FIELDS,
  PRODUCT_SEO_COPY_SUBJECT_TYPE,
} from "@/entities/localization/product-seo-copy-fields";
import type { ProductTranslationFieldState } from "@/features/admin/products/queries/list-product-translations.query";

/**
 * Généralisation `LocalizedValue` — sujet dynamique `product-seo`
 * (`subjectId` = `Product.id`), cf.
 * entities/localization/product-seo-copy-fields.ts.
 *
 * Construit l'état de la section traductions SEO de l'onglet SEO produit :
 * pour chaque champ traduisible, la valeur de référence (`SeoMetadata`,
 * locale par défaut) et la `LocalizedValue` existante pour la locale
 * secondaire ACTIVE du store, si elle existe.
 *
 * Si le store n'a pas de seconde locale `ACTIVE`, retourne
 * `{ hasTargetLocale: false }` — l'appelant masque la section.
 */

export type ProductSeoTranslationsState =
  | { hasTargetLocale: false }
  | {
      hasTargetLocale: true;
      targetLocaleName: string;
      fields: ProductTranslationFieldState[];
    };

const NO_TARGET_LOCALE_STATE: ProductSeoTranslationsState = { hasTargetLocale: false };

export async function listProductSeoTranslations(input: {
  productId: string;
}): Promise<ProductSeoTranslationsState> {
  const product = await db.product.findFirst({
    where: { id: input.productId, archivedAt: null },
    select: { id: true, storeId: true },
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

  const [seoMetadata, existingValues] = await Promise.all([
    db.seoMetadata.findFirst({
      where: {
        storeId: product.storeId,
        subjectType: "PRODUCT",
        subjectId: product.id,
        archivedAt: null,
      },
      select: {
        metaTitle: true,
        metaDescription: true,
        openGraphTitle: true,
        openGraphDescription: true,
        twitterTitle: true,
        twitterDescription: true,
      },
    }),
    db.localizedValue.findMany({
      where: {
        storeId: product.storeId,
        subjectType: PRODUCT_SEO_COPY_SUBJECT_TYPE,
        subjectId: product.id,
        localeId: targetLocale.id,
        archivedAt: null,
      },
      select: { fieldName: true, valueText: true },
    }),
  ]);

  const valuesByField = new Map(existingValues.map((value) => [value.fieldName, value.valueText]));

  const sourceByField: Record<string, string> = {
    metaTitle: seoMetadata?.metaTitle ?? "",
    metaDescription: seoMetadata?.metaDescription ?? "",
    openGraphTitle: seoMetadata?.openGraphTitle ?? "",
    openGraphDescription: seoMetadata?.openGraphDescription ?? "",
    twitterTitle: seoMetadata?.twitterTitle ?? "",
    twitterDescription: seoMetadata?.twitterDescription ?? "",
  };

  const fields: ProductTranslationFieldState[] = PRODUCT_SEO_COPY_FIELDS.map((field) => ({
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
