import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminDiscountTargetProductOption = Readonly<{
  id: string;
  name: string;
  slug: string;
}>;

export type AdminDiscountTargetCategoryOption = Readonly<{
  id: string;
  name: string;
  slug: string;
}>;

export type AdminDiscountTargetVariantOption = Readonly<{
  id: string;
  productName: string;
  variantName: string | null;
  sku: string;
}>;

export type AdminDiscountTargetOptions = Readonly<{
  products: readonly AdminDiscountTargetProductOption[];
  variants: readonly AdminDiscountTargetVariantOption[];
  categories: readonly AdminDiscountTargetCategoryOption[];
}>;

export async function listDiscountTargetOptions(): Promise<AdminDiscountTargetOptions> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { products: [], variants: [], categories: [] };
  }

  const [products, variants, categories] = await Promise.all([
    db.product.findMany({
      where: {
        storeId,
        archivedAt: null,
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 200,
    }),
    db.productVariant.findMany({
      where: {
        product: {
          storeId,
          archivedAt: null,
        },
        archivedAt: null,
      },
      orderBy: [
        { product: { name: "asc" } },
        { sortOrder: "asc" },
        { sku: "asc" },
        { id: "asc" },
      ],
      select: {
        id: true,
        name: true,
        sku: true,
        product: {
          select: {
            name: true,
          },
        },
      },
      take: 300,
    }),
    db.category.findMany({
      where: {
        storeId,
        archivedAt: null,
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 200,
    }),
  ]);

  return {
    products,
    variants: variants.map((variant) => ({
      id: variant.id,
      productName: variant.product.name,
      variantName: variant.name,
      sku: variant.sku,
    })),
    categories,
  };
}
