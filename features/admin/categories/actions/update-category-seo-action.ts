"use server";

import type { SeoIndexingMode } from "@/prisma-generated/client";

import { categorySeoFormSchema } from "../schemas/category-seo-form.schema";
import { updateCategorySeo } from "../services/update-category-seo.service";

type CategorySeoActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialCategorySeoActionState: CategorySeoActionState = {
  status: "idle",
  message: "",
};

export async function updateCategorySeoAction(
  _previousState: CategorySeoActionState,
  formData: FormData
): Promise<CategorySeoActionState> {
  const parsed = categorySeoFormSchema.safeParse({
    categoryId: formData.get("categoryId"),
    title: formData.get("title"),
    description: formData.get("description"),
    canonicalPath: formData.get("canonicalPath"),
    indexingMode: formData.get("indexingMode"),
    sitemapIncluded: formData.get("sitemapIncluded"),
    openGraphTitle: formData.get("openGraphTitle"),
    openGraphDescription: formData.get("openGraphDescription"),
    twitterTitle: formData.get("twitterTitle"),
    twitterDescription: formData.get("twitterDescription"),
  });

  if (!parsed.success) {
    return {
      ...initialCategorySeoActionState,
      status: "error",
      message: "Données invalides.",
    };
  }

  try {
    await updateCategorySeo({
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      description: parsed.data.description,
      canonicalPath: parsed.data.canonicalPath,
      indexingMode: parsed.data.indexingMode as SeoIndexingMode,
      sitemapIncluded: parsed.data.sitemapIncluded === "true",
      openGraphTitle: parsed.data.openGraphTitle,
      openGraphDescription: parsed.data.openGraphDescription,
      twitterTitle: parsed.data.twitterTitle,
      twitterDescription: parsed.data.twitterDescription,
    });
  } catch {
    return {
      ...initialCategorySeoActionState,
      status: "error",
      message: "Impossible de mettre à jour les paramètres SEO.",
    };
  }

  return {
    ...initialCategorySeoActionState,
    status: "success",
    message: "Paramètres SEO mis à jour.",
  };
}
