"use server";

import { validateAdminProductInput } from "@/entities/product";
import {
  productCategoriesFormInitialState,
  type ProductCategoriesFormAction,
} from "../types/product-categories-form.types";
import {
  AdminProductEditorServiceError,
  updateProductCategories,
} from "../services";

function getString(formData: FormData, key: string): FormDataEntryValue | null {
  return formData.get(key);
}

function getAll(formData: FormData, key: string): FormDataEntryValue[] {
  return formData.getAll(key);
}

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

  const validated = validateAdminProductInput({
    name: "placeholder",
    slug: "placeholder",
    skuRoot: null,
    shortDescription: null,
    description: null,
    productTypeId: null,
    primaryImageMediaAssetId: null,
    status: "draft",
    isFeatured: null,
    isStandalone: null,
    categoryIds: getAll(formData, "categoryIds"),
    categoryPrimaryIds: getAll(formData, "categoryPrimaryIds"),
    categorySortOrders: buildCategorySortOrders(formData),
    relatedProductIds: [],
    relatedProductTypes: {},
    relatedProductSortOrders: {},
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
      links: validated.data.categoryLinks,
    });

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
