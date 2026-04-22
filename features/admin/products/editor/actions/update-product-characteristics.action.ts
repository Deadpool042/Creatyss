"use server";

import { refresh } from "next/cache";

import { AdminProductEditorServiceError } from "../services/shared";
import { updateProductCharacteristics } from "../services/update-product-characteristics.service";
import {
  productCharacteristicsFormInitialState,
  type ProductCharacteristicsFormAction,
} from "../types/product-characteristics-form.types";

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
    };
  }

  // Collect characteristic rows sent as:
  //   characteristicLabel:0, characteristicValue:0, characteristicSortOrder:0
  //   characteristicLabel:1, characteristicValue:1, characteristicSortOrder:1
  //   ...
  const characteristics: Array<{
    id: string | null;
    label: string;
    value: string;
    sortOrder: number;
  }> = [];

  let index = 0;

  while (true) {
    const label = formData.get(`characteristicLabel:${index}`);
    const value = formData.get(`characteristicValue:${index}`);
    const sortOrder = formData.get(`characteristicSortOrder:${index}`);
    const id = formData.get(`characteristicId:${index}`);

    if (label === null && value === null) {
      break;
    }

    const labelStr = typeof label === "string" ? label.trim() : "";
    const valueStr = typeof value === "string" ? value.trim() : "";

    // Skip rows where both label and value are empty
    if (labelStr.length === 0 && valueStr.length === 0) {
      index++;
      continue;
    }

    if (labelStr.length === 0 || valueStr.length === 0) {
      return {
        ...productCharacteristicsFormInitialState,
        status: "error",
        message: "Chaque caractéristique doit avoir un libellé et une valeur.",
      };
    }

    characteristics.push({
      id: typeof id === "string" && id.trim().length > 0 ? id.trim() : null,
      label: labelStr,
      value: valueStr,
      sortOrder: typeof sortOrder === "string" ? parseInt(sortOrder, 10) || index : index,
    });

    index++;
  }

  try {
    await updateProductCharacteristics({
      productId: productIdValue.trim(),
      characteristics,
    });

    refresh();

    return {
      ...productCharacteristicsFormInitialState,
      status: "success",
      message: "Caractéristiques mises à jour.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        ...productCharacteristicsFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      ...productCharacteristicsFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};
