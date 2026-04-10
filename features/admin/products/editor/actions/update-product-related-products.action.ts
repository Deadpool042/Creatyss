"use server";

import { validateAdminProductInput } from "@/entities/product";
import {
  AdminProductEditorServiceError,
  updateProductRelatedProducts,
} from "../services";

function getString(formData: FormData, key: string): FormDataEntryValue | null {
  return formData.get(key);
}

function getAll(formData: FormData, key: string): FormDataEntryValue[] {
  return formData.getAll(key);
}

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

export async function updateProductRelatedProductsAction(formData: FormData): Promise<{
  status: "success" | "error";
  message: string;
}> {
  const productIdValue = getString(formData, "productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
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
    categoryIds: [],
    categoryPrimaryIds: [],
    categorySortOrders: {},
    relatedProductIds: getAll(formData, "relatedProductIds"),
    relatedProductTypes: buildRelatedTypes(formData),
    relatedProductSortOrders: buildRelatedSortOrders(formData),
  });

  if (!validated.ok) {
    return {
      status: "error",
      message: "Données invalides.",
    };
  }

  try {
    await updateProductRelatedProducts({
      productId: productIdValue.trim(),
      relatedProducts: validated.data.relatedProducts,
    });

    return {
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}
