"use server";

import { redirect } from "next/navigation";
import { deleteAdminPrimaryVariantImage } from "@/db/repositories/admin-product-image.repository";
import { appendImageScope, normalizeNumericIdFromForm } from "./action-helpers";

type VariantPrimaryImageDeleteErrorCode =
  | "delete_failed"
  | "invalid_variant"
  | "missing_image";

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
  const variantId = normalizeNumericIdFromForm(value);

  if (variantId === null) {
    return {
      ok: false,
      code: "invalid_variant"
    };
  }

  return {
    ok: true,
    variantId
  };
}

function redirectToVariantPrimaryImageError(
  productId: string,
  code: VariantPrimaryImageDeleteErrorCode
): never {
  redirect(
    appendImageScope(`/admin/products/${productId}?image_error=${code}`, "variant")
  );
}

function redirectToVariantPrimaryImageStatus(
  productId: string,
  status: "primary_deleted"
): never {
  redirect(
    appendImageScope(`/admin/products/${productId}?image_status=${status}`, "variant")
  );
}

export async function deleteVariantPrimaryImageAction(
  formData: FormData
): Promise<void> {
  const productId = normalizeNumericIdFromForm(formData.get("productId"));

  if (productId === null) {
    redirect("/admin/products?error=missing_product");
  }

  const variantResult = readVariantId(formData.get("variantId"));

  if (!variantResult.ok) {
    redirectToVariantPrimaryImageError(productId, variantResult.code);
  }

  try {
    const wasDeleted = await deleteAdminPrimaryVariantImage(
      productId,
      variantResult.variantId
    );

    if (!wasDeleted) {
      redirectToVariantPrimaryImageError(productId, "missing_image");
    }
  } catch (error) {
    console.error(error);
    redirectToVariantPrimaryImageError(productId, "delete_failed");
  }

  redirectToVariantPrimaryImageStatus(productId, "primary_deleted");
}
