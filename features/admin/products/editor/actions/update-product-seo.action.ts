"use server";

import { productSeoFormSchema } from "../schemas";
import {
  productSeoFormInitialState,
  type ProductSeoFormAction,
} from "../types";

export const updateProductSeoAction: ProductSeoFormAction = async (_prevState, formData) => {
  const parsed = productSeoFormSchema.safeParse({
    productId: formData.get("productId"),
    title: formData.get("title"),
    description: formData.get("description"),
    canonicalPath: formData.get("canonicalPath"),
    indexingMode: formData.get("indexingMode"),
    sitemapIncluded: formData.get("sitemapIncluded"),
    openGraphTitle: formData.get("openGraphTitle"),
    openGraphDescription: formData.get("openGraphDescription"),
    openGraphImageId: formData.get("openGraphImageId"),
    twitterTitle: formData.get("twitterTitle"),
    twitterDescription: formData.get("twitterDescription"),
    twitterImageId: formData.get("twitterImageId"),
  });

  if (!parsed.success) {
    return {
      ...productSeoFormInitialState,
      status: "error",
      message: "Données invalides.",
    };
  }

  return {
    ...productSeoFormInitialState,
    status: "success",
    message: "Paramètres SEO mis à jour.",
  };
};
