"use server";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  seoSettingsSchema,
  type SeoSettingsFormState,
} from "@/features/admin/settings/schemas/seo-settings.schema";

export async function updateSeoSettingsAction(
  _prevState: SeoSettingsFormState,
  formData: FormData
): Promise<SeoSettingsFormState> {
  await requireAdminCapability("admin.settings.seo.write");

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
    const storeId = await getCurrentStoreId();

    if (storeId === null) {
      return { status: "error", message: "Boutique introuvable." };
    }

    await db.seoMetadata.upsert({
      where: {
        storeId_subjectType_subjectId: {
          storeId,
          subjectType: "HOMEPAGE",
          subjectId: storeId,
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
        storeId,
        subjectType: "HOMEPAGE",
        subjectId: storeId,
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
