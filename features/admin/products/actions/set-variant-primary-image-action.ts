"use server";

import { redirect } from "next/navigation";
import {
  AdminProductImageRepositoryError,
  upsertAdminPrimaryVariantImage
} from "@/db/repositories/admin-product-image.repository";
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

function readVariantId(
  value: FormDataEntryValue | null
):
  | {
      ok: true;
      variantId: string;
    }
  | {
      ok: false;
      code: "invalid_variant";
    } {
  if (typeof value !== "string") {
    return {
      ok: false,
      code: "invalid_variant"
    };
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return {
      ok: false,
      code: "invalid_variant"
    };
  }

  return {
    ok: true,
    variantId: normalizedValue
  };
}

export async function setVariantPrimaryImageAction(
  formData: FormData
): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const variantResult = readVariantId(formData.get("variantId"));

  if (!variantResult.ok) {
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=${variantResult.code}`,
        "variant"
      )
    );
  }

  const mediaAssetResult = readMediaAssetId(formData.get("mediaAssetId"));

  if (!mediaAssetResult.ok) {
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=${mediaAssetResult.code}`,
        "variant"
      )
    );
  }

  const mediaAsset = await findAdminMediaAssetById(mediaAssetResult.mediaAssetId);

  if (mediaAsset === null) {
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=media_missing`,
        "variant"
      )
    );
  }

  try {
    const image = await upsertAdminPrimaryVariantImage({
      productId,
      variantId: variantResult.variantId,
      filePath: mediaAsset.filePath
    });

    if (image === null) {
      redirect("/admin/products?error=missing_product");
    }
  } catch (error) {
    if (
      error instanceof AdminProductImageRepositoryError &&
      error.code === "variant_missing"
    ) {
      redirect(
        appendImageScope(
          `/admin/products/${productId}?image_error=variant_missing`,
          "variant"
        )
      );
    }

    console.error(error);
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=save_failed`,
        "variant"
      )
    );
  }

  redirect(
    appendImageScope(
      `/admin/products/${productId}?image_status=primary_updated`,
      "variant"
    )
  );
}
