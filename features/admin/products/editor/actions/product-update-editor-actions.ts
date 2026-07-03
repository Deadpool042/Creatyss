"use server";

import { refresh } from "next/cache";
import { db } from "@/core/db";
import {
  validateAdminProductCategoryLinks,
  validateAdminProductCharacteristics,
  validateAdminProductInput,
  validateAdminProductRelatedProducts,
  type AdminProductInputErrorCode,
} from "@/entities/product";
import {
  AdminProductEditorServiceError,
  updateProductAvailability,
  updateProductCategories,
  updateProductCharacteristics,
  updateProductGeneral,
  updateProductInventory,
  archiveProductOptionColorValue,
  createProductOptionColorValue,
  updateProductOptionColorHex,
  updateProductPrices,
  updateProductRelatedProducts,
  updateProductSeo,
} from "../services";
import {
  productAvailabilityFormInitialState,
  productCategoriesFormInitialState,
  productCharacteristicsFormInitialState,
  productGeneralFormInitialState,
  productInventoryFormInitialState,
  productPricingFormInitialState,
  productRelatedProductsFormInitialState,
  productSeoFormInitialState,
  type ProductAvailabilityFormAction,
  type ProductAvailabilityRowInput,
  type ProductCategoriesFormAction,
  type ProductCharacteristicsFormAction,
  type ProductGeneralFormAction,
  type ProductInventoryFormAction,
  type ProductInventoryRowInput,
  type ProductPricingFormAction,
  type ProductRelatedProductsFormAction,
  type ProductSeoFormAction,
  type ProductSeoFormState,
} from "../types";
import { priceEntrySchema, productSeoFormSchema } from "../schemas";
import type { AdminProductActionResult } from "@/features/admin/products/types";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

// ---------------------------------------------------------------------------
// updateProductAvailabilityAction
// ---------------------------------------------------------------------------

function getString(formData: FormData, key: string): FormDataEntryValue | null {
  return formData.get(key);
}

function getAll(formData: FormData, key: string): FormDataEntryValue[] {
  return formData.getAll(key);
}

function buildMap(formData: FormData, prefix: string): Record<string, FormDataEntryValue | null> {
  const result: Record<string, FormDataEntryValue | null> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(prefix)) {
      continue;
    }

    result[key.slice(prefix.length)] = value;
  }

  return result;
}

function normalizeDateTime(value: FormDataEntryValue | null | undefined): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeBoolean(value: FormDataEntryValue | null | undefined): boolean {
  return value === "true" || value === "on" || value === "1";
}

function normalizeStatus(
  value: FormDataEntryValue | null | undefined
): ProductAvailabilityRowInput["status"] | null {
  if (value === "available") return "available";
  if (value === "unavailable") return "unavailable";
  if (value === "preorder") return "preorder";
  if (value === "backorder") return "backorder";
  if (value === "discontinued") return "discontinued";
  if (value === "archived") return "archived";
  return null;
}

