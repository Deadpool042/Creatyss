"use server";

import { refresh } from "next/cache";

import type { AdminProductActionResult } from "@/features/admin/products/types";
import { PRODUCT_LIFECYCLE_FEEDBACK_COPY } from "@/features/admin/products/config";
import {
  archiveProduct,
  deleteProductPermanently,
  restoreProduct,
} from "@/features/admin/products/services";

// ---------------------------------------------------------------------------
// archiveProductBySlugAction
// ---------------------------------------------------------------------------

export async function archiveProductBySlugAction(
  productSlug: string
): Promise<AdminProductActionResult> {
  const normalizedProductSlug = productSlug.trim();

  if (normalizedProductSlug.length === 0) {
    return {
      status: "error",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.notFound,
    };
  }

  try {
    await archiveProduct({
      productSlug: normalizedProductSlug,
    });

    refresh();

    return {
      status: "success",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.archiveSuccess,
    };
  } catch {
    return {
      status: "error",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.archiveError,
    };
  }
}

// ---------------------------------------------------------------------------
// deleteProductPermanentlyBySlugAction
// ---------------------------------------------------------------------------

type DeleteProductPermanentlyActionInput = {
  productSlug: string;
};

export async function deleteProductPermanentlyBySlugAction(
  input: DeleteProductPermanentlyActionInput
): Promise<AdminProductActionResult> {
  const normalizedProductSlug = input.productSlug.trim();

  if (normalizedProductSlug.length === 0) {
    return {
      status: "error",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.invalid,
    };
  }

  try {
    await deleteProductPermanently({
      productSlug: normalizedProductSlug,
    });

    refresh();

    return {
      status: "success",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.deleteSuccess,
    };
  } catch {
    return {
      status: "error",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.deleteError,
    };
  }
}

// ---------------------------------------------------------------------------
// restoreProductBySlugAction
// ---------------------------------------------------------------------------

export async function restoreProductBySlugAction(
  productSlug: string
): Promise<AdminProductActionResult> {
  const normalizedProductSlug = productSlug.trim();

  if (normalizedProductSlug.length === 0) {
    return {
      status: "error",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.notFound,
    };
  }

  try {
    await restoreProduct({
      productSlug: normalizedProductSlug,
    });

    refresh();

    return {
      status: "success",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.restoreSuccess,
    };
  } catch {
    return {
      status: "error",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.restoreError,
    };
  }
}
