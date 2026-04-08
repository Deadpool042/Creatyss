import { db } from "@/core/db";
import { mapAdminProductVariantListItem } from "@/features/admin/products/editor/mappers";
import type { AdminProductVariantEditorData } from "@/features/admin/products/editor/types";

export async function readAdminProductVariants(
  productId: string
): Promise<AdminProductVariantEditorData | null> {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      slug: true,
      variants: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          productId: true,
          slug: true,
          name: true,
          sku: true,
          status: true,
          isDefault: true,
          sortOrder: true,
          primaryImageId: true,
          primaryImage: {
            select: {
              publicUrl: true,
              altText: true,
            },
          },
          prices: {
            where: {
              isActive: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              amount: true,
              compareAtAmount: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    productId: product.id,
    productSlug: product.slug,
    variants: product.variants.map(mapAdminProductVariantListItem),
  };
}