export const updateProductAvailabilityAction: ProductAvailabilityFormAction = async (
  _prevState,
  formData
) => {
  const [allowScheduledAvailability, allowPreorderAvailability] = await Promise.all([
    meetsFeatureLevel("catalog.products.availability", "scheduling"),
    meetsFeatureLevel("catalog.products.availability", "preorder"),
  ]);
  const productIdValue = getString(formData, "productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productAvailabilityFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const variantIds = getAll(formData, "availabilityVariantIds")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (variantIds.length === 0) {
    return {
      ...productAvailabilityFormInitialState,
      status: "error",
      message: "Aucune variante à mettre à jour.",
    };
  }

  const statuses = buildMap(formData, "availabilityStatus:");
  const isSellableMap = buildMap(formData, "availabilityIsSellable:");
  const backorderAllowedMap = buildMap(formData, "availabilityBackorderAllowed:");
  const sellableFromMap = buildMap(formData, "availabilitySellableFrom:");
  const sellableUntilMap = buildMap(formData, "availabilitySellableUntil:");
  const preorderStartsAtMap = buildMap(formData, "availabilityPreorderStartsAt:");
  const preorderEndsAtMap = buildMap(formData, "availabilityPreorderEndsAt:");

  const rows: ProductAvailabilityRowInput[] = [];

  for (const variantId of variantIds) {
    const status = normalizeStatus(statuses[variantId]);

    if (status === null) {
      return {
        ...productAvailabilityFormInitialState,
        status: "error",
        message: "Données de disponibilité invalides.",
      };
    }

    const sellableFrom = normalizeDateTime(sellableFromMap[variantId]);
    const sellableUntil = normalizeDateTime(sellableUntilMap[variantId]);
    const preorderStartsAt = normalizeDateTime(preorderStartsAtMap[variantId]);
    const preorderEndsAt = normalizeDateTime(preorderEndsAtMap[variantId]);

    if (!allowScheduledAvailability && (sellableFrom !== null || sellableUntil !== null)) {
      return {
        ...productAvailabilityFormInitialState,
        status: "error",
        message: "Le niveau disponibilité actuel n'autorise pas les fenêtres de vente.",
      };
    }

    if (
      !allowPreorderAvailability &&
      (status === "preorder" || preorderStartsAt !== null || preorderEndsAt !== null)
    ) {
      return {
        ...productAvailabilityFormInitialState,
        status: "error",
        message: "Le niveau disponibilité actuel n'autorise pas la précommande.",
      };
    }

    rows.push({
      variantId,
      status,
      isSellable: normalizeBoolean(isSellableMap[variantId]),
      backorderAllowed: normalizeBoolean(backorderAllowedMap[variantId]),
      sellableFrom,
      sellableUntil,
      preorderStartsAt,
      preorderEndsAt,
    });
  }

  try {
    await updateProductAvailability({
      productId: productIdValue.trim(),
      rows,
    });

    refresh();

    return {
      ...productAvailabilityFormInitialState,
      status: "success",
      message: "Disponibilité mise à jour.",
    };
  } catch (error) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        ...productAvailabilityFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      ...productAvailabilityFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};

// ---------------------------------------------------------------------------
// updateProductCategoriesAction
// ---------------------------------------------------------------------------

function buildCategorySortOrders(formData: FormData): Record<string, FormDataEntryValue | null> {
  const result: Record<string, FormDataEntryValue | null> = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("categorySortOrder:")) {
      result[key.slice("categorySortOrder:".length)] = value;
    }
  }

  return result;
}

