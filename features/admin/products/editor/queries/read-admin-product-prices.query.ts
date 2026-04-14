import { db } from "@/core/db";
import type {
  AdminProductPricingData,
  AdminPriceEntry,
  AdminVariantPriceEntry,
} from "@/features/admin/products/editor/types";

type ReadAdminProductPricesInput = {
  productId: string;
};

export async function readAdminProductPrices(
  input: ReadAdminProductPricesInput
): Promise<AdminProductPricingData> {
  const [productPricesRaw, variants] = await Promise.all([
    db.productPrice.findMany({
      where: { productId: input.productId, archivedAt: null },
      select: {
        id: true,
        priceListId: true,
        amount: true,
        compareAtAmount: true,
        costAmount: true,
      },
    }),
    db.productVariant.findMany({
      where: { productId: input.productId, archivedAt: null },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        sku: true,
        prices: {
          where: { archivedAt: null },
          select: {
            id: true,
            priceListId: true,
            amount: true,
            compareAtAmount: true,
            costAmount: true,
          },
        },
      },
    }),
  ]);

  const productPrices: AdminPriceEntry[] = productPricesRaw.map((p) => ({
    id: p.id,
    priceListId: p.priceListId,
    amount: p.amount.toString(),
    compareAtAmount: p.compareAtAmount?.toString() ?? null,
    costAmount: p.costAmount?.toString() ?? null,
  }));

  const variantPrices: AdminVariantPriceEntry[] = variants.map((v) => ({
    variantId: v.id,
    variantName: v.name,
    variantSku: v.sku,
    prices: v.prices.map((p) => ({
      id: p.id,
      priceListId: p.priceListId,
      amount: p.amount.toString(),
      compareAtAmount: p.compareAtAmount?.toString() ?? null,
      costAmount: p.costAmount?.toString() ?? null,
    })),
  }));

  return {
    productId: input.productId,
    productPrices,
    variantPrices,
  };
}
