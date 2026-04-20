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
      fieldErrors: field ? { [field]: "Valeur invalide." } : {},
    };
  }

  try {
    const result = await updateProductGeneral({
      productId: productIdValue.trim(),
      name: validated.data.name,
      slug: validated.data.slug,
      skuRoot: validated.data.skuRoot,
      shortDescription: validated.data.shortDescription,
      description: validated.data.description,
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
