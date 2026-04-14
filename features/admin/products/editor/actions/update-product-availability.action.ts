"use server";

import { refresh } from "next/cache";
import {
  productAvailabilityFormInitialState,
  type ProductAvailabilityFormAction,
  type ProductAvailabilityRowInput,
} from "../types/product-availability-form.types";
import {
  AdminProductEditorServiceError,
  updateProductAvailability,
} from "../services";

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
