"use server";

import {
  productPricingFormInitialState,
  type ProductPricingFormAction,
} from "../types/product-pricing-form.types";
import {
  AdminProductEditorServiceError,
  updateProductPrices,
} from "../services";

export const updateProductPricesAction: ProductPricingFormAction = async (
  _prevState,
  formData
) => {
  const productIdValue = formData.get("productId");

  if (typeof productIdValue !== "string" || productIdValue.trim().length === 0) {
    return {
      ...productPricingFormInitialState,
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const priceListIds: string[] = [];
  for (const key of formData.keys()) {
    if (key.startsWith("amount:")) {
      const priceListId = key.slice("amount:".length);
      if (priceListId.trim().length > 0) {
        priceListIds.push(priceListId);
      }
    }
  }

  const prices = priceListIds
    .map((priceListId) => {
      const amount = formData.get(`amount:${priceListId}`);
      if (typeof amount !== "string" || amount.trim().length === 0) {
        return null;
      }
      const compareAtAmount = formData.get(`compareAtAmount:${priceListId}`);
      const costAmount = formData.get(`costAmount:${priceListId}`);
      return {
        priceListId,
        amount: amount.trim(),
        compareAtAmount:
          typeof compareAtAmount === "string" && compareAtAmount.trim().length > 0
            ? compareAtAmount.trim()
            : null,
        costAmount:
          typeof costAmount === "string" && costAmount.trim().length > 0
            ? costAmount.trim()
            : null,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  try {
    await updateProductPrices({
      productId: productIdValue.trim(),
      prices,
    });

    return {
      ...productPricingFormInitialState,
      status: "success",
      message: "Tarification mise à jour.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        ...productPricingFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      ...productPricingFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};
