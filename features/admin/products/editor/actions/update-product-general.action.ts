"use server";

import { refresh } from "next/cache";
import { validateAdminProductInput } from "@/entities/product";
import {
  productGeneralFormInitialState,
  type ProductGeneralFormAction,
} from "../types/product-general-form.types";
import { AdminProductEditorServiceError, updateProductGeneral } from "../services";

function getString(formData: FormData, key: string): FormDataEntryValue | null {
  return formData.get(key);
}

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

function getAll(formData: FormData, key: string): FormDataEntryValue[] {
  return formData.getAll(key);
}

function buildCategorySortOrders(formData: FormData): Record<string, FormDataEntryValue | null> {
  const result: Record<string, FormDataEntryValue | null> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("categorySortOrder:")) {
      continue;
    }

    const categoryId = key.slice("categorySortOrder:".length);
    result[categoryId] = value;
  }

  return result;
}

function buildRelatedTypes(formData: FormData): Record<string, FormDataEntryValue | null> {
  const result: Record<string, FormDataEntryValue | null> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("relatedProductType:")) {
      continue;
    }

    const productId = key.slice("relatedProductType:".length);
    result[productId] = value;
  }

  return result;
}

function buildRelatedSortOrders(formData: FormData): Record<string, FormDataEntryValue | null> {
  const result: Record<string, FormDataEntryValue | null> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("relatedProductSortOrder:")) {
      continue;
    }

    const productId = key.slice("relatedProductSortOrder:".length);
    result[productId] = value;
  }

  return result;
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
    case "invalid_status":
      return "status";
    case "invalid_product_type_id":
      return "productTypeId";
    case "invalid_primary_image":
      return "primaryImageId";
    default:
      return null;
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
    shortDescription: getString(formData, "shortDescription"),
    description: getString(formData, "description"),
    productTypeId: getOptionalString(formData, "productTypeId"),
    primaryImageMediaAssetId: getOptionalString(formData, "primaryImageId"),
    status: getOptionalString(formData, "status"),
    isFeatured: getOptionalString(formData, "isFeatured"),
    isStandalone: null,
    categoryIds: getAll(formData, "categoryIds"),
    categoryPrimaryIds: getAll(formData, "categoryPrimaryIds"),
    categorySortOrders: buildCategorySortOrders(formData),
    relatedProductIds: getAll(formData, "relatedProductIds"),
    relatedProductTypes: buildRelatedTypes(formData),
    relatedProductSortOrders: buildRelatedSortOrders(formData),
  });

  if (!validated.ok) {
    const field = mapValidationErrorToField(validated.code);

    return {
      ...productGeneralFormInitialState,
      status: "error",
      message: "Données invalides.",
      fieldErrors: field ? { [field]: "Valeur invalide." } : {},
    };
  }

  try {
    await updateProductGeneral({
      productId: productIdValue.trim(),
      name: validated.data.name,
      slug: validated.data.slug,
      skuRoot: validated.data.skuRoot,
      shortDescription: validated.data.shortDescription,
      description: validated.data.description,
      status: validated.data.status,
      isFeatured: validated.data.isFeatured,
      productTypeId: validated.data.productTypeId,
      primaryImageId: validated.data.primaryImageMediaAssetId,
    });

    refresh();

    return {
      ...productGeneralFormInitialState,
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
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