export const updateProductCategoriesAction: ProductCategoriesFormAction = async (
  _prevState,
  formData
) => {
  const productIdValue = getString(formData, "productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productCategoriesFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const validated = validateAdminProductCategoryLinks({
    categoryIds: getAll(formData, "categoryIds"),
    categoryPrimaryIds: getAll(formData, "categoryPrimaryIds"),
    categorySortOrders: buildCategorySortOrders(formData),
  });

  if (!validated.ok) {
    return {
      ...productCategoriesFormInitialState,
      status: "error",
      message: "Données invalides.",
    };
  }

  try {
    await updateProductCategories({
      productId: productIdValue.trim(),
      links: validated.data,
    });

    refresh();

    return {
      ...productCategoriesFormInitialState,
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        ...productCategoriesFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      ...productCategoriesFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};

// ---------------------------------------------------------------------------
// updateProductCharacteristicsAction
// ---------------------------------------------------------------------------

function collectCharacteristicIndexes(formData: FormData): number[] {
  const indexes = new Set<number>();

  for (const key of formData.keys()) {
    const match = /^characteristicLabel:(\d+)$/.exec(key);

    if (!match) {
      continue;
    }

    indexes.add(Number.parseInt(match[1]!, 10));
  }

  return [...indexes].sort((left, right) => left - right);
}

function getSectionValidationErrorMessage(code: string): string {
  switch (code) {
    case "too_many_characteristics":
      return "Vous pouvez enregistrer jusqu'à 20 caractéristiques maximum.";
    default:
      return "Certaines lignes contiennent des erreurs.";
  }
}

function getRowValidationErrorMessage(code: string): string {
  switch (code) {
    case "missing_label":
      return "Libellé requis.";
    case "missing_value":
      return "Valeur requise.";
    case "label_too_long":
      return "80 caractères maximum.";
    case "value_too_long":
      return "220 caractères maximum.";
    default:
      return "Valeur invalide.";
  }
}

export const updateProductCharacteristicsAction: ProductCharacteristicsFormAction = async (
  _prevState,
  formData
) => {
  const productIdValue = formData.get("productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productCharacteristicsFormInitialState,
      status: "error",
      message: "Produit introuvable.",
      fieldErrors: {
        productId: "Produit introuvable.",
      },
      rowErrors: {},
    };
  }

  const indexes = collectCharacteristicIndexes(formData);
  const rawCharacteristics = indexes.map((index) => ({
    label: formData.get(`characteristicLabel:${index}`),
    value: formData.get(`characteristicValue:${index}`),
  }));

  const validated = validateAdminProductCharacteristics({
    characteristics: rawCharacteristics,
  });

  if (!validated.ok) {
    const rowErrors: Record<number, Partial<Record<"label" | "value", string>>> = {};

    for (const issue of validated.issues) {
      rowErrors[issue.index] = {
        ...(rowErrors[issue.index] ?? {}),
        [issue.field]: getRowValidationErrorMessage(issue.code),
      };
    }

    return {
      ...productCharacteristicsFormInitialState,
      status: "error",
      message: getSectionValidationErrorMessage(validated.code),
      fieldErrors:
        validated.code === "too_many_characteristics"
          ? { characteristics: getSectionValidationErrorMessage(validated.code) }
          : {},
      rowErrors,
    };
  }

  try {
    await updateProductCharacteristics({
      productId: productIdValue.trim(),
      characteristics: validated.data,
    });

    refresh();

    return {
      ...productCharacteristicsFormInitialState,
      status: "success",
      message: "Caractéristiques mises à jour.",
      fieldErrors: {},
      rowErrors: {},
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        ...productCharacteristicsFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
        fieldErrors: {},
        rowErrors: {},
      };
    }

    return {
      ...productCharacteristicsFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
      fieldErrors: {},
      rowErrors: {},
    };
  }
};

// ---------------------------------------------------------------------------
// updateProductGeneralAction
// ---------------------------------------------------------------------------

function getOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0 || trimmed === "__none__") {
    return null;
  }

  return trimmed;
}

function mapValidationErrorToField(
  code: string
): keyof typeof productGeneralFormInitialState.fieldErrors | null {
  switch (code) {
    case "missing_name":
      return "name";
    case "missing_slug":
    case "invalid_slug":
      return "slug";
    case "short_description_too_long":
      return "shortDescription";
    case "invalid_status":
      return "status";
    case "invalid_product_type_id":
      return "productTypeId";
    default:
      return null;
  }
}

function getGeneralValidationErrorMessage(code: string): string {
  switch (code) {
    case "short_description_too_long":
      return "La description courte est trop longue (220 caractères max en texte visible).";
    default:
      return "Valeur invalide.";
  }
}

