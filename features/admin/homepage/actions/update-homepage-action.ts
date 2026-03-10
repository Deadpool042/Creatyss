"use server";

import { redirect } from "next/navigation";
import { listAdminMediaAssets } from "@/db/admin-media";
import {
  AdminHomepageRepositoryError,
  updateAdminHomepage
} from "@/db/repositories/admin-homepage.repository";
import { validateHomepageInput } from "@/entities/homepage/homepage-input";

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

export async function updateHomepageAction(formData: FormData): Promise<void> {
  const validation = validateHomepageInput({
    homepageId: formData.get("homepageId"),
    heroTitle: formData.get("heroTitle"),
    heroText: formData.get("heroText"),
    currentHeroImagePath: formData.get("currentHeroImagePath"),
    heroImageMediaAssetId: formData.get("heroImageMediaAssetId"),
    editorialTitle: formData.get("editorialTitle"),
    editorialText: formData.get("editorialText"),
    featuredProductIds: formData.getAll("featuredProductIds"),
    featuredProductSortOrders: collectSortOrdersByPrefix(
      formData,
      "featuredProductSortOrder:"
    ),
    featuredCategoryIds: formData.getAll("featuredCategoryIds"),
    featuredCategorySortOrders: collectSortOrdersByPrefix(
      formData,
      "featuredCategorySortOrder:"
    ),
    featuredBlogPostIds: formData.getAll("featuredBlogPostIds"),
    featuredBlogPostSortOrders: collectSortOrdersByPrefix(
      formData,
      "featuredBlogPostSortOrder:"
    )
  });

  if (!validation.ok) {
    redirect(`/admin/homepage?error=${validation.code}`);
  }

  let heroImagePath: string | null = null;

  if (validation.data.heroImage.kind === "keep_current") {
    heroImagePath = validation.data.heroImage.filePath;
  } else if (validation.data.heroImage.kind === "media_asset") {
    const mediaAssetId = validation.data.heroImage.mediaAssetId;
    const mediaAssets = await listAdminMediaAssets();
    const mediaAsset = mediaAssets.find((asset) => asset.id === mediaAssetId);

    if (mediaAsset === undefined) {
      redirect("/admin/homepage?error=hero_media_missing");
    }

    heroImagePath = mediaAsset.filePath;
  }

  let wasUpdated = false;

  try {
    const homepage = await updateAdminHomepage({
      id: validation.data.homepageId,
      heroTitle: validation.data.heroTitle,
      heroText: validation.data.heroText,
      heroImagePath,
      editorialTitle: validation.data.editorialTitle,
      editorialText: validation.data.editorialText,
      featuredProducts: validation.data.featuredProducts,
      featuredCategories: validation.data.featuredCategories,
      featuredBlogPosts: validation.data.featuredBlogPosts
    });

    wasUpdated = homepage !== null;
  } catch (error) {
    if (
      error instanceof AdminHomepageRepositoryError &&
      error.code === "homepage_missing"
    ) {
      redirect("/admin/homepage?error=missing_homepage");
    }

    if (
      error instanceof AdminHomepageRepositoryError &&
      error.code === "product_missing"
    ) {
      redirect("/admin/homepage?error=product_missing");
    }

    if (
      error instanceof AdminHomepageRepositoryError &&
      error.code === "category_missing"
    ) {
      redirect("/admin/homepage?error=category_missing");
    }

    if (
      error instanceof AdminHomepageRepositoryError &&
      error.code === "blog_post_missing"
    ) {
      redirect("/admin/homepage?error=blog_post_missing");
    }

    console.error(error);
    redirect("/admin/homepage?error=save_failed");
  }

  if (!wasUpdated) {
    redirect("/admin/homepage?error=missing_homepage");
  }

  redirect("/admin/homepage?status=updated");
}
