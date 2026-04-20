"use server";

import { productSeoFormSchema } from "../schemas";
import { productSeoFormInitialState, type ProductSeoFormAction } from "../types";
import { updateProductSeo } from "../services/update-product-seo.service";
import type { SeoIndexingMode } from "@/prisma-generated/client";

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

  try {
    await updateProductSeo({
      productId: parsed.data.productId,
      title: parsed.data.title,
      description: parsed.data.description,
      canonicalPath: parsed.data.canonicalPath,
      indexingMode: parsed.data.indexingMode as SeoIndexingMode,
      sitemapIncluded: parsed.data.sitemapIncluded === "true",
      openGraphTitle: parsed.data.openGraphTitle,
      openGraphDescription: parsed.data.openGraphDescription,
      openGraphImageId: parsed.data.openGraphImageId,
      twitterTitle: parsed.data.twitterTitle,
      twitterDescription: parsed.data.twitterDescription,
      twitterImageId: parsed.data.twitterImageId,
    });
  } catch {
    return {
      ...productSeoFormInitialState,
      status: "error",
      message: "Une erreur est survenue lors de la mise à jour des paramètres SEO.",
    };
  }

  return {
    ...productSeoFormInitialState,
    status: "success",
    message: "Paramètres SEO mis à jour.",
  };
};
