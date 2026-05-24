"use server";

import { refresh } from "next/cache";

import { db } from "@/core/db";
import { PRODUCT_LIFECYCLE_FEEDBACK_COPY } from "@/features/admin/products/config";
import { deleteProductSchema } from "../schemas";
import type {
  DeleteProductInput,
  DeleteProductResult,
} from "@/features/admin/products/editor/types/product-editor.types";
import { archiveProduct } from "@/features/admin/products/actions/product-lifecycle-services";

export async function deleteProductAction(input: DeleteProductInput): Promise<DeleteProductResult> {
  const parsed = deleteProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour la suppression du produit.",
    };
  }

  const product = await db.product.findFirst({
    where: {
      id: parsed.data.productId,
      archivedAt: null,
    },
    select: {
      slug: true,
    },
  });

  if (product === null) {
    return {
      status: "error",
      message: PRODUCT_LIFECYCLE_FEEDBACK_COPY.notFound,
    };
  }

  try {
    await archiveProduct({
      productSlug: product.slug,
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
