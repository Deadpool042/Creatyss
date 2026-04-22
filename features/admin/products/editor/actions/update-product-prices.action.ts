"use server";

import {
  productPricingFormInitialState,
  type ProductPricingFormAction,
} from "../types/product-pricing-form.types";
import { AdminProductEditorServiceError, updateProductPrices } from "../services";
import { priceEntrySchema } from "../schemas";

export const updateProductPricesAction: ProductPricingFormAction = async (_prevState, formData) => {
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

  const fieldErrors: Record<string, string> = {};
  const prices: {
    priceListId: string;
    amount: string;
    compareAtAmount: string | null;
    costAmount: string | null;
    startsAt: string | null;
    endsAt: string | null;
  }[] = [];
  const toArchive: string[] = [];

  for (const priceListId of priceListIds) {
    const rawAmount = formData.get(`amount:${priceListId}`);
    if (typeof rawAmount !== "string" || rawAmount.trim().length === 0) {
      toArchive.push(priceListId);
      continue;
    }
    const rawCompareAtAmount = formData.get(`compareAtAmount:${priceListId}`);
    const rawCostAmount = formData.get(`costAmount:${priceListId}`);
    const rawStartsAt = formData.get(`startsAt:${priceListId}`);
    const rawEndsAt = formData.get(`endsAt:${priceListId}`);

    const parsed = priceEntrySchema.safeParse({
      priceListId,
      amount: rawAmount,
      compareAtAmount:
        typeof rawCompareAtAmount === "string" && rawCompareAtAmount.trim().length > 0
          ? rawCompareAtAmount.trim()
          : null,
      costAmount:
        typeof rawCostAmount === "string" && rawCostAmount.trim().length > 0
          ? rawCostAmount.trim()
          : null,
      startsAt:
        typeof rawStartsAt === "string" && rawStartsAt.trim().length > 0
          ? rawStartsAt.trim()
          : null,
      endsAt:
        typeof rawEndsAt === "string" && rawEndsAt.trim().length > 0 ? rawEndsAt.trim() : null,
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field =
          issue.path.length > 0
            ? `${String(issue.path[0])}:${priceListId}`
            : `price:${priceListId}`;
        fieldErrors[field] = issue.message;
      }
      continue;
    }

    prices.push({
      priceListId: parsed.data.priceListId,
      amount: parsed.data.amount,
      compareAtAmount: parsed.data.compareAtAmount ?? null,
      costAmount: parsed.data.costAmount ?? null,
      startsAt: parsed.data.startsAt ?? null,
      endsAt: parsed.data.endsAt ?? null,
    });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ...productPricingFormInitialState,
      status: "error",
      message: "Vérifiez les dates de promotion.",
      fieldErrors,
    };
  }

  try {
    await updateProductPrices({
      productId: productIdValue.trim(),
      prices,
      toArchive,
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
