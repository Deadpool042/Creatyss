"use server";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import {
  seoSettingsSchema,
  type SeoSettingsFormState,
} from "@/features/admin/settings/schemas/seo-settings.schema";

export async function updateSeoSettingsAction(
  _prevState: SeoSettingsFormState,
  formData: FormData
): Promise<SeoSettingsFormState> {
  await requireAuthenticatedAdmin();

  const raw = {
    metaTitle: formData.get("metaTitle") || null,
    metaDescription: formData.get("metaDescription") || null,
    metaKeywords: formData.get("metaKeywords") || null,
    openGraphTitle: formData.get("openGraphTitle") || null,
    openGraphDescription: formData.get("openGraphDescription") || null,
    twitterTitle: formData.get("twitterTitle") || null,
    twitterDescription: formData.get("twitterDescription") || null,
    indexingMode: formData.get("indexingMode"),
    sitemapIncluded: formData.get("sitemapIncluded"),
  };

  const parsed = seoSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Certains champs sont invalides.",
      fieldErrors,
    };
  }

  try {
    const store = await db.store.findFirst({
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (!store) {
      return { status: "error", message: "Boutique introuvable." };
    }

    await db.seoMetadata.upsert({
      where: {
        storeId_subjectType_subjectId: {
          storeId: store.id,
          subjectType: "HOMEPAGE",
          subjectId: store.id,
        },
      },
      update: {
        metaTitle: parsed.data.metaTitle ?? null,
        metaDescription: parsed.data.metaDescription ?? null,
        metaKeywords: parsed.data.metaKeywords ?? null,
        openGraphTitle: parsed.data.openGraphTitle ?? null,
        openGraphDescription: parsed.data.openGraphDescription ?? null,
        twitterTitle: parsed.data.twitterTitle ?? null,
        twitterDescription: parsed.data.twitterDescription ?? null,
        indexingMode: parsed.data.indexingMode as never,
        sitemapIncluded: parsed.data.sitemapIncluded,
      },
      create: {
        storeId: store.id,
        subjectType: "HOMEPAGE",
        subjectId: store.id,
        status: "ACTIVE",
        metaTitle: parsed.data.metaTitle ?? null,
        metaDescription: parsed.data.metaDescription ?? null,
        metaKeywords: parsed.data.metaKeywords ?? null,
        openGraphTitle: parsed.data.openGraphTitle ?? null,
        openGraphDescription: parsed.data.openGraphDescription ?? null,
        twitterTitle: parsed.data.twitterTitle ?? null,
        twitterDescription: parsed.data.twitterDescription ?? null,
        indexingMode: parsed.data.indexingMode as never,
        sitemapIncluded: parsed.data.sitemapIncluded,
      },
    });

    return { status: "success", message: "Réglages SEO enregistrés." };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
