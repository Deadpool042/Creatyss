"use server";

import { refresh } from "next/cache";
import {
  AdminProductEditorServiceError,
  archiveProductOptionColorValue,
  createProductOptionColorValue,
  updateProductOptionColorHex,
} from "../services";
import type { AdminProductActionResult } from "@/features/admin/products/types";

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

export async function createProductOptionColorValueAction(
  input: CreateProductOptionColorValueInput
): Promise<AdminProductActionResult> {
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
