"use server";

import { redirect } from "next/navigation";
import { listAdminMediaAssets } from "@/db/repositories/admin-media.repository";
import { updateAdminCategoryImage } from "@/db/repositories/admin-category.repository";

function normalizeCategoryId(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export async function setCategoryImageAction(formData: FormData): Promise<void> {
  const categoryId = normalizeCategoryId(formData.get("categoryId"));

  if (categoryId === null) {
    redirect("/admin/categories?error=missing_category");
  }

  const mediaAssetId =
    typeof formData.get("mediaAssetId") === "string"
      ? (formData.get("mediaAssetId") as string).trim()
      : null;

  if (!mediaAssetId || mediaAssetId.length === 0) {
    redirect(`/admin/categories/${categoryId}?image_error=missing_media`);
  }

  const mediaAssets = await listAdminMediaAssets();
  const mediaAsset = mediaAssets.find((asset) => asset.id === mediaAssetId);

  if (mediaAsset === undefined) {
    redirect(`/admin/categories/${categoryId}?image_error=media_not_found`);
  }

  const category = await updateAdminCategoryImage({
    id: categoryId,
    imagePath: mediaAsset.filePath,
  });

  if (category === null) {
    redirect("/admin/categories?error=missing_category");
  }

  redirect(`/admin/categories/${categoryId}?image_status=updated`);
}