export const updateProductGeneralAction: ProductGeneralFormAction = async (
  _prevState,
  formData
) => {
  const productIdValue = getString(formData, "productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productGeneralFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const validated = validateAdminProductInput({
    name: getString(formData, "name"),
    slug: getString(formData, "slug"),
    skuRoot: getString(formData, "skuRoot"),
    marketingHook: getString(formData, "marketingHook"),
    shortDescription: getString(formData, "shortDescription"),
    description: getString(formData, "description"),
    careInstructions: getString(formData, "careInstructions"),
    productTypeId: getOptionalString(formData, "productTypeId"),
    primaryImageMediaAssetId: null,
    status: getOptionalString(formData, "status"),
    isFeatured: getOptionalString(formData, "isFeatured"),
    isStandalone: null,
    categoryIds: undefined,
    categoryPrimaryIds: undefined,
    categorySortOrders: {},
    relatedProductIds: undefined,
    relatedProductTypes: {},
    relatedProductSortOrders: {},
  });

  if (!validated.ok) {
    const field = mapValidationErrorToField(validated.code);

    return {
      ...productGeneralFormInitialState,
      status: "error",
      message: "Données invalides.",
      fieldErrors: field ? { [field]: getGeneralValidationErrorMessage(validated.code) } : {},
    };
  }

  try {
    const result = await updateProductGeneral({
      productId: productIdValue.trim(),
      name: validated.data.name,
      slug: validated.data.slug,
      skuRoot: validated.data.skuRoot,
      marketingHook: validated.data.marketingHook,
      shortDescription: validated.data.shortDescription,
      description: validated.data.description,
      careInstructions: validated.data.careInstructions,
      status: validated.data.status,
      isFeatured: validated.data.isFeatured,
      productTypeId: validated.data.productTypeId,
    });

    refresh();

    return {
      ...productGeneralFormInitialState,
      status: "success",
      message: result.wasConvertedToVariable
        ? "Ce produit utilise maintenant des variantes. Une variante initiale existe déjà dans l'onglet Variantes — vous pouvez la renommer ou la compléter si nécessaire."
        : "Mise à jour effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "missing_product_sku_root") {
        return {
          ...productGeneralFormInitialState,
          status: "error",
          message: "Renseignez une référence produit (SKU) pour un produit simple.",
          fieldErrors: {
            skuRoot: "Le SKU produit est requis tant que le produit n'utilise pas de variantes.",
          },
        };
      }

      if (error.code === "product_has_multiple_variants") {
        return {
          ...productGeneralFormInitialState,
          status: "error",
          message:
            "Ce produit possède plusieurs variantes non archivées. Archivez les variantes supplémentaires avant de le convertir en produit simple.",
        };
      }

      return {
        ...productGeneralFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      ...productGeneralFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};

// ---------------------------------------------------------------------------
// updateProductInventoryAction
// ---------------------------------------------------------------------------

function normalizeNonNegativeInteger(value: FormDataEntryValue | null | undefined): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

const INVALID_OPTIONAL_INTEGER = Symbol("invalid-optional-integer");

/**
 * Parse un champ optionnel "entier positif ou nul" : chaîne vide → `null`
 * (efface le seuil, comportement par défaut), entier positif/nul → valeur,
 * tout autre contenu → `INVALID_OPTIONAL_INTEGER` (erreur de validation).
 */
function normalizeOptionalNonNegativeInteger(
  value: FormDataEntryValue | null | undefined
): number | null | typeof INVALID_OPTIONAL_INTEGER {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return INVALID_OPTIONAL_INTEGER;
  }

  return parsed;
}

export const updateProductInventoryAction: ProductInventoryFormAction = async (
  _prevState,
  formData
) => {
  const productIdValue = getString(formData, "productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productInventoryFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const variantIds = getAll(formData, "inventoryVariantIds")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (variantIds.length === 0) {
    return {
      ...productInventoryFormInitialState,
      status: "error",
      message: "Aucune variante à mettre à jour.",
    };
  }

  const onHandMap = buildMap(formData, "inventoryOnHand:");
  const lowStockThresholdMap = buildMap(formData, "inventoryLowStockThreshold:");

  const rows: ProductInventoryRowInput[] = [];

  for (const variantId of variantIds) {
    const onHandQuantity = normalizeNonNegativeInteger(onHandMap[variantId]);

    if (onHandQuantity === null) {
      return {
        ...productInventoryFormInitialState,
        status: "error",
        message: "La quantité de stock doit être un entier positif ou nul.",
      };
    }

    const row: ProductInventoryRowInput = {
      variantId,
      onHandQuantity,
    };

    if (variantId in lowStockThresholdMap) {
      const lowStockThreshold = normalizeOptionalNonNegativeInteger(lowStockThresholdMap[variantId]);

      if (lowStockThreshold === INVALID_OPTIONAL_INTEGER) {
        return {
          ...productInventoryFormInitialState,
          status: "error",
          message: "Le seuil de stock faible doit être un entier positif ou nul.",
        };
      }

      row.lowStockThreshold = lowStockThreshold;
    }

    rows.push(row);
  }

  try {
    await updateProductInventory({
      productId: productIdValue.trim(),
      rows,
    });

    refresh();

    return {
      ...productInventoryFormInitialState,
      status: "success",
      message: "Stock mis à jour.",
    };
  } catch (error) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        ...productInventoryFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      ...productInventoryFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};

