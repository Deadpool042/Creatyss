"use server";

import { redirect } from "next/navigation";
import { upsertAdminPrimaryVariantImage } from "@/db/repositories/products/admin-product-image.repository";
import { AdminProductImageRepositoryError } from "@/db/repositories/products/admin-product-image.types";
import {
  appendImageScope,
  findAdminMediaAssetById,
  normalizeNumericIdFromForm,
} from "@/features/admin/products/actions/action-helpers";

type VariantPrimaryImageErrorCode =
  | "invalid_media_asset"
  | "invalid_variant"
  | "media_missing"
  | "missing_media_asset"
  | "save_failed"
  | "variant_missing";

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

function readVariantId(value: FormDataEntryValue | null):
  | {
      ok: true;
      variantId: string;
    }
  | {
      ok: false;
      code: "invalid_variant";
    } {
  const variantId = normalizeNumericIdFromForm(value);

  if (variantId === null) {
    return {
      ok: false,
      code: "invalid_variant",
    };
  }

  return {
    ok: true,
    variantId,
  };
}

function redirectToVariantPrimaryImageError(
  productId: string,
  code: VariantPrimaryImageErrorCode
): never {
  redirect(appendImageScope(`/admin/products/${productId}?image_error=${code}`, "variant"));
}

function redirectToVariantPrimaryImageStatus(productId: string, status: "primary_updated"): never {
  redirect(appendImageScope(`/admin/products/${productId}?image_status=${status}`, "variant"));
}

export async function setVariantPrimaryImageAction(formData: FormData): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const variantResult = readVariantId(formData.get("variantId"));

  if (!variantResult.ok) {
    redirectToVariantPrimaryImageError(productId, variantResult.code);
  }

  const mediaAssetResult = readMediaAssetId(formData.get("mediaAssetId"));

  if (!mediaAssetResult.ok) {
    redirectToVariantPrimaryImageError(productId, mediaAssetResult.code);
  }

  const mediaAsset = await findAdminMediaAssetById(mediaAssetResult.mediaAssetId);

  if (mediaAsset === null) {
    redirectToVariantPrimaryImageError(productId, "media_missing");
  }

  try {
    const image = await upsertAdminPrimaryVariantImage({
      productId,
      variantId: variantResult.variantId,
      filePath: mediaAsset.filePath,
    });

    if (image === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    if (
      error instanceof AdminProductImageRepositoryError &&
      (error.code === "variant_id_invalid" || error.code === "variant_not_found")
    ) {
      redirectToVariantPrimaryImageError(productId, "variant_missing");
    }

    console.error(error);
    redirectToVariantPrimaryImageError(productId, "save_failed");
  }

  redirectToVariantPrimaryImageStatus(productId, "primary_updated");
}
