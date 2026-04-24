"use server";

import { refresh } from "next/cache";
import { validateAdminProductCharacteristics } from "@/entities/product";

import { AdminProductEditorServiceError } from "../services/shared";
import { updateProductCharacteristics } from "../services/update-product-characteristics.service";
import {
  productCharacteristicsFormInitialState,
  type ProductCharacteristicsFormAction,
} from "../types/product-characteristics-form.types";

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
      return "Vous pouvez enregistrer jusqu’à 20 caractéristiques maximum.";
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
