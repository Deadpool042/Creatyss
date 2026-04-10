"use server";

import { redirect } from "next/navigation";
import {
  getAdminHomepageCurrentHeroImagePath,
  updateAdminHomepage,
  AdminHomepageServiceError,
} from "@/features/admin/homepage";
import { getAdminMediaAssetById } from "@/features/admin/media";
import { validateHomepageInput } from "@/entities/homepage/homepage-input";

import { HomepageFormSchema } from "../schemas/homepage-form-schema";

function collectSortOrdersByPrefix(
  formData: FormData,
  prefix: string
): Record<string, FormDataEntryValue | null> {
  const sortOrders: Record<string, FormDataEntryValue | null> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith(prefix)) {
      continue;
    }

    const entityId = key.slice(prefix.length).trim();

    if (entityId.length === 0) {
      continue;
    }

    sortOrders[entityId] = value;
  }

  return sortOrders;
}

function mapHomepageTextError(field: PropertyKey | undefined): string {
  switch (field) {
    case "heroTitle":
      return "hero_title_too_long";
    case "heroText":
      return "hero_text_too_long";
    case "editorialTitle":
      return "editorial_title_too_long";
    case "editorialText":
      return "editorial_text_too_long";
    default:
      return "save_failed";
  }
}

export async function updateHomepageAction(formData: FormData): Promise<void> {
  const textParsed = HomepageFormSchema.safeParse({
    heroTitle: formData.get("heroTitle"),
    heroText: formData.get("heroText"),
    editorialTitle: formData.get("editorialTitle"),
    editorialText: formData.get("editorialText"),
  });

  if (!textParsed.success) {
    const code = mapHomepageTextError(textParsed.error.issues[0]?.path[0]);
    redirect(`/admin/content/homepage?error=${code}`);
  }

  const validation = validateHomepageInput({
    homepageId: formData.get("homepageId"),
    heroTitle: formData.get("heroTitle"),
    heroText: formData.get("heroText"),
    heroImageMediaAssetId: formData.get("heroImageMediaAssetId"),
    editorialTitle: formData.get("editorialTitle"),
    editorialText: formData.get("editorialText"),
    featuredProductIds: formData.getAll("featuredProductIds"),
    featuredProductSortOrders: collectSortOrdersByPrefix(formData, "featuredProductSortOrder:"),
    featuredCategoryIds: formData.getAll("featuredCategoryIds"),
    featuredCategorySortOrders: collectSortOrdersByPrefix(formData, "featuredCategorySortOrder:"),
    featuredBlogPostIds: formData.getAll("featuredBlogPostIds"),
    featuredBlogPostSortOrders: collectSortOrdersByPrefix(formData, "featuredBlogPostSortOrder:"),
  });

  if (!validation.ok) {
    redirect(`/admin/content/homepage?error=${validation.code}`);
  }

  let heroImagePath: string | null = null;

  if (validation.data.heroImage.kind === "keep_current") {
    heroImagePath = await getAdminHomepageCurrentHeroImagePath(validation.data.homepageId);
  } else if (validation.data.heroImage.kind === "media_asset") {
    const mediaAssetId = validation.data.heroImage.mediaAssetId;
    const mediaAsset = await getAdminMediaAssetById(mediaAssetId);

    if (mediaAsset === null) {
      redirect("/admin/content/homepage?error=hero_media_missing");
    }

    heroImagePath = mediaAsset.filePath;
  }

  try {
    await updateAdminHomepage({
      id: validation.data.homepageId,
      heroTitle: textParsed.data.heroTitle,
      heroText: textParsed.data.heroText,
      heroImagePath,
      editorialTitle: textParsed.data.editorialTitle,
      editorialText: textParsed.data.editorialText,
      featuredProducts: validation.data.featuredProducts,
      featuredCategories: validation.data.featuredCategories,
      featuredBlogPosts: validation.data.featuredBlogPosts,
    });
  } catch (error: unknown) {
    if (error instanceof AdminHomepageServiceError && error.code === "homepage_missing") {
      redirect("/admin/content/homepage?error=missing_homepage");
    }

    if (error instanceof AdminHomepageServiceError && error.code === "product_missing") {
      redirect("/admin/content/homepage?error=product_missing");
    }

    if (error instanceof AdminHomepageServiceError && error.code === "category_missing") {
      redirect("/admin/content/homepage?error=category_missing");
    }

    if (error instanceof AdminHomepageServiceError && error.code === "blog_post_missing") {
      redirect("/admin/content/homepage?error=blog_post_missing");
    }

    console.error(error);
    redirect("/admin/content/homepage?error=save_failed");
  }

  redirect("/admin/content/homepage?status=updated");
}