// ---------------------------------------------------------------------------
// Option color value actions
// ---------------------------------------------------------------------------

type ColorValueBaseInput = {
  productId: string;
  colorHex: string | null;
};

export type CreateProductOptionColorValueInput = ColorValueBaseInput & {
  optionId: string;
  label: string;
};

export type UpdateProductOptionColorValueInput = ColorValueBaseInput & {
  optionValueId: string;
  label: string;
};

export type ArchiveProductOptionColorValueInput = {
  productId: string;
  optionValueId: string;
};

function normalizeColorHex(value: string | null): string | null | undefined {
  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
    return undefined;
  }

  return trimmed.toUpperCase();
}

function ensureNonEmpty(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

async function canManageVariantOptions() {
  return meetsFeatureLevel("catalog.products.variants", "options");
}

async function resolvePricingAccess(productId: string) {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { storeId: true },
  });

  if (product === null) {
    return null;
  }

  const [canManagePriceLists, canManageScheduledPricing, priceLists] = await Promise.all([
    meetsFeatureLevel("catalog.products.pricing", "price-lists"),
    meetsFeatureLevel("catalog.products.pricing", "scheduled-pricing"),
    db.priceList.findMany({
      where: { storeId: product.storeId, archivedAt: null },
      select: { id: true, isDefault: true },
    }),
  ]);

  return {
    canManagePriceLists,
    canManageScheduledPricing,
    defaultPriceListIds: new Set(
      priceLists.filter((priceList) => priceList.isDefault).map((priceList) => priceList.id)
    ),
    priceListIds: new Set(priceLists.map((priceList) => priceList.id)),
  };
}

export async function createProductOptionColorValueAction(
  input: CreateProductOptionColorValueInput
): Promise<AdminProductActionResult> {
  if (!(await canManageVariantOptions())) {
    return { status: "error", message: "Niveau variantes insuffisant." };
  }

  const productId = ensureNonEmpty(input.productId);
  const optionId = ensureNonEmpty(input.optionId);
  const label = ensureNonEmpty(input.label);
  const colorHex = normalizeColorHex(input.colorHex);

  if (!productId) {
    return { status: "error", message: "Produit introuvable." };
  }
  if (!optionId) {
    return { status: "error", message: "Option couleur introuvable." };
  }
  if (!label) {
    return { status: "error", message: "Le libellé est requis." };
  }
  if (colorHex === undefined) {
    return { status: "error", message: "Code couleur invalide. Utilisez #RGB ou #RRGGBB." };
  }

  try {
    await createProductOptionColorValue({
      productId,
      optionId,
      label,
      colorHex,
    });
    refresh();
    return { status: "success", message: "Couleur créée." };
  } catch (error) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "option_value_label_taken") {
        return { status: "error", message: "Ce libellé existe déjà pour cette option." };
      }
    }
    return { status: "error", message: "Création impossible." };
  }
}

