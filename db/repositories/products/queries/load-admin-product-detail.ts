import type { PrismaClient } from "@prisma/client";
import {
  resolveSimpleProductOffer,
  type SimpleProductOffer,
  type SimpleProductOfferFields,
} from "@/entities/product/simple-product-offer";
import type { ProductType } from "@/entities/product/product-input";
import type {
  AdminProductCategoryAssignment,
  AdminProductDetail,
  AdminProductStatus,
} from "../admin-product.types";
import type { TxClient } from "../types/tx-client";

type AnyPrismaClient = TxClient | PrismaClient;

export async function loadAdminProductDetail(
  client: AnyPrismaClient,
  productId: string
): Promise<AdminProductDetail | null> {
  const product = await client.products.findUnique({
    where: { id: BigInt(productId) },
    include: {
      product_categories: {
        include: { categories: true },
      },
    },
  });

  if (product === null) {
    return null;
  }

  const nativeSimpleOfferFields: SimpleProductOfferFields = {
    sku: product.simple_sku,
    price: product.simple_price !== null ? product.simple_price.toString() : null,
    compareAtPrice:
      product.simple_compare_at_price !== null
        ? product.simple_compare_at_price.toString()
        : null,
    stockQuantity: product.simple_stock_quantity,
  };

  const categories: AdminProductCategoryAssignment[] = [...product.product_categories]
    .sort((a, b) => {
      const nameCompare = a.categories.name
        .toLowerCase()
        .localeCompare(b.categories.name.toLowerCase());
      if (nameCompare !== 0) return nameCompare;
      return a.category_id < b.category_id ? -1 : a.category_id > b.category_id ? 1 : 0;
    })
    .map((pc) => ({
      id: pc.category_id.toString(),
      name: pc.categories.name,
      slug: pc.categories.slug,
    }));

  let simpleOffer: SimpleProductOffer | null = null;

  if (product.product_type === "simple") {
    const legacyVariants = await client.product_variants.findMany({
      where: { product_id: BigInt(productId) },
      orderBy: [{ is_default: "desc" }, { id: "asc" }],
    });

    const legacyOffers: SimpleProductOfferFields[] = legacyVariants.map((v) => ({
      sku: v.sku,
      price: v.price.toString(),
      compareAtPrice: v.compare_at_price !== null ? v.compare_at_price.toString() : null,
      stockQuantity: v.stock_quantity,
    }));

    simpleOffer = resolveSimpleProductOffer({ native: nativeSimpleOfferFields, legacyOffers });
  }

  return {
    id: product.id.toString(),
    name: product.name,
    slug: product.slug,
    shortDescription: product.short_description,
    description: product.description,
    seoTitle: product.seo_title,
    seoDescription: product.seo_description,
    status: product.status as AdminProductStatus,
    productType: product.product_type as ProductType,
    isFeatured: product.is_featured,
    categories,
    categoryIds: categories.map((c) => c.id),
    simpleOfferFields: nativeSimpleOfferFields,
    simpleOffer,
    createdAt: product.created_at.toISOString(),
    updatedAt: product.updated_at.toISOString(),
  };
}
