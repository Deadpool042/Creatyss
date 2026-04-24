"use server";

import { productSeoFormSchema } from "../schemas";
import { productSeoFormInitialState, type ProductSeoFormAction } from "../types";
import { updateProductSeo } from "../services/update-product-seo.service";
import type { SeoIndexingMode } from "@/prisma-generated/client";
import type { ProductSeoFormState } from "../types/product-seo-form.types";
import { AdminProductEditorServiceError } from "../services";

function mapZodFieldErrors(
  errors: Record<string, string[] | undefined>
): ProductSeoFormState["fieldErrors"] {
  const result: ProductSeoFormState["fieldErrors"] = {};

  for (const [key, messages] of Object.entries(errors)) {
    const message = messages?.[0];
    if (!message) continue;
    result[key as keyof ProductSeoFormState["fieldErrors"]] = message;
  }

  return result;
}

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
    const flattened = parsed.error.flatten();
    const fieldErrors = mapZodFieldErrors(flattened.fieldErrors);

    return {
      ...productSeoFormInitialState,
      status: "error",
      message: flattened.formErrors[0] ?? "Données invalides.",
      fieldErrors,
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
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "media_asset_missing") {
        return {
          ...productSeoFormInitialState,
          status: "error",
          message: "L'image de partage sélectionnée est introuvable ou non exploitable.",
          fieldErrors: {
            openGraphImageId: "Image invalide.",
            twitterImageId: "Image invalide.",
          },
        };
      }
    }

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
