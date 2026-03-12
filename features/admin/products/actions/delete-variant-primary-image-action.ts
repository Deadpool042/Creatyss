"use server";

import { redirect } from "next/navigation";
import { deleteAdminPrimaryVariantImage } from "@/db/repositories/admin-product-image.repository";
import { appendImageScope, normalizeNumericIdFromForm } from "./action-helpers";

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

export async function deleteVariantPrimaryImageAction(
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

  try {
    const wasDeleted = await deleteAdminPrimaryVariantImage(
      productId,
      variantResult.variantId
    );

    if (!wasDeleted) {
      redirect(
        appendImageScope(
          `/admin/products/${productId}?image_error=missing_image`,
          "variant"
        )
      );
    }
  } catch (error) {
    console.error(error);
    redirect(
      appendImageScope(
        `/admin/products/${productId}?image_error=delete_failed`,
        "variant"
      )
    );
  }

  redirect(
    appendImageScope(
      `/admin/products/${productId}?image_status=primary_deleted`,
      "variant"
    )
  );
}
