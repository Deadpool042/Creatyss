"use server";

import { refresh } from "next/cache";
import { validateAdminProductVariantInput } from "@/entities/product";
import {
  productVariantFormInitialState,
  type ProductVariantFormAction,
} from "../types/product-variants.types";
import {
  AdminProductEditorServiceError,
  createProductVariant,
} from "../services";

function getField(formData: FormData, key: string): FormDataEntryValue | null {
  return formData.get(key);
}

export const createProductVariantAction: ProductVariantFormAction = async (
  _prevState,
  formData
) => {
  const productIdValue = getField(formData, "productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productVariantFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const validated = validateAdminProductVariantInput({
    sku: getField(formData, "sku"),
    slug: getField(formData, "slug"),
    name: getField(formData, "name"),
    primaryImageMediaAssetId: getField(formData, "primaryImageId"),
    status: getField(formData, "status"),
    isDefault: getField(formData, "isDefault"),
    sortOrder: getField(formData, "sortOrder"),
    barcode: getField(formData, "barcode"),
    externalReference: getField(formData, "externalReference"),
    weightGrams: getField(formData, "weightGrams"),
    widthMm: getField(formData, "widthMm"),
    heightMm: getField(formData, "heightMm"),
    depthMm: getField(formData, "depthMm"),
  });

  if (!validated.ok) {
    return {
      ...productVariantFormInitialState,
      status: "error",
      message: "Données invalides.",
    };
  }

  const optionValueIds: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (
      key.startsWith("optionValue:") &&
      typeof value === "string" &&
      value.trim().length > 0 &&
      value.trim() !== "__none__"
    ) {
      optionValueIds.push(value.trim());
    }
  }

  try {
    await createProductVariant({
      productId: productIdValue.trim(),
      sku: validated.data.sku,
      slug: validated.data.slug,
      name: validated.data.name,
      primaryImageId: validated.data.primaryImageMediaAssetId,
      status: validated.data.status,
      isDefault: validated.data.isDefault,
      sortOrder: validated.data.sortOrder,
      barcode: validated.data.barcode,
      externalReference: validated.data.externalReference,
      weightGrams: validated.data.weightGrams,
      widthMm: validated.data.widthMm,
      heightMm: validated.data.heightMm,
      depthMm: validated.data.depthMm,
      optionValueIds,
    });

    refresh();

    return {
      ...productVariantFormInitialState,
      status: "success",
      message: "Création effectuée.",
    };
  } catch (error) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "option_values_invalid") {
        return {
          ...productVariantFormInitialState,
          status: "error",
          message: "Attributs invalides.",
          fieldErrors: { optionValues: "Les valeurs d'option sélectionnées sont invalides ou incohérentes avec ce produit." },
        };
      }

      return {
        ...productVariantFormInitialState,
        status: "error",
        message: "Création impossible.",
      };
    }

    return {
      ...productVariantFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};
