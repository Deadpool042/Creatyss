"use server";

import { redirect } from "next/navigation";
import { upsertAdminPrimaryProductImage } from "@/db/repositories/admin-product-image.repository";
import {
  appendImageScope,
  findAdminMediaAssetById,
  normalizeNumericIdFromForm,
} from "@/features/admin/products/actions/action-helpers";

type ProductPrimaryImageErrorCode =
  | "invalid_media_asset"
  | "media_missing"
  | "missing_media_asset"
  | "save_failed";

function readMediaAssetId(value: FormDataEntryValue | null):
  | {
      ok: true;
      mediaAssetId: string;
    }
  | {
      ok: false;
      code: "missing_media_asset" | "invalid_media_asset";
    } {
  if (value === null || (typeof value === "string" && value.trim().length === 0)) {
    return {
      ok: false,
      code: "missing_media_asset",
    };
  }

  const mediaAssetId = normalizeNumericIdFromForm(value);

  if (mediaAssetId === null) {
    return {
      ok: false,
      code: "invalid_media_asset",
    };
  }

  return {
    ok: true,
    mediaAssetId,
  };
}

function redirectToProductPrimaryImageError(
  productId: string,
  code: ProductPrimaryImageErrorCode
): never {
  redirect(appendImageScope(`/admin/products/${productId}?image_error=${code}`, "product"));
}

function redirectToProductPrimaryImageStatus(productId: string, status: "primary_updated"): never {
  redirect(appendImageScope(`/admin/products/${productId}?image_status=${status}`, "product"));
}

export async function setProductPrimaryImageAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const mediaAssetResult = readMediaAssetId(formData.get("mediaAssetId"));

  if (!mediaAssetResult.ok) {
    redirectToProductPrimaryImageError(productId, mediaAssetResult.code);
  }

  const mediaAsset = await findAdminMediaAssetById(mediaAssetResult.mediaAssetId);

  if (mediaAsset === null) {
    redirectToProductPrimaryImageError(productId, "media_missing");
  }

  try {
    const image = await upsertAdminPrimaryProductImage({
      productId,
      filePath: mediaAsset.filePath,
    });

    if (image === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    console.error(error);
    redirectToProductPrimaryImageError(productId, "save_failed");
  }

  redirectToProductPrimaryImageStatus(productId, "primary_updated");
}
