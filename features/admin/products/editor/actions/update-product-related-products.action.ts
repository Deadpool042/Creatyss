"use server";

import { refresh } from "next/cache";
import {
  validateAdminProductRelatedProducts,
  type AdminProductInputErrorCode,
} from "@/entities/product";
import { AdminProductEditorServiceError, updateProductRelatedProducts } from "../services";
import {
  productRelatedProductsFormInitialState,
  type ProductRelatedProductsFormAction,
} from "../types/product-related-products-form.types";

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

function getValidationErrorMessage(code: AdminProductInputErrorCode): string {
  switch (code) {
    case "invalid_related_products":
      return "Liste de produits liés invalide.";
    case "invalid_related_product_type":
      return "Type de relation invalide.";
    case "invalid_related_product_sort_order":
      return "Ordre d’affichage invalide.";
    case "duplicate_related_product":
      return "Un même produit ne peut être lié qu’une seule fois.";
    default:
      return "Données invalides.";
  }
}

export const updateProductRelatedProductsAction: ProductRelatedProductsFormAction = async (
  _prevState,
  formData
) => {
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
      message: getValidationErrorMessage(validated.code),
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
