"use server";

import { refresh } from "next/cache";
import {
  productInventoryFormInitialState,
  type ProductInventoryFormAction,
  type ProductInventoryRowInput,
} from "../types/product-inventory-form.types";
import { AdminProductEditorServiceError, updateProductInventory } from "../services";

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

    rows.push({
      variantId,
      onHandQuantity,
    });
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
