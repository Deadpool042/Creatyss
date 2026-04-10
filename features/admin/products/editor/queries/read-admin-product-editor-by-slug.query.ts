import { db } from "@/core/db";
import type { AdminProductEditorData } from "../types";
import { getAdminProductEditorData } from "./get-admin-product-editor-data.query";

export async function readAdminProductEditorBySlug(
  slug: string
): Promise<AdminProductEditorData | null> {
  const product = await db.product.findFirst({
    where: {
      slug,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (product === null) {
    return null;
  }

  return getAdminProductEditorData({
    productId: product.id,
  });
}