export async function updateProductOptionColorValueAction(
  input: UpdateProductOptionColorValueInput
): Promise<AdminProductActionResult> {
  if (!(await canManageVariantOptions())) {
    return { status: "error", message: "Niveau variantes insuffisant." };
  }

  const productId = ensureNonEmpty(input.productId);
  const optionValueId = ensureNonEmpty(input.optionValueId);
  const label = ensureNonEmpty(input.label);
  const colorHex = normalizeColorHex(input.colorHex);

  if (!productId) {
    return { status: "error", message: "Produit introuvable." };
  }
  if (!optionValueId) {
    return { status: "error", message: "Valeur couleur introuvable." };
  }
  if (!label) {
    return { status: "error", message: "Le libellé est requis." };
  }
  if (colorHex === undefined) {
    return { status: "error", message: "Code couleur invalide. Utilisez #RGB ou #RRGGBB." };
  }

  try {
    await updateProductOptionColorHex({
      productId,
      optionValueId,
      label,
      colorHex,
    });
    refresh();
    return { status: "success", message: "Couleur enregistrée." };
  } catch (error) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "option_value_label_taken") {
        return { status: "error", message: "Ce libellé existe déjà pour cette option." };
      }
      if (error.code === "option_values_invalid") {
        return { status: "error", message: "Valeur d'option invalide pour ce produit." };
      }
    }
    return { status: "error", message: "Mise à jour impossible." };
  }
}

export async function archiveProductOptionColorValueAction(
  input: ArchiveProductOptionColorValueInput
): Promise<AdminProductActionResult> {
  if (!(await canManageVariantOptions())) {
    return { status: "error", message: "Niveau variantes insuffisant." };
  }

  const productId = ensureNonEmpty(input.productId);
  const optionValueId = ensureNonEmpty(input.optionValueId);

  if (!productId) {
    return { status: "error", message: "Produit introuvable." };
  }
  if (!optionValueId) {
    return { status: "error", message: "Valeur couleur introuvable." };
  }

  try {
    await archiveProductOptionColorValue({
      productId,
      optionValueId,
    });
    refresh();
    return { status: "success", message: "Couleur archivée." };
  } catch (error) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "option_value_in_use") {
        return {
          status: "error",
          message: "Suppression impossible: cette couleur est encore utilisée par des variantes.",
        };
      }
      if (error.code === "option_values_invalid") {
        return { status: "error", message: "Valeur d'option invalide pour ce produit." };
      }
    }
    return { status: "error", message: "Suppression impossible." };
  }
}

// ---------------------------------------------------------------------------
// updateProductPricesAction
// ---------------------------------------------------------------------------

