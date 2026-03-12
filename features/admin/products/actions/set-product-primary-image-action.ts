"use server";

import { redirect } from "next/navigation";
import { upsertAdminPrimaryProductImage } from "@/db/repositories/admin-product-image.repository";
import {
  appendImageScope,
  findAdminMediaAssetById,
  normalizeNumericIdFromForm
} from "@/features/admin/products/actions/action-helpers";

function readMediaAssetId(
  value: FormDataEntryValue | null
):
  | {
      ok: true;
      mediaAssetId: string;
    }
  | {
      ok: false;
      code: "missing_media_asset" | "invalid_media_asset";
    } {
  if (typeof value !== "string") {
    return {
      ok: false,
      code: "missing_media_asset"
    };
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return {
      ok: false,
      code: "missing_media_asset"
    };
  }

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return {
      ok: false,
      code: "invalid_media_asset"
    };
  }

  return {
    ok: true,
    mediaAssetId: normalizedValue
  };
}

export async function setProductPrimaryImageAction(
  formData: FormData
): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const mediaAssetResult = readMediaAssetId(formData.get("mediaAssetId"));

  if (!mediaAssetResult.ok) {
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=${mediaAssetResult.code}`,
        "product"
      )
    );
  }

  const mediaAsset = await findAdminMediaAssetById(mediaAssetResult.mediaAssetId);

  if (mediaAsset === null) {
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=media_missing`,
        "product"
      )
    );
  }

  try {
    const image = await upsertAdminPrimaryProductImage({
      productId,
      filePath: mediaAsset.filePath
    });

    if (image === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    console.error(error);
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=save_failed`,
        "product"
      )
    );
  }

  redirect(
    appendImageScope(
      `/admin/products/${productId}?image_status=primary_updated`,
      "product"
    )
  );
}