export const updateProductPricesAction: ProductPricingFormAction = async (_prevState, formData) => {
  const productIdValue = formData.get("productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productPricingFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }
  const pricingAccess = await resolvePricingAccess(productIdValue.trim());

  if (pricingAccess === null) {
    return {
      ...productPricingFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const priceListIds: string[] = [];
  for (const key of formData.keys()) {
    if (key.startsWith("amount:")) {
      const priceListId = key.slice("amount:".length);
      if (priceListId.trim().length > 0) {
        priceListIds.push(priceListId);
      }
    }
  }

  if (
    !pricingAccess.canManagePriceLists &&
    priceListIds.some((priceListId) => !pricingAccess.defaultPriceListIds.has(priceListId))
  ) {
    return {
      ...productPricingFormInitialState,
      status: "error",
      message: "Le niveau tarifaire actuel n'autorise pas les grilles avancées.",
    };
  }

  const fieldErrors: Record<string, string> = {};
  const prices: {
    priceListId: string;
    amount: number;
    compareAtAmount: number | null;
    costAmount: string | null;
    startsAt: string | null;
    endsAt: string | null;
  }[] = [];
  const toArchive: string[] = [];

  for (const priceListId of priceListIds) {
    if (!pricingAccess.priceListIds.has(priceListId)) {
      return {
        ...productPricingFormInitialState,
        status: "error",
        message: "Liste de prix invalide.",
      };
    }

    const rawAmount = formData.get(`amount:${priceListId}`);
    if (typeof rawAmount !== "string" || rawAmount.trim().length === 0) {
      toArchive.push(priceListId);
      continue;
    }
    const rawCompareAtAmount = formData.get(`compareAtAmount:${priceListId}`);
    const rawCostAmount = formData.get(`costAmount:${priceListId}`);
    const rawStartsAt = formData.get(`startsAt:${priceListId}`);
    const rawEndsAt = formData.get(`endsAt:${priceListId}`);

    if (
      !pricingAccess.canManageScheduledPricing &&
      ((typeof rawStartsAt === "string" && rawStartsAt.trim().length > 0) ||
        (typeof rawEndsAt === "string" && rawEndsAt.trim().length > 0))
    ) {
      return {
        ...productPricingFormInitialState,
        status: "error",
        message: "Le niveau tarifaire actuel n'autorise pas les périodes promotionnelles.",
      };
    }

    const parsed = priceEntrySchema.safeParse({
      priceListId,
      amount: rawAmount,
      compareAtAmount:
        typeof rawCompareAtAmount === "string" && rawCompareAtAmount.trim().length > 0
          ? rawCompareAtAmount.trim()
          : null,
      costAmount:
        typeof rawCostAmount === "string" && rawCostAmount.trim().length > 0
          ? rawCostAmount.trim()
          : null,
      startsAt:
        typeof rawStartsAt === "string" && rawStartsAt.trim().length > 0
          ? rawStartsAt.trim()
          : null,
      endsAt:
        typeof rawEndsAt === "string" && rawEndsAt.trim().length > 0 ? rawEndsAt.trim() : null,
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field =
          issue.path.length > 0
            ? `${String(issue.path[0])}:${priceListId}`
            : `price:${priceListId}`;
        fieldErrors[field] = issue.message;
      }
      continue;
    }

    prices.push({
      priceListId: parsed.data.priceListId,
      amount: parsed.data.amount,
      compareAtAmount: parsed.data.compareAtAmount ?? null,
      costAmount: parsed.data.costAmount ?? null,
      startsAt: parsed.data.startsAt ?? null,
      endsAt: parsed.data.endsAt ?? null,
    });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ...productPricingFormInitialState,
      status: "error",
      message: "Vérifiez les montants et les dates.",
      fieldErrors,
    };
  }

  try {
    await updateProductPrices({
      productId: productIdValue.trim(),
      prices,
      toArchive,
    });

    return {
      ...productPricingFormInitialState,
      status: "success",
      message: "Tarification mise à jour.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        ...productPricingFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      ...productPricingFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};

// ---------------------------------------------------------------------------
// updateProductRelatedProductsAction
// ---------------------------------------------------------------------------

function buildRelatedTypes(formData: FormData): Record<string, FormDataEntryValue | null> {
  const result: Record<string, FormDataEntryValue | null> = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("relatedProductType:")) {
      result[key.slice("relatedProductType:".length)] = value;
    }
  }

  return result;
}

function buildRelatedSortOrders(formData: FormData): Record<string, FormDataEntryValue | null> {
  const result: Record<string, FormDataEntryValue | null> = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("relatedProductSortOrder:")) {
      result[key.slice("relatedProductSortOrder:".length)] = value;
    }
  }

  return result;
}

function getRelatedValidationErrorMessage(code: AdminProductInputErrorCode): string {
  switch (code) {
    case "invalid_related_products":
      return "Liste de produits liés invalide.";
    case "invalid_related_product_type":
      return "Type de relation invalide.";
    case "invalid_related_product_sort_order":
      return "Ordre d'affichage invalide.";
    case "duplicate_related_product":
      return "Un même produit ne peut être lié qu'une seule fois.";
    default:
      return "Données invalides.";
  }
}

export const updateProductRelatedProductsAction: ProductRelatedProductsFormAction = async (
  _prevState,
  formData
) => {
  if (!(await meetsFeatureLevel("catalog.products.related", "manage"))) {
    return {
      ...productRelatedProductsFormInitialState,
      status: "error",
      message: "Niveau produits liés insuffisant pour cette action.",
    };
  }

  const productIdValue = getString(formData, "productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productRelatedProductsFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const validated = validateAdminProductRelatedProducts({
    relatedProductIds: getAll(formData, "relatedProductIds"),
    relatedProductTypes: buildRelatedTypes(formData),
    relatedProductSortOrders: buildRelatedSortOrders(formData),
  });

  if (!validated.ok) {
    return {
      ...productRelatedProductsFormInitialState,
      status: "error",
      message: getRelatedValidationErrorMessage(validated.code),
    };
  }

  try {
    await updateProductRelatedProducts({
      productId: productIdValue.trim(),
      relatedProducts: validated.data,
    });

    refresh();

    return {
      ...productRelatedProductsFormInitialState,
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        ...productRelatedProductsFormInitialState,
        status: "error",
        message:
          error.code === "related_product_missing"
            ? "Un produit lié est introuvable, archivé ou hors boutique."
            : "Mise à jour impossible.",
      };
    }

    return {
      ...productRelatedProductsFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};

// ---------------------------------------------------------------------------
// updateProductSeoAction
// ---------------------------------------------------------------------------

function mapZodFieldErrors(
  errors: Record<string, string[] | undefined>
): ProductSeoFormState["fieldErrors"] {
  const result: ProductSeoFormState["fieldErrors"] = {};

  for (const [key, messages] of Object.entries(errors)) {
    const message = messages?.[0];
    if (!message) continue;
    result[key as keyof ProductSeoFormState["fieldErrors"]] = message;
  }

  return result;
}

export const updateProductSeoAction: ProductSeoFormAction = async (_prevState, formData) => {
  const parsed = productSeoFormSchema.safeParse({
    productId: formData.get("productId"),
    title: formData.get("title"),
    description: formData.get("description"),
    canonicalPath: formData.get("canonicalPath"),
    indexingMode: formData.get("indexingMode"),
    sitemapIncluded: formData.get("sitemapIncluded"),
    openGraphTitle: formData.get("openGraphTitle"),
    openGraphDescription: formData.get("openGraphDescription"),
    openGraphImageId: formData.get("openGraphImageId"),
    twitterTitle: formData.get("twitterTitle"),
    twitterDescription: formData.get("twitterDescription"),
    twitterImageId: formData.get("twitterImageId"),
  });

  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const fieldErrors = mapZodFieldErrors(flattened.fieldErrors);

    return {
      ...productSeoFormInitialState,
      status: "error",
      message: flattened.formErrors[0] ?? "Données invalides.",
      fieldErrors,
    };
  }

  try {
    await updateProductSeo({
      productId: parsed.data.productId,
      title: parsed.data.title,
      description: parsed.data.description,
      canonicalPath: parsed.data.canonicalPath,
      indexingMode: parsed.data.indexingMode,
      sitemapIncluded: parsed.data.sitemapIncluded === "true",
      openGraphTitle: parsed.data.openGraphTitle,
      openGraphDescription: parsed.data.openGraphDescription,
      openGraphImageId: parsed.data.openGraphImageId,
      twitterTitle: parsed.data.twitterTitle,
      twitterDescription: parsed.data.twitterDescription,
      twitterImageId: parsed.data.twitterImageId,
    });
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "media_asset_missing") {
        return {
          ...productSeoFormInitialState,
          status: "error",
          message: "L'image de partage sélectionnée est introuvable ou non exploitable.",
          fieldErrors: {
            openGraphImageId: "Image invalide.",
            twitterImageId: "Image invalide.",
          },
        };
      }
    }

    return {
      ...productSeoFormInitialState,
      status: "error",
      message: "Une erreur est survenue lors de la mise à jour des paramètres SEO.",
    };
  }

  return {
    ...productSeoFormInitialState,
    status: "success",
    message: "Paramètres SEO mis à jour.",
  };
};
